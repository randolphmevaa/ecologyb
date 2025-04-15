"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  Cog6ToothIcon,
  UserCircleIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PlusIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
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
  gender?: "Homme" | "Femme" | string; // Added gender field
}

/* --- Définition d'un type utilisateur unifié --- */
export interface IUser {
  _id: string;
  email: string;
  role: string;
  gender?: "Homme" | "Femme" | string; // Added gender field
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
const rolesConfig: Record<RoleKey, { 
  color: string; 
  gradient: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  logo?: string;
}> = {
  "Sales Representative / Account Executive": { 
    color: "#bfddf9", 
    gradient: "from-blue-500 to-blue-600",
    icon: UserGroupIcon 
  },
  "Project / Installation Manager": { 
    color: "#d2fcb2", 
    gradient: "from-green-500 to-green-600",
    icon: Cog6ToothIcon,
    logo: "/001_001-nike-logos-swoosh-black.jpg" // Logo for Régie
  },
  "Technician / Installer": { 
    color: "#89c4f7", 
    gradient: "from-cyan-500 to-cyan-600",
    icon: Cog6ToothIcon 
  },
  "Customer Support / Service Representative": { 
    color: "#b3f99c", 
    gradient: "from-emerald-500 to-emerald-600",
    icon: LifebuoyIcon 
  },
  "Super Admin": { 
    color: "#213f5b", 
    gradient: "from-indigo-500 to-purple-600",
    icon: ShieldCheckIcon 
  },
  "Client / Customer (Client Portal)": { 
    color: "#abd4f6", 
    gradient: "from-amber-400 to-orange-500",
    icon: UserCircleIcon 
  },
};

/* --- Traductions des rôles pour l'affichage en français --- */
const roleTranslations: Record<RoleKey, string> = {
  "Sales Representative / Account Executive": "Représentant commercial / Chargé de compte",
  "Project / Installation Manager": "Régie",
  "Technician / Installer": "Technicien / Installateur",
  "Customer Support / Service Representative": "Télépro - Assistance clients",
  "Super Admin": "Super administrateur",
  "Client / Customer (Client Portal)": "Client (portail client)",
};

/* --- Configuration par défaut si le rôle n'est pas reconnu --- */
const defaultRoleConfig = { 
  color: "#bfddf9", 
  gradient: "from-gray-500 to-gray-600",
  icon: UserCircleIcon 
};

// Image URLs based on role and gender
const getRoleImage = (role: string, gender?: string) => {
  const femaleImage = "https://www.hotesse-interim.fr/ressources/images/ab4fec7ce0ed.jpg";
  const maleImage = "https://www.advancia-teleservices.com/wp-content/uploads/2023/11/Centre-dappels-tunisie.jpg";
  
  // For Project / Installation Manager (Régie), return the logo
  if (role === "Project / Installation Manager") {
    return rolesConfig["Project / Installation Manager"].logo;
  }
  
  // For specified roles, return gender-based images
  if (role === "Customer Support / Service Representative" || 
      role === "Sales Representative / Account Executive") {
    return gender === "Femme" ? femaleImage : maleImage;
  }
  
  // Default role-based placeholders
  return `https://www.hotesse-interim.fr/ressources/images/ab4fec7ce0ed.jpg`;
};

export default function AdministrationPage() {
  // Global theme settings for consistent UI

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
  const itemsPerPage = 12; // Increased to show more cards per page

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
        
        // Temporarily add gender to users data for demonstration
        const enrichedData = data.map(user => ({
          ...user,
          gender: ["Homme", "Femme"][Math.floor(Math.random() * 2)], // Random gender for demo
        }));
        
        setUsers(enrichedData);
        
        // Calculate stats
        setStats({
          totalUsers: enrichedData.length,
          admins: enrichedData.filter(u => u.role === "Super Admin").length,
          commercial: enrichedData.filter(u => u.role === "Sales Representative / Account Executive").length,
          tech: enrichedData.filter(u => u.role === "Technician / Installer").length
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
    <div className="flex h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto px-0 sm:px-2">
            {/* Dashboard Header with Stats */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="relative">
                  <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#bfddf9] to-[#d2fcb2] rounded-full"></div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Administration</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gérez vos utilisateurs et leur accès à la plateforme</p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-[0_10px_30px_-15px_rgba(33,63,91,0.15)] p-5 md:p-6 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#bfddf9] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Total Utilisateurs</p>
                      <div className="flex items-center">
                        <p className="text-4xl font-bold text-[#213f5b] mt-1">{stats.totalUsers}</p>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+5%</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">depuis le mois dernier</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-200">
                      <UserGroupIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-[0_10px_30px_-15px_rgba(33,63,91,0.15)] p-5 md:p-6 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#213f5b] to-[#415d7c] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#213f5b] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Administrateurs</p>
                      <div className="flex items-center">
                        <p className="text-4xl font-bold text-[#213f5b] mt-1">{stats.admins}</p>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Limité</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">privilèges complets</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                      <ShieldCheckIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-[0_10px_30px_-15px_rgba(33,63,91,0.15)] p-5 md:p-6 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d2fcb2] to-[#a7f17f] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#d2fcb2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Commerciaux</p>
                      <div className="flex items-center">
                        <p className="text-4xl font-bold text-[#213f5b] mt-1">{stats.commercial}</p>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+12%</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">équipe en expansion</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-green-200">
                      <UserGroupIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-[0_10px_30px_-15px_rgba(33,63,91,0.15)] p-5 md:p-6 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bfddf9] to-[#8cc7ff] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#bfddf9] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Techniciens</p>
                      <div className="flex items-center">
                        <p className="text-4xl font-bold text-[#213f5b] mt-1">{stats.tech}</p>
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Stable</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">support technique</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-200">
                      <Cog6ToothIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          
            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6">
              {/* Full Width Users Management Section */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-[0_15px_45px_-15px_rgba(33,63,91,0.15)] overflow-hidden border border-[#f0f0f0] relative">
                  <div className="absolute -z-10 right-0 top-0 w-96 h-96 bg-[#bfddf9] opacity-5 rounded-full blur-3xl"></div>
                  <div className="absolute -z-10 left-0 bottom-0 w-96 h-96 bg-[#d2fcb2] opacity-5 rounded-full blur-3xl"></div>
                  <div className="p-8 border-b border-[#f0f0f0] bg-gradient-to-r from-white to-[#f8fafc]">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#213f5b] to-[#3978b5]"></div>
                          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#3978b5] flex items-center gap-2">
                            Gestion des Utilisateurs
                          </h2>
                        </div>
                        <p className="text-[#213f5b] opacity-70 ml-3 pl-3">Ajoutez, modifiez ou supprimez des utilisateurs de votre plateforme</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Handle Import */}}
                          className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                          Importer
                        </Button>
                        <Button
                          onClick={() => setIsAddModalOpen(true)}
                          className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Nouvel Utilisateur
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Search and Filter Toolbar */}
                  <div className="p-6 bg-white border-b border-[#f0f0f0]">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-[300px] relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MagnifyingGlassIcon className="h-5 w-5 text-[#213f5b] opacity-50" />
                        </div>
                        <input
                          type="text"
                          placeholder="Rechercher par email, nom, rôle..."
                          className="pl-10 pr-12 py-3 w-full rounded-xl border-[#eaeaea] focus:border-[#bfddf9] focus:ring-2 focus:ring-[#bfddf9] shadow-sm transition-all"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                        {searchTerm && (
                          <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#213f5b] hover:text-[#152a3d] bg-[#f0f0f0] hover:bg-[#e0e0e0] rounded-full p-1 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                          className="flex items-center gap-2 text-[#213f5b] border-[#eaeaea] hover:border-[#bfddf9] hover:bg-[#f8fafc] rounded-xl py-3 px-4 shadow-sm transition-all"
                        >
                          <FunnelIcon className="h-4 w-4" />
                          <span>Filtres</span>
                          {roleFilter && (
                            <span className="flex items-center justify-center h-5 w-5 bg-[#d2fcb2] text-[#213f5b] text-xs font-medium rounded-full">
                              1
                            </span>
                          )}
                        </Button>
                        
                        <div className="h-8 border-r border-[#eaeaea]"></div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center justify-center rounded-full h-9 w-9 text-[#213f5b] hover:bg-[#f0f0f0]"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center justify-center rounded-full h-9 w-9 text-[#213f5b] hover:bg-[#f0f0f0]"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                      
                    {(roleFilter || searchTerm) && (
                      <div className="mt-3 flex items-center flex-wrap gap-2">
                        <div className="text-sm text-[#213f5b] mr-2">Filtres actifs:</div>
                        {roleFilter && (
                          <div className="flex items-center bg-[#f0f0f0] text-[#213f5b] text-sm rounded-full px-3 py-1 mr-2">
                            <span className="mr-1">Rôle: {roleTranslations[roleFilter as RoleKey]}</span>
                            <button 
                              onClick={() => setRoleFilter("")}
                              className="text-[#213f5b] hover:text-[#152a3d]"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {searchTerm && (
                          <div className="flex items-center bg-[#f0f0f0] text-[#213f5b] text-sm rounded-full px-3 py-1">
                            <span className="mr-1">Recherche: {searchTerm}</span>
                            <button 
                              onClick={() => setSearchTerm("")}
                              className="text-[#213f5b] hover:text-[#152a3d]"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="text-[#213f5b] hover:text-[#152a3d] ml-auto text-sm"
                        >
                          Tout effacer
                        </Button>
                      </div>
                    )}
                    
                    {/* Expanded Filters */}
                    <AnimatePresence>
                      {isFiltersVisible && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="pt-3 border-t border-[#bfddf9]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-[#213f5b] mb-1">Rôle</label>
                                <select
                                  value={roleFilter}
                                  onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(1);
                                  }}
                                  className="w-full rounded-lg border-[#bfddf9] focus:border-[#213f5b] focus:ring-1 focus:ring-[#213f5b]"
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
    
                  {/* User Grid */}
                  <div className="p-4 md:p-6 lg:p-8 bg-white">
                    {/* Loading, Error, and Empty States */}
                    {loading && (
                      <div className="flex flex-col justify-center items-center p-12">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full blur opacity-30 animate-pulse"></div>
                          <div className="relative animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#213f5b]"></div>
                        </div>
                        <p className="mt-4 text-[#213f5b] animate-pulse">Chargement des utilisateurs...</p>
                      </div>
                    )}
                    
                    {error && (
                      <div className="p-6 text-center">
                        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl inline-block shadow-md border border-red-200 max-w-md mx-auto">
                          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                          <p className="text-red-700 mb-4">{error}</p>
                          <Button 
                            variant="outline" 
                            size="lg" 
                            className="mt-2 text-red-600 border-red-300 hover:bg-red-100 rounded-xl py-2.5 px-5 shadow-sm transition-all hover:shadow"
                            onClick={() => window.location.reload()}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Rafraîchir la page
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {!loading && !error && filteredUsers.length === 0 && (
                      <div className="p-8 md:p-12 text-center">
                        <div className="max-w-md mx-auto">
                          <div className="relative mx-auto mb-6 w-24 h-24">
                            <div className="absolute inset-0 bg-[#bfddf9] opacity-20 rounded-full animate-pulse"></div>
                            <div className="absolute inset-4 bg-[#bfddf9] opacity-20 rounded-full animate-pulse delay-150"></div>
                            <UserGroupIcon className="h-24 w-24 text-[#bfddf9] relative z-10" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#213f5b] mb-2">Aucun utilisateur trouvé</h3>
                          <p className="text-[#213f5b] opacity-75 mb-6 max-w-xs mx-auto">Aucun utilisateur ne correspond à vos critères de recherche. Modifiez vos filtres ou ajoutez un nouvel utilisateur.</p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button 
                              variant="outline" 
                              onClick={clearFilters}
                              className="border-[#bfddf9] bg-white text-[#213f5b] hover:bg-[#bfddf9] transition-all rounded-xl py-2.5 px-5 w-full sm:w-auto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Effacer les filtres
                            </Button>
                            <Button
                              onClick={() => setIsAddModalOpen(true)}
                              className="bg-[#213f5b] hover:bg-[#152a3d] text-white shadow-md hover:shadow-lg transition-all rounded-xl py-2.5 px-5 w-full sm:w-auto"
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Nouvel Utilisateur
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
    
                    {/* User Grid Layout - ENHANCED VERSION */}
                    {!loading && !error && currentUsers.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {currentUsers.map((user, index) => {
                          const roleConfig =
                            user.role in rolesConfig
                              ? rolesConfig[user.role as RoleKey]
                              : defaultRoleConfig;
                          const { color,   icon: Icon } = roleConfig;
                          const displayName = user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email;
                            
                          // Generate initials for fallback
                          // const initials = user.firstName && user.lastName
                          //   ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                          //   : user.email[0].toUpperCase();
                            
                          // Get role-specific image
                          const profileImage = getRoleImage(user.role, user.gender);
                          
                          return (
                            <motion.div
                              key={user._id}
                              className="group bg-white backdrop-blur-sm bg-opacity-95 border border-[#eaeaea] hover:border-[#bfddf9] rounded-2xl overflow-hidden shadow-[0_15px_35px_-15px_rgba(33,63,91,0.15)] hover:shadow-[0_20px_45px_-15px_rgba(33,63,91,0.25)] transition-all duration-300"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                delay: 0.05 * index, 
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                              whileHover={{ y: -8, scale: 1.02 }}
                            >
                              {/* Card Top Gradient */}
                              <div 
                                className="h-2 group-hover:h-3 transition-all duration-300 bg-gradient-to-r"
                                style={{ 
                                  backgroundImage: `linear-gradient(90deg, ${color} 0%, #ffffff 150%)` 
                                }}
                              />
                              
                              {/* User Header with Image */}
                              <div className="relative">
                                {/* Profile Image/Logo Section */}
                                <div className="relative h-32 w-full overflow-hidden bg-gradient-to-r group-hover:scale-105 transition-transform duration-700"
                                     style={{ 
                                       backgroundImage: `linear-gradient(to right, ${color}40, ${color}80)` 
                                     }}>
                                  
                                  {/* Handle Different Types of Profile Display Based on Role */}
                                  {user.role === "Project / Installation Manager" ? (
                                    // Logo for Régie
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="bg-white p-3 rounded-xl shadow-lg">
                                        <img 
                                          src={profileImage} 
                                          alt="Logo" 
                                          className="w-20 h-20 object-contain"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    // Profile image for other roles
                                    <>
                                      <img 
                                        src={profileImage}
                                        alt={displayName}
                                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </>
                                  )}
                                </div>
                                
                                {/* User Details Overlay */}
                                <div className="absolute bottom-3 left-4 text-white">
                                  <h4 className="font-bold text-white text-lg leading-tight drop-shadow-md">{displayName}</h4>
                                  <div 
                                    className="inline-flex items-center px-2.5 py-1 mt-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-sm"
                                  >
                                    <Icon className="h-3 w-3 mr-1" />
                                    <span className="truncate max-w-[150px]">
                                      {roleTranslations[user.role as RoleKey] || user.role}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Contact Info */}
                              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#f8fafc] to-white relative overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-20 h-20 rounded-full bg-[#bfddf9] opacity-10 blur-xl"></div>
                                <div className="flex flex-col gap-2 relative">
                                  <div className="relative group/email">
                                    <p className="text-xs sm:text-sm text-[#213f5b] truncate flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#213f5b] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      <span className="truncate">{user.email}</span>
                                    </p>
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#bfddf9] group-hover/email:w-full transition-all duration-300 ml-6"></div>
                                  </div>
                                  {user.phone && (
                                    <div className="relative group/phone">
                                      <p className="text-xs sm:text-sm text-[#213f5b] truncate flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#213f5b] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="truncate">{user.phone}</span>
                                      </p>
                                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#bfddf9] group-hover/phone:w-full transition-all duration-300 ml-6"></div>
                                    </div>
                                  )}
                                  {user.gender && (
                                    <div className="relative group/gender mt-1">
                                      <p className="text-xs sm:text-sm text-[#213f5b] truncate flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#213f5b] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="truncate capitalize">{user.gender}</span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Card Footer with Actions */}
                              <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between border-t border-[#eaeaea] gap-2">
                                <div className="text-xs text-[#213f5b] opacity-70 flex items-center bg-[#f8fafc] px-2 py-1 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#213f5b] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                                
                                <div className="flex gap-1.5 sm:gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {/* Handle action */}}
                                    className="rounded-full p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center text-[#213f5b] hover:bg-[#bfddf9] hover:text-[#213f5b] transition-colors relative group/tooltip"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-[#213f5b] text-white px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                      Contacter
                                    </span>
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedUserForEdit(user)}
                                    className="rounded-full p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center text-[#213f5b] hover:bg-[#bfddf9] hover:text-[#213f5b] transition-colors relative group/tooltip"
                                  >
                                    <PencilIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-[#213f5b] text-white px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                      Modifier
                                    </span>
                                  </Button>
                                  
                                  <Button
                                    className="rounded-full text-xs font-medium px-2 sm:px-3 py-1 h-7 sm:h-8 bg-gradient-to-r from-[#213f5b] to-[#3978b5] text-white hover:shadow-md transition-all hover:from-[#152a3d] hover:to-[#2d5e8e] relative overflow-hidden"
                                    onClick={() => setSelectedUserForEdit(user)}
                                  >
                                    <span className="relative z-10">Gérer</span>
                                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
                                  </Button>
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 border-t border-[#eaeaea] bg-white">
                      <div className="text-sm text-[#213f5b] opacity-75 mb-4 sm:mb-0 text-center sm:text-left">
                        Affichage de <span className="font-semibold text-[#213f5b]">{indexOfFirstItem + 1}</span> à{" "}
                        <span className="font-semibold text-[#213f5b]">
                          {Math.min(indexOfLastItem, filteredUsers.length)}
                        </span>{" "}
                        sur <span className="font-semibold text-[#213f5b]">{filteredUsers.length}</span> utilisateurs
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center gap-1 text-[#213f5b] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2 hover:bg-[#f0f0f0] transition-colors"
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                          <span className="hidden sm:inline">Précédent</span>
                        </Button>
                        
                        <div className="hidden md:flex gap-2">
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
                            
                            const isActive = currentPage === pageNum;
                            
                            return (
                              <Button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`rounded-xl w-10 h-10 flex items-center justify-center transition-all ${
                                  isActive
                                    ? "bg-gradient-to-r from-[#213f5b] to-[#3978b5] text-white transform scale-110 shadow-md"
                                    : "bg-white text-[#213f5b] hover:bg-[#f0f0f0] border border-[#eaeaea]"
                                }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <div className="flex sm:hidden items-center gap-2 px-3">
                          <span className="text-sm font-medium text-[#213f5b]">{currentPage}</span>
                          <span className="text-[#213f5b] opacity-50">sur</span>
                          <span className="text-sm font-medium text-[#213f5b]">{totalPages}</span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center gap-1 text-[#213f5b] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2 hover:bg-[#f0f0f0] transition-colors"
                        >
                          <span className="hidden sm:inline">Suivant</span>
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
    
              {/* Quick Actions & Tips (2-column layout) */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {/* Quick Actions Panel */}
                <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-[0_15px_35px_-15px_rgba(33,63,91,0.15)] border border-[#f0f0f0] overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#213f5b] to-[#3978b5] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-64 h-64 bg-[#bfddf9] opacity-5 rounded-full blur-3xl"></div>

                  <div className="p-6 md:p-8 border-b border-[#eaeaea]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#213f5b] to-[#3978b5] flex items-center justify-center shadow-md">
                        <Cog6ToothIcon className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#3978b5]">
                        Actions rapides
                      </h2>
                    </div>
                    <p className="text-sm text-[#213f5b] opacity-75 ml-13 pl-0">Accédez rapidement aux fonctionnalités essentielles</p>
                  </div>
                  
                  <div className="p-5 md:p-6 grid grid-cols-1 gap-4">
                    <motion.button
                      className="flex items-center gap-4 p-4 rounded-xl border border-[#eaeaea] hover:border-[#bfddf9] shadow-sm hover:shadow-md bg-white hover:bg-gradient-to-r hover:from-white hover:to-[#f8fafc] transition-all duration-300 text-left group relative overflow-hidden"
                      whileHover={{ y: -4, scale: 1.01 }}
                    >
                      <div className="absolute top-0 left-0 w-0 h-full bg-[#bfddf9] opacity-10 group-hover:w-full transition-all duration-700 ease-out"></div>
                      <div className="relative p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl shadow-md shadow-green-100 group-hover:shadow-lg transition-shadow">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="relative">
                        <h4 className="font-semibold text-[#213f5b] text-base md:text-lg mb-1 group-hover:text-[#152a3d] transition-colors">Inviter des utilisateurs</h4>
                        <p className="text-xs md:text-sm text-[#213f5b] opacity-75 group-hover:opacity-100 transition-opacity">Envoyez des invitations par e-mail</p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      className="flex items-center gap-4 p-4 rounded-xl border border-[#eaeaea] hover:border-[#bfddf9] shadow-sm hover:shadow-md bg-white hover:bg-gradient-to-r hover:from-white hover:to-[#f8fafc] transition-all duration-300 text-left group relative overflow-hidden"
                      whileHover={{ y: -4, scale: 1.01 }}
                    >
                      <div className="absolute top-0 left-0 w-0 h-full bg-[#bfddf9] opacity-10 group-hover:w-full transition-all duration-700 ease-out"></div>
                      <div className="relative p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-md shadow-blue-100 group-hover:shadow-lg transition-shadow">
                        <DocumentTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="relative">
                        <h4 className="font-semibold text-[#213f5b] text-base md:text-lg mb-1 group-hover:text-[#152a3d] transition-colors">Rapport d&apos;utilisation</h4>
                        <p className="text-xs md:text-sm text-[#213f5b] opacity-75 group-hover:opacity-100 transition-opacity">Générer des statistiques d&apos;activité</p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      className="flex items-center gap-4 p-4 rounded-xl border border-[#eaeaea] hover:border-[#bfddf9] shadow-sm hover:shadow-md bg-white hover:bg-gradient-to-r hover:from-white hover:to-[#f8fafc] transition-all duration-300 text-left group relative overflow-hidden"
                      whileHover={{ y: -4, scale: 1.01 }}
                    >
                      <div className="absolute top-0 left-0 w-0 h-full bg-[#bfddf9] opacity-10 group-hover:w-full transition-all duration-700 ease-out"></div>
                      <div className="relative p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-100 group-hover:shadow-lg transition-shadow">
                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="relative">
                        <h4 className="font-semibold text-[#213f5b] text-base md:text-lg mb-1 group-hover:text-[#152a3d] transition-colors">Paramètres de sécurité</h4>
                        <p className="text-xs md:text-sm text-[#213f5b] opacity-75 group-hover:opacity-100 transition-opacity">Gérer les politiques de sécurité</p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.button>
                  </div>
                </div>
                
                {/* Tips Panel - Now with enhanced styling */}
                <div className="relative rounded-2xl shadow-[0_15px_35px_-15px_rgba(33,63,91,0.2)] overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#bfddf9] via-[#c7e8fa] to-[#d2fcb2] group-hover:from-[#add6f8] group-hover:via-[#c0e4f9] group-hover:to-[#c5f599] transition-colors duration-700"></div>
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yOS41IDE0LjVMNDQgMjlsLTE0LjUgMTQuNUwxNSAyOSAyOS41IDE0LjV6IiBzdHJva2U9IiMyMTNmNWIiIHN0cm9rZS1vcGFjaXR5PSIuMDUiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')]"></div>
                  
                  <div className="relative p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#3978b5]">
                        Conseils d&apos;administration
                      </h2>
                    </div>
                    
                    <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-xl p-4 md:p-5 mb-5 shadow-sm">
                      <p className="text-sm text-[#213f5b] font-medium leading-relaxed">
                        La gestion efficace des utilisateurs est essentielle pour maintenir la sécurité de votre plateforme et optimiser l&apos;expérience utilisateur.
                      </p>
                    </div>
                    
                    <ul className="space-y-3">
                      <motion.li 
                        className="flex items-start gap-3 bg-white bg-opacity-40 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:bg-opacity-60 transition-all group/item"
                        whileHover={{ x: 5, scale: 1.02 }}
                      >
                        <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full mt-0.5 shadow-sm">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#213f5b] group-hover/item:text-[#152a3d] transition-colors">Vérifiez régulièrement les journaux d&apos;activité</span>
                          <p className="text-xs text-[#213f5b] opacity-75 mt-1">Identifiez les comportements suspects</p>
                        </div>
                      </motion.li>
                      
                      <motion.li 
                        className="flex items-start gap-3 bg-white bg-opacity-40 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:bg-opacity-60 transition-all group/item"
                        whileHover={{ x: 5, scale: 1.02 }}
                      >
                        <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mt-0.5 shadow-sm">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#213f5b] group-hover/item:text-[#152a3d] transition-colors">Attribuez les rôles appropriés aux utilisateurs</span>
                          <p className="text-xs text-[#213f5b] opacity-75 mt-1">Principe du moindre privilège</p>
                        </div>
                      </motion.li>
                      
                      <motion.li 
                        className="flex items-start gap-3 bg-white bg-opacity-40 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:bg-opacity-60 transition-all group/item"
                        whileHover={{ x: 5, scale: 1.02 }}
                      >
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mt-0.5 shadow-sm">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#213f5b] group-hover/item:text-[#152a3d] transition-colors">Supprimez rapidement les comptes inactifs</span>
                          <p className="text-xs text-[#213f5b] opacity-75 mt-1">Réduisez la surface d&apos;attaque</p>
                        </div>
                      </motion.li>
                    </ul>
                    
                    <motion.button
                      className="mt-5 w-full bg-white bg-opacity-50 hover:bg-opacity-70 text-[#213f5b] font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden group-hover:shadow-md"
                      whileHover={{ y: -2, scale: 1.01 }}
                    >
                      <span>En savoir plus</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </motion.button>
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
                gender: Math.random() > 0.5 ? "Homme" : "Femme", // Added random gender for demo
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
