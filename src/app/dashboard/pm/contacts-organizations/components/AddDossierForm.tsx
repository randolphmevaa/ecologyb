"use client";

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddDossierFormProps {
  contactId: string;
  onClose: () => void;
}

interface DossierData {
  // Le numéro est généré par le backend
  numero: string;
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam: string;
  informationLogement: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
  };
  informationTravaux: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
  notes: string;
  contactId: string;
}

// Helper function to generate a random dossier number in the format DOS-YYYY-XXX
const generateDossierNumero = () => {
  const year = new Date().getFullYear();
  // Generate a random number between 1 and 999
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  // Pad the random number with leading zeros to always have 3 digits
  return `DOS-${year}-${String(randomNumber).padStart(3, "0")}`;
};

export default function AddDossierForm({ contactId, onClose }: AddDossierFormProps) {
  // State to hold the contact name (initially "Chargement..." until fetched)
  const [, setContactName] = useState("Chargement...");

  // Initialisation des données du dossier.
  const [dossierData, setDossierData] = useState<DossierData>({
    numero: generateDossierNumero(), // Ce champ est en lecture seule
    client: "", // sera mis à jour après le fetch
    projet: "",
    solution: "",
    etape: "",
    valeur: "",
    assignedTeam: "",
    notes: "",
    informationLogement: {
      typeDeLogement: "",
      surfaceHabitable: "",
      anneeConstruction: "",
      systemeChauffage: "",
    },
    informationTravaux: {
      typeTravaux: "",
      typeUtilisation: "",
      surfaceChauffee: "",
      circuitChauffageFonctionnel: "",
    },
    contactId,
  });

  // Récupérer les informations du contact depuis /api/contacts en fonction du contactId.
  useEffect(() => {
    fetch(`/api/contacts?id=${contactId}`)
      .then((res) => res.json())
      .then((data) => {
        // Supposons que la réponse est soit un objet contact, soit un tableau d'objets.
        let contact;
        if (Array.isArray(data)) {
          contact = data[0];
        } else {
          contact = data;
        }
        // Utiliser "name" si disponible, sinon concaténer firstName et lastName.
        const name =
          contact?.name ||
          `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
        const finalName = name || "Client inconnu";
        setContactName(finalName);
        // Mettre à jour le champ client dans dossierData.
        setDossierData((prev) => ({ ...prev, client: finalName }));
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du contact :", err);
        setContactName("Client inconnu");
        setDossierData((prev) => ({ ...prev, client: "Client inconnu" }));
      });
  }, [contactId]);

  interface User {
    _id: string;
    email: string;
    role: string;
  }  

  // Pour le dropdown "Équipe assignée", récupérer la liste des utilisateurs depuis /api/users.
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération des utilisateurs :", err)
      );
  }, []);

  // Gestion des changements pour les champs simples et imbriqués.
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
  
      // Only handle nested updates for known nested keys.
      if (parent === "informationLogement" || parent === "informationTravaux") {
        setDossierData((prev) => ({
          ...prev,
          [parent]: {
            // Here, we assert that prev[parent] is an object of type Record<string, string>
            ...((prev[parent] as Record<string, string>) ?? {}),
            [child]: value,
          },
        }));
      }
    } else {
      setDossierData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Soumission du formulaire : envoyer les données via POST à /api/dossiers.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dossierData),
      });
      if (res.ok) {
        onClose();
      } else {
        console.error("Échec de la création du dossier");
      }
    } catch (err) {
      console.error("Erreur lors de la soumission du dossier :", err);
    }
  };

  return (
    // Conteneur modal large et scrollable
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-4xl w-full mx-4 bg-white p-8 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">Ajouter un dossier</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* N° Dossier (auto-généré) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">N° Dossier</label>
            <input
              type="text"
              name="numero"
              value={dossierData.numero}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>
          {/* Client - affichage du nom du contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <input
              type="text"
              name="client"
              value={dossierData.client}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>
          {/* Nom du projet */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du projet</label>
            <input
              type="text"
              name="projet"
              value={dossierData.projet}
              onChange={handleChange}
              required
              placeholder="Entrez le nom du projet"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Solution</label>
            <select
              name="solution"
              value={dossierData.solution}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Sélectionner une solution</option>
              <option value="Pompes à chaleur">Pompes à chaleur</option>
              <option value="Chauffe-eau solaire individuel">Chauffe-eau solaire individuel</option>
              <option value="Chauffe-eau thermodynamique">Chauffe-eau thermodynamique</option>
              <option value="Système Solaire Combiné">Système Solaire Combiné</option>
            </select>
          </div>
          {/* Étape */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Étape</label>
            <select
              name="etape"
              value={dossierData.etape}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Sélectionner une étape</option>
              <option value="1 Prise de contact">1 Prise de contact</option>
              <option value="2 En attente des documents">2 En attente des documents</option>
              <option value="3 Instruction du dossier">3 Instruction du dossier</option>
              <option value="4 Dossier Accepté">4 Dossier Accepté</option>
              <option value="5 Installation">5 Installation</option>
              <option value="6 Contrôle">6 Contrôle</option>
              <option value="7 Dossier Clôturé">7 Dossier Clôturé</option>
            </select>
          </div>
          {/* Valeur */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Valeur</label>
            <input
              type="text"
              name="valeur"
              value={dossierData.valeur}
              onChange={handleChange}
              required
              placeholder="Ex : 200000€"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Équipe assignée */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Équipe assignée</label>
            <select
              name="assignedTeam"
              value={dossierData.assignedTeam}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Sélectionner une équipe</option>
              {users.map((user) => (
                <option key={user._id} value={`${user.email} (${user.role})`}>
                  {user.email} ({user.role})
                </option>
              ))}
            </select>
          </div>
          {/* Informations sur le logement */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700">Informations sur le logement</legend>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type de logement</label>
                <input
                  type="text"
                  name="informationLogement.typeDeLogement"
                  value={dossierData.informationLogement.typeDeLogement}
                  onChange={handleChange}
                  placeholder="Ex : Appartement, Maison, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Surface habitable</label>
                <input
                  type="text"
                  name="informationLogement.surfaceHabitable"
                  value={dossierData.informationLogement.surfaceHabitable}
                  onChange={handleChange}
                  placeholder="Ex : 120 m²"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Année de construction</label>
                <input
                  type="text"
                  name="informationLogement.anneeConstruction"
                  value={dossierData.informationLogement.anneeConstruction}
                  onChange={handleChange}
                  placeholder="Ex : 1998"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Système de chauffage</label>
                <input
                  type="text"
                  name="informationLogement.systemeChauffage"
                  value={dossierData.informationLogement.systemeChauffage}
                  onChange={handleChange}
                  placeholder="Ex : Gaz, Électrique, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          </fieldset>
          {/* Informations sur les travaux */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700">Informations sur les travaux</legend>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type de travaux</label>
                <input
                  type="text"
                  name="informationTravaux.typeTravaux"
                  value={dossierData.informationTravaux.typeTravaux}
                  onChange={handleChange}
                  placeholder="Ex : Rénovation énergétique"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type d&apos;utilisation</label>
                <input
                  type="text"
                  name="informationTravaux.typeUtilisation"
                  value={dossierData.informationTravaux.typeUtilisation}
                  onChange={handleChange}
                  placeholder="Ex : Résidentiel, Commercial, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Surface chauffée</label>
                <input
                  type="text"
                  name="informationTravaux.surfaceChauffee"
                  value={dossierData.informationTravaux.surfaceChauffee}
                  onChange={handleChange}
                  placeholder="Ex : 100 m²"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Le circuit de chauffage est-il fonctionnel ?</label>
                <select
                  name="informationTravaux.circuitChauffageFonctionnel"
                  value={dossierData.informationTravaux.circuitChauffageFonctionnel}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Sélectionner</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
            </div>
          </fieldset>
          {/* Notes (dernier champ) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={dossierData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Ajouter des notes ici..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
