"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Switch } from "@headlessui/react";
import {
  Cog6ToothIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  KeyIcon,
  DocumentTextIcon,
  PlusIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClockIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";

// Importation des modaux pour l'ajout et l'édition
import { AddContactModal } from "./AddContactModal";
import { EditUserModal } from "./EditUserModal";
import { INewUser } from "@/types/INewUser";

export interface IUser extends INewUser {
  _id: string;
  createdAt: string;
}


/* --- Définition d'un type utilisateur unifié --- */
export interface IUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/* --- Les rôles côté backend (en anglais) --- */
export type RoleKey =
  | "Sales Representative / Account Executive"
  | "Project / Installation Manager"
  | "Technician / Installer"
  | "Customer Support / Service Representative"
  | "Super Admin"
  | "Client / Customer (Client Portal)";

/* --- Configuration des rôles (valeurs envoyées au backend) --- */
const rolesConfig: Record<RoleKey, { color: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
  "Sales Representative / Account Executive": { color: "#f59e0b", icon: UserGroupIcon },
  "Project / Installation Manager": { color: "#10b981", icon: Cog6ToothIcon },
  "Technician / Installer": { color: "#2a75c7", icon: Cog6ToothIcon },
  "Customer Support / Service Representative": { color: "#8b5cf6", icon: LifebuoyIcon },
  "Super Admin": { color: "#ef4444", icon: ShieldCheckIcon },
  "Client / Customer (Client Portal)": { color: "#6b7280", icon: UserCircleIcon },
};

/* --- Traductions des rôles pour l'affichage en français --- */
const roleTranslations: Record<RoleKey, string> = {
  "Sales Representative / Account Executive": "Représentant commercial / Chargé de compte",
  "Project / Installation Manager": "Chef de projet / Responsable installation",
  "Technician / Installer": "Technicien / Installateur",
  "Customer Support / Service Representative": "Support client / Représentant du service",
  "Super Admin": "Super administrateur",
  "Client / Customer (Client Portal)": "Client (portail client)",
};

/* --- Permissions par rôle en français --- */
const permissions: Record<RoleKey, string[]> = {
  "Sales Representative / Account Executive": ["accès_complet", "gestion_des_utilisateurs", "facturation", "journaux_d'audit"],
  "Project / Installation Manager": ["prospection", "opportunités", "contacts", "calendrier"],
  "Technician / Installer": ["projets", "tâches", "documents", "rapports"],
  "Customer Support / Service Representative": ["tickets", "base_de_connaissances", "communication_client", "sla"],
  "Super Admin": ["accès_complet", "gestion_des_utilisateurs", "facturation", "journaux_d'audit"],
  "Client / Customer (Client Portal)": ["suivi_de_projet", "facturation", "support", "documents"],
};

/* --- Configuration par défaut si le rôle n'est pas reconnu --- */
const defaultRoleConfig = { color: "#6b7280", icon: UserCircleIcon };

export default function AdministrationPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour afficher les modaux
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<IUser | null>(null);

  // Récupération des utilisateurs via l'API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error("Échec de la récupération des utilisateurs");
        }
        const data: IUser[] = await res.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filtrage des utilisateurs selon le terme de recherche
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour mettre à jour le rôle (et l'email) d'un utilisateur
  const handleRoleChange = async (userId: string, email: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: newRole }), // envoyer l'email et le rôle en anglais
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la mise à jour du rôle");
      }
      const updatedUser: IUser = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
    } catch (error) {
      console.error(error);
      alert("La mise à jour du rôle a échoué");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Mes Utilisateurs</h1>
          </div>

          {/* En-tête de contrôle d'accès */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Utilisateurs Actifs */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Utilisateurs Actifs</h3>
                  <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                </div>
              </div>
            </div>

            {/* Rôles Configurés */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <KeyIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Rôles Configurés</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {(Object.keys(rolesConfig) as RoleKey[]).length}
                  </p>
                </div>
              </div>
            </div>

            {/* MFA Activée */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <LockClosedIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">MFA Activée</h3>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Panneaux Principaux d'Administration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panneau de Gestion des Utilisateurs */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2">
                    <UserGroupIcon className="h-6 w-6 text-[#2a75c7]" />
                    Gestion des Utilisateurs
                  </h2>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] hover:from-[#afcde9] hover:to-[#c2ecb2] text-[#1a365d]"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nouvel Utilisateur
                  </Button>
                </div>

                {/* Barre de Recherche */}
                <div className="flex items-center bg-[#bfddf9]/10 p-3 rounded-xl mb-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="bg-transparent w-full focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Messages de chargement, d'erreur ou d'absence de résultats */}
                {loading && <p>Chargement des utilisateurs...</p>}
                {error && <p className="text-red-500">Erreur : {error}</p>}
                {!loading && !error && filteredUsers.length === 0 && (
                  <p>Aucun utilisateur trouvé.</p>
                )}

                {/* Affichage des utilisateurs filtrés */}
                {filteredUsers.map((user) => {
                  const roleConfig =
                    user.role in rolesConfig
                      ? rolesConfig[user.role as RoleKey]
                      : defaultRoleConfig;
                  const { color, icon: Icon } = roleConfig;
                  return (
                    <motion.div
                      key={user._id}
                      className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer group"
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                          <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.email}</h4>
                          <p className="text-sm text-gray-500">
                            {roleTranslations[user.role as RoleKey] || user.role} • Créé le :{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Sélecteur pour changer le rôle (affichage français, valeur en anglais envoyée au backend) */}
                        <select
                          className="bg-transparent border border-[#bfddf9]/30 rounded-lg px-3 py-1 text-sm focus:outline-none"
                          style={{ color }}
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, user.email, e.target.value)
                          }
                        >
                          {(Object.keys(rolesConfig) as RoleKey[]).map((r) => (
                            <option key={r} value={r} style={{ color: rolesConfig[r].color }}>
                              {roleTranslations[r]}
                            </option>
                          ))}
                        </select>
                        <EllipsisVerticalIcon
                          onClick={() => setSelectedUserForEdit(user)}
                          className="h-5 w-5 text-gray-400 group-hover:text-[#2a75c7] cursor-pointer"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Panneau du Journal d'activité (exemple) */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d]">Journal d&apos;activité</h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Exporter CSV <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer border border-[#bfddf9]/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                          <DocumentTextIcon className="h-6 w-6 text-[#2a75c7]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Modification de rôle utilisateur</h4>
                          <p className="text-sm text-gray-500">Admin → Commercial</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">15h30</p>
                        <span className="text-xs text-gray-500">par admin@entreprise.com</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Panneau de Configuration des Rôles */}
            <motion.div
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Permissions des Rôles */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <KeyIcon className="h-6 w-6 text-[#8b5cf6]" />
                  Permissions des Rôles
                </h3>
                <div className="space-y-4">
                  {(Object.keys(rolesConfig) as RoleKey[]).map((role) => {
                    const { color, icon: Icon } = rolesConfig[role];
                    return (
                      <div key={role} className="border border-[#bfddf9]/20 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-[#bfddf9]/10">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" style={{ color }} />
                            <span className="font-medium" style={{ color }}>
                              {roleTranslations[role]}
                            </span>
                          </div>
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="p-3 space-y-2">
                          {(permissions[role] || []).map((perm: string) => (
                            <div key={perm} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 capitalize">
                                {perm.replace(/_/g, " ")}
                              </span>
                              <Switch
                                checked={true}
                                onChange={() => {}}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  true ? "bg-[#10b981]" : "bg-gray-200"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                                    true ? "translate-x-6" : "translate-x-1"
                                  } bg-white`}
                                />
                              </Switch>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Paramètres de Sécurité */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">Sécurité du Système</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <LockClosedIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Authentification à 2 Facteurs</span>
                    </div>
                    <Switch
                      checked={true}
                      onChange={() => {}}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        true ? "bg-[#10b981]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                          true ? "translate-x-6" : "translate-x-1"
                        } bg-white`}
                      />
                    </Switch>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-amber-600" />
                      <span className="text-sm">Expiration de Session</span>
                    </div>
                    <select className="bg-transparent border border-[#bfddf9]/30 rounded-lg px-3 py-1 text-sm focus:outline-none">
                      <option>24h</option>
                      <option>12h</option>
                      <option>8h</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Gestion API */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <ServerIcon className="h-6 w-6 text-[#2a75c7]" />
                  Gestion API
                </h3>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <KeyIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm truncate">sk_live_...{i}2345</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          i === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {i === 0 ? "Actif" : "Révoqué"}
                        </span>
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modal d'ajout d'utilisateur */}
      {isAddModalOpen && (
        <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={(newUser: INewUser) => {
          // Here you might want to add _id and createdAt after receiving the new user data
          // For example, if the API creates the new user, you might do the following after the API call:
          // const fullUser: IUser = { _id: generatedId, createdAt: new Date().toISOString(), ...newUser };
          // setUsers((prev) => [...prev, fullUser]);
      
          // For demonstration, if you want to generate dummy values:
          const fullUser: IUser = {
            _id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            ...newUser,
          };
          setUsers((prev) => [...prev, fullUser]);
        }}
      />
      
      )}

      {/* Modal d'édition d'utilisateur */}
      {selectedUserForEdit && (
        <EditUserModal
          user={selectedUserForEdit}
          isOpen={true}
          onClose={() => setSelectedUserForEdit(null)}
          onUserUpdated={(updatedUser: IUser) => {
            setUsers((prev) =>
              prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
            );
          }}
          onUserDeleted={(userId: string) => {
            setUsers((prev) => prev.filter((u) => u._id !== userId));
          }}
        />
      )}
    </div>
  );
  
}
