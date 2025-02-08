"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Interface de l'utilisateur (les clés envoyées au backend sont en anglais)
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

// Les rôles autorisés (les valeurs en anglais, pour le backend)
type RoleKey =
  | "Sales Representative / Account Executive"
  | "Project / Installation Manager"
  | "Technician / Installer"
  | "Customer Support / Service Representative"
  | "Super Admin"
  | "Client / Customer (Client Portal)";

// Configuration des rôles pour l'affichage (couleur)
const rolesConfig: Record<RoleKey, { color: string }> = {
  "Sales Representative / Account Executive": { color: "#f59e0b" },
  "Project / Installation Manager": { color: "#10b981" },
  "Technician / Installer": { color: "#2a75c7" },
  "Customer Support / Service Representative": { color: "#8b5cf6" },
  "Super Admin": { color: "#ef4444" },
  "Client / Customer (Client Portal)": { color: "#6b7280" },
};

// Traduction des rôles pour l'affichage sur le frontend (en français)
const roleTranslations: Record<RoleKey, string> = {
  "Sales Representative / Account Executive": "Représentant Commercial",
  "Project / Installation Manager": "Chef de Projet / Responsable Installation",
  "Technician / Installer": "Technicien / Installateur",
  "Customer Support / Service Representative": "Support Client",
  "Super Admin": "Super Administrateur",
  "Client / Customer (Client Portal)": "Client (Portail)",
};

export interface IUser {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }

  interface EditUserModalProps {
    user: IUser;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: (updatedUser: IUser) => void;
    onUserDeleted: (userId: string) => void;
  }

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onUserUpdated,
  onUserDeleted,
}: EditUserModalProps) {
  // États locaux pour les champs du formulaire
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Met à jour les champs locaux si l'utilisateur change
  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
  }, [user]);

  // Fonction pour enregistrer les modifications
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          role,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la mise à jour de l'utilisateur");
      }
      const updatedUser: User = await res.json();
      onUserUpdated(updatedUser);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer l'utilisateur
  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression de l'utilisateur");
      }
      onUserDeleted(user._id);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay semi-transparent */}
      <div className="fixed inset-0 bg-black opacity-60" onClick={onClose}></div>
      {/* Contenu du modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Modifier l&apos;utilisateur</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        {error && <div className="mb-4 text-center text-red-600">{error}</div>}

        <form className="space-y-6">
          {/* Prénom et Nom */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresse@mail.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Sélecteur de Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            >
              {(Object.keys(rolesConfig) as RoleKey[]).map((r) => (
                <option key={r} value={r}>
                  {roleTranslations[r]}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-md bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition disabled:opacity-50"
          >
            Supprimer
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md bg-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-400 transition disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-md bg-blue-500 px-5 py-2 text-white hover:bg-blue-600 transition disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
