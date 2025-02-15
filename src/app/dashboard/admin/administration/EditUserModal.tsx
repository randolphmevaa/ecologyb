"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, KeyIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";

// Interface de l'utilisateur (pour cet exemple, nous supposons que le backend renvoie le vrai mot de passe dans "realPassword")
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  password: string; // hashed password
  realPassword?: string; // plain text password
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

// Permissions associées à chaque rôle
const permissionsData: Record<RoleKey, string[]> = {
  "Sales Representative / Account Executive": [
    "accès_complet",
    "gestion_des_utilisateurs",
    "facturation",
    "journaux_d'audit",
  ],
  "Project / Installation Manager": [
    "prospection",
    "opportunités",
    "contacts",
    "calendrier",
  ],
  "Technician / Installer": [
    "projets",
    "tâches",
    "documents",
    "rapports",
  ],
  "Customer Support / Service Representative": [
    "tickets",
    "base_de_connaissances",
    "communication_client",
    "sla",
  ],
  "Super Admin": [
    "accès_complet",
    "gestion_des_utilisateurs",
    "facturation",
    "journaux_d'audit",
  ],
  "Client / Customer (Client Portal)": [
    "suivi_de_projet",
    "facturation",
    "support",
    "documents",
  ],
};

export interface IUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  realPassword?: string;
}

interface EditUserModalProps {
  user: IUser;
  isOpen: boolean;
  onUserUpdated: (updatedUser: IUser) => void;
  onUserDeleted: (userId: string) => void;
  onClose: () => void;
}

export function EditUserModal({
  user,
  isOpen,
  onUserUpdated,
  onUserDeleted,
  onClose,
}: EditUserModalProps) {
  // États locaux pour les champs du formulaire
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour le mot de passe
  // On affiche ici le mot de passe réel s'il existe, sinon on affiche le hashed password (ce qui devrait normalement ne pas se produire)
  const [currentPassword, setCurrentPassword] = useState(user.realPassword || user.password || "");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // État local pour les permissions du rôle courant sous forme d'objet: { permission: boolean }
  const [permissionToggles, setPermissionToggles] = useState<Record<string, boolean>>({});

  // Met à jour les champs locaux si l'utilisateur change
  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
    setCurrentPassword(user.realPassword || user.password || "");

    // Initialiser les permissions du rôle courant à "true"
    if (user.role in permissionsData) {
      const perms = permissionsData[user.role as RoleKey];
      const initialToggles: Record<string, boolean> = {};
      perms.forEach((perm) => {
        initialToggles[perm] = true;
      });
      setPermissionToggles(initialToggles);
    } else {
      setPermissionToggles({});
    }

    // Reset password fields when user changes
    setPassword("");
    setConfirmPassword("");
  }, [user]);

  // Handler pour le changement du rôle
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    if (newRole in permissionsData) {
      const perms = permissionsData[newRole as RoleKey];
      const initialToggles: Record<string, boolean> = {};
      perms.forEach((perm) => {
        initialToggles[perm] = true;
      });
      setPermissionToggles(initialToggles);
    } else {
      setPermissionToggles({});
    }
  };

  // Handler pour basculer une permission
  const togglePermission = (perm: string) => {
    setPermissionToggles((prev) => ({
      ...prev,
      [perm]: !prev[perm],
    }));
  };

  // Fonction pour enregistrer les modifications
  const handleSave = async () => {
    // If a new password is provided, verify the confirmation
    if (password && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
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
          // Only include permissions that are enabled
          permissions: Object.keys(permissionToggles).filter((perm) => permissionToggles[perm]),
          // Send the new password if provided under a new field
          ...(password && { newPassword: password }),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la mise à jour de l'utilisateur");
      }
      const updatedUser: User = await res.json();
      onUserUpdated(updatedUser);
      onClose();
      // Refresh the page to see the full update
      window.location.reload();
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

  // Définir l'entête des permissions
  const permissionsHeader = firstName
    ? `Permissions pour ${firstName}`
    : `Permissions pour le ${roleTranslations[role as RoleKey]}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay semi-transparent */}
      <div className="fixed inset-0 bg-black opacity-60" onClick={onClose}></div>
      {/* Contenu du modal avec hauteur maximale à 80% de la vue */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 z-50 max-h-[80vh] overflow-y-auto">
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

          {/* Mot de passe actuel */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <button type="button" onClick={() => setShowCurrentPassword((prev) => !prev)} className="mt-6">
              {showCurrentPassword ? (
                <EyeSlashIcon className="h-6 w-6 text-gray-500" />
              ) : (
                <EyeIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
          </div>

          {/* Nouveau mot de passe et confirmation */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Sélecteur de Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            >
              {(Object.keys(rolesConfig) as RoleKey[]).map((r) => (
                <option key={r} value={r}>
                  {roleTranslations[r]}
                </option>
              ))}
            </select>
          </div>

          {/* Section Permissions des Rôles */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
            <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
              <KeyIcon className="h-6 w-6 text-[#8b5cf6]" />
              {permissionsHeader}
            </h3>
            <div className="space-y-4">
              {Object.keys(permissionToggles).map((perm) => (
                <div key={perm} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{perm.replace(/_/g, " ")}</span>
                  <Switch
                    checked={permissionToggles[perm]}
                    onChange={() => togglePermission(perm)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      permissionToggles[perm] ? "bg-[#10b981]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                        permissionToggles[perm] ? "translate-x-6" : "translate-x-1"
                      } bg-white`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
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
