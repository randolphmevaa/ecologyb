"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  Cog6ToothIcon,
  UserCircleIcon,
  EllipsisHorizontalIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PlusIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
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

/* --- Configuration par défaut si le rôle n'est pas reconnu --- */
const defaultRoleConfig = { color: "#6b7280", icon: UserCircleIcon };

// Sample activity logs
const activityLogs = [
  {
    id: 1,
    action: "Modification de rôle utilisateur",
    details: "Changement de Super Admin → Commercial",
    time: "15h30",
    user: "admin@entreprise.com",
    icon: DocumentTextIcon
  },
  {
    id: 2,
    action: "Nouvel utilisateur créé",
    details: "tech@exemple.com ajouté comme Technicien",
    time: "14h15",
    user: "admin@entreprise.com",
    icon: PlusIcon
  },
  {
    id: 3,
    action: "Suppression d'utilisateur",
    details: "client@ancien.com supprimé",
    time: "13h45",
    user: "admin@entreprise.com",
    icon: TrashIcon
  }
];

export default function AdministrationPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // États pour afficher les modaux
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<IUser | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const itemsPerPage = 8;

  // Stats counter
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    commercial: 0,
    tech: 0
  });

  // Récupération des utilisateurs via l'API
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error("Échec de la récupération des utilisateurs");
        }
        const data: IUser[] = await res.json();
        setUsers(data);
        
        // Calculate stats
        setStats({
          totalUsers: data.length,
          admins: data.filter(u => u.role === "Super Admin").length,
          commercial: data.filter(u => u.role === "Sales Representative / Account Executive").length,
          tech: data.filter(u => u.role === "Technician / Installer").length
        });
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
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const matchesSearch =
      (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  // Fonction pour mettre à jour le rôle (et l'email) d'un utilisateur
  const handleRoleChange = async (userId: string, email: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la mise à jour du rôle");
      }
      const updatedUser: IUser = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
  
      // Log the activity after a successful role change
      await fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Modification de rôle utilisateur",
          details: `Changement de rôle pour ${email} vers ${newRole}`,
          user: "admin@entreprise.com", // Replace with the actual admin user info if available
        }),
      });
    } catch (error) {
      console.error(error);
      alert("La mise à jour du rôle a échoué");
    }
  };

  // Calculate the indices for slicing the users array:
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages:
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header with Stats */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Administration</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Utilisateurs</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Administrateurs</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.admins}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Commerciaux</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.commercial}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <UserGroupIcon className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Techniciens</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.tech}</p>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <Cog6ToothIcon className="h-6 w-6 text-cyan-600" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panneau de Gestion des Utilisateurs */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <UserGroupIcon className="h-5 w-5 text-blue-600" />
                        Gestion des Utilisateurs
                      </h2>
                      <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-lg px-4 py-2 flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nouvel Utilisateur
                      </Button>
                    </div>
                  </div>
                  
                  {/* Search and Filter Toolbar */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex-1 min-w-[240px] relative">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Rechercher par email, nom..."
                          className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                        {searchTerm && (
                          <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className="flex items-center gap-1 text-gray-700 border-gray-200 hover:bg-gray-100"
                      >
                        <FunnelIcon className="h-4 w-4" />
                        Filtres
                        {roleFilter && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full ml-1">1</span>}
                      </Button>
                      
                      {(roleFilter || searchTerm) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Effacer les filtres
                        </Button>
                      )}
                    </div>
                    
                    {/* Expanded Filters */}
                    <AnimatePresence>
                      {isFiltersVisible && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                                <select
                                  value={roleFilter}
                                  onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(1);
                                  }}
                                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="">Tous les rôles</option>
                                  {(Object.keys(rolesConfig) as RoleKey[]).map((r) => (
                                    <option key={r} value={r}>
                                      {roleTranslations[r]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
    
                  {/* User List */}
                  <div className="overflow-hidden">
                    {/* Loading, Error, and Empty States */}
                    {loading && (
                      <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="p-6 text-center">
                        <div className="bg-red-50 p-4 rounded-lg inline-block">
                          <p className="text-red-700 font-medium">Erreur: {error}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => window.location.reload()}
                          >
                            Rafraîchir la page
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {!loading && !error && filteredUsers.length === 0 && (
                      <div className="p-12 text-center">
                        <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun utilisateur trouvé</h3>
                        <p className="text-gray-500 mb-4">Modifiez vos filtres ou ajoutez un nouvel utilisateur</p>
                        <div className="flex justify-center gap-3">
                          <Button 
                            variant="outline" 
                            onClick={clearFilters}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            Effacer les filtres
                          </Button>
                          <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Nouvel Utilisateur
                          </Button>
                        </div>
                      </div>
                    )}
    
                    {/* User List */}
                    {!loading && !error && currentUsers.length > 0 && (
                      <div className="divide-y divide-gray-100">
                        {currentUsers.map((user) => {
                          const roleConfig =
                            user.role in rolesConfig
                              ? rolesConfig[user.role as RoleKey]
                              : defaultRoleConfig;
                          const { color, icon: Icon } = roleConfig;
                          const displayName = user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email;
                            
                          return (
                            <motion.div
                              key={user._id}
                              className="p-4 hover:bg-gray-50 transition-colors"
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
                                    <Icon className="h-5 w-5" style={{ color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 truncate">{displayName}</h4>
                                    <div className="flex items-center text-sm text-gray-500 mt-0.5">
                                      <span className="truncate">{user.email}</span>
                                      <span className="mx-1.5">•</span>
                                      <span className="whitespace-nowrap">Créé le {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: `${color}15`, color }}
                                  >
                                    {roleTranslations[user.role as RoleKey] || user.role}
                                  </span>
                                  
                                  <div className="flex items-center">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setSelectedUserForEdit(user)}
                                      className="text-gray-400 hover:text-gray-700"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-gray-400 hover:text-gray-700"
                                      onClick={() => {
                                        const menu = document.createElement('select');
                                        menu.className = 'absolute z-50 opacity-0';
                                        menu.style.top = '0';
                                        menu.style.left = '0';
                                        
                                        (Object.keys(rolesConfig) as RoleKey[]).forEach(role => {
                                          const option = document.createElement('option');
                                          option.value = role;
                                          option.textContent = roleTranslations[role];
                                          option.selected = role === user.role;
                                          menu.appendChild(option);
                                        });
                                        
                                        menu.addEventListener('change', (e) => {
                                          const target = e.target as HTMLSelectElement;
                                          handleRoleChange(user._id, user.email, target.value);
                                          document.body.removeChild(menu);
                                        });
                                        
                                        menu.addEventListener('blur', () => {
                                          document.body.removeChild(menu);
                                        });
                                        
                                        document.body.appendChild(menu);
                                        menu.focus();
                                      }}
                                    >
                                      <EllipsisHorizontalIcon className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
    
                  {/* Pagination */}
                  {filteredUsers.length > itemsPerPage && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
                      <div className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, filteredUsers.length)}
                        </span>{" "}
                        sur <span className="font-medium">{filteredUsers.length}</span> utilisateurs
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                          Préc
                        </Button>
                        
                        <div className="hidden sm:flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <Button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`rounded-md w-9 h-9 flex items-center justify-center ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Suiv
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
    
              {/* Right Sidebar */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Activity Log Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        Journal d&apos;activité
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                            <log.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{log.action}</h4>
                            <p className="text-sm text-gray-500 mt-0.5">{log.details}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span>{log.time}</span>
                              <span className="mx-1.5">•</span>
                              <span className="truncate">{log.user}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Voir toutes les activités
                    </Button>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Cog6ToothIcon className="h-5 w-5 text-blue-600" />
                      Actions rapides
                    </h2>
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 gap-3">
                    <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <UserGroupIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Inviter des utilisateurs</h4>
                        <p className="text-sm text-gray-500">Envoyez des invitations par e-mail</p>
                      </div>
                    </button>
                    
                    <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Rapport d&apos;utilisation</h4>
                        <p className="text-sm text-gray-500">Générer des statistiques d&apos;activité</p>
                      </div>
                    </button>
                    
                    <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <ShieldCheckIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Paramètres de sécurité</h4>
                        <p className="text-sm text-gray-500">Gérer les politiques de sécurité</p>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Tips Panel */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-3">Conseils d&apos;administration</h2>
                    <p className="text-sm text-blue-700 mb-4">
                      La gestion efficace des utilisateurs est essentielle pour maintenir la sécurité de votre plateforme.
                    </p>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-blue-800">Vérifiez régulièrement les journaux d&apos;activité</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-blue-800">Attribuez les rôles appropriés aux utilisateurs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-blue-800">Supprimez rapidement les comptes inactifs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddContactModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onUserAdded={(newUser: INewUser) => {
              const fullUser: IUser = {
                _id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
                ...newUser,
              };
              setUsers((prev) => [...prev, fullUser]);
              
              // Update stats after adding
              setStats(prev => ({
                ...prev,
                totalUsers: prev.totalUsers + 1,
                admins: newUser.role === "Super Admin" ? prev.admins + 1 : prev.admins,
                commercial: newUser.role === "Sales Representative / Account Executive" ? prev.commercial + 1 : prev.commercial,
                tech: newUser.role === "Technician / Installer" ? prev.tech + 1 : prev.tech
              }));
            }}
          />
        )}
        
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
              const userToDelete = users.find(u => u._id === userId);
              setUsers((prev) => prev.filter((u) => u._id !== userId));
              
              // Update stats after deletion
              if (userToDelete) {
                setStats(prev => ({
                  ...prev,
                  totalUsers: prev.totalUsers - 1,
                  admins: userToDelete.role === "Super Admin" ? prev.admins - 1 : prev.admins,
                  commercial:
                    userToDelete.role === "Sales Representative / Account Executive"
                      ? prev.commercial - 1
                      : prev.commercial,
                  tech: userToDelete.role === "Technician / Installer" ? prev.tech - 1 : prev.tech
                }));
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
