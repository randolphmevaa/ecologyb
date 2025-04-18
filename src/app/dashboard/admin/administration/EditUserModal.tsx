"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";
import { Switch } from "@headlessui/react";
import { 
  XMarkIcon, KeyIcon, UserIcon, BuildingOfficeIcon,
  EnvelopeIcon, PhoneIcon, GlobeAltIcon,
  MapPinIcon, CreditCardIcon, BanknotesIcon, PhotoIcon,
  TrashIcon, ShieldCheckIcon, ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { 
  EyeIcon, EyeSlashIcon, CheckBadgeIcon, ArrowPathIcon,
  ExclamationTriangleIcon, LockClosedIcon
} from "@heroicons/react/24/solid";

// Interface de l'utilisateur (pour cet exemple, nous supposons que le backend renvoie le vrai mot de passe dans "realPassword")
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  password?: string; // hashed password
  realPassword?: string; // plain text password
  
  // Régie specific fields
  companyName?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  siret?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  vatNumber?: string;
  logoUrl?: string;
  gender?: string;
}

// Les rôles autorisés (les valeurs en anglais, pour le backend)
type RoleKey =
  | "Sales Representative / Account Executive"
  | "Project / Installation Manager"
  | "Technician / Installer"
  | "Customer Support / Service Representative"
  | "Super Admin"
  // | "Client / Customer (Client Portal)";

// Configuration des rôles pour l'affichage (couleur)
const rolesConfig: Record<RoleKey, { 
  color: string; 
  bgColor: string;
  gradient: string;
  icon: React.FC<React.ComponentProps<"svg">>;
}> = {
  "Sales Representative / Account Executive": { 
    color: "#f59e0b", 
    bgColor: "#fef3c7", 
    gradient: "from-amber-500 to-yellow-500",
    icon: UserIcon
  },
  "Project / Installation Manager": { 
    color: "#10b981", 
    bgColor: "#d1fae5", 
    gradient: "from-green-500 to-emerald-500",
    icon: BuildingOfficeIcon
  },
  "Technician / Installer": { 
    color: "#2a75c7", 
    bgColor: "#dbeafe", 
    gradient: "from-blue-500 to-cyan-500",
    icon: KeyIcon
  },
  "Customer Support / Service Representative": { 
    color: "#8b5cf6", 
    bgColor: "#ede9fe", 
    gradient: "from-purple-500 to-indigo-500",
    icon: PhoneIcon
  },
  "Super Admin": { 
    color: "#ef4444", 
    bgColor: "#fee2e2", 
    gradient: "from-red-500 to-rose-500",
    icon: ShieldCheckIcon
  },
  // "Client / Customer (Client Portal)": { 
  //   color: "#6b7280", 
  //   bgColor: "#f3f4f6", 
  //   gradient: "from-gray-500 to-slate-500",
  //   icon: IdentificationIcon
  // },
};

// Traduction des rôles pour l'affichage sur le frontend (en français)
const roleTranslations: Record<RoleKey, string> = {
  "Sales Representative / Account Executive": "Représentant Commercial",
  "Project / Installation Manager": "Régie",
  "Technician / Installer": "Technicien / Installateur",
  "Customer Support / Service Representative": "Télépro - Assistance clients",
  "Super Admin": "Super Administrateur",
  // "Client / Customer (Client Portal)": "Client (Portail)",
};

// Descriptions des rôles
const roleDescriptions: Record<RoleKey, string> = {
  "Sales Representative / Account Executive": "Gère les relations commerciales et développe le portefeuille client.",
  "Project / Installation Manager": "Coordonne les projets et supervise les installations sur site.",
  "Technician / Installer": "Effectue les installations techniques et les interventions sur le terrain.",
  "Customer Support / Service Representative": "Fournit assistance et support aux clients existants.",
  "Super Admin": "Accès complet à toutes les fonctionnalités de la plateforme.",
  // "Client / Customer (Client Portal)": "Accès limité aux informations relatives à ses projets.",
};

// Permissions associées à chaque rôle
const permissionsData: Record<RoleKey, string[]> = {
  "Sales Representative / Account Executive": [
    "créer_client",
    "gestion_client_prospect",
    "agenda",
    "paiement_facturation",
    "status_page",
    "sav",
    "applications",
    "gestion_tâches",
    "accès_chat",
  ],
  "Project / Installation Manager": [
    "accès_clients",
    "gestion_tâches",
    "accès_chat",
    "agenda",
    "facturation_paiement",
    "rapport_statistique",
    "sav",
    "applications",
  ],
  "Technician / Installer": [
    "accès_clients",
    "accès_chat",
    "agenda",
    "gestion_tâches",
    "accès_documents"
  ],
  "Customer Support / Service Representative": [
    "créer_client",
    "gestion_client_prospect",
    "agenda",
    "paiement_facturation",
    "status_page",
    "sav",
    "applications",
    "gestion_tâches",
    "accès_chat",
  ],
  "Super Admin": [
    "accès_complet",
    "accès_devis_facture",
    "accès_signature_electronique",
    "accès_rdv_clients",
    "accès_modification_client",
    "accès_ensemble_clients",
    "accès_reglement",
    "accès_agenda",
    "accès_catalog",
    "accès_installateur",
    "accès_mpr",
    "gestion_des_stocks",
    "accès_deals",
    "facturation_paiements",
    "rapport_statistique",
    "accès_sav",
    "gestion_des_roles",
    "accès_applications",
    "gestion_des_modeles",
  ],
};

// Descriptions des permissions
const permissionDescriptions: Record<string, string> = {
  // Sales Representative & Customer Support permissions
  "créer_client": "Créer de nouveaux clients dans le système",
  "gestion_client_prospect": "Gérer les informations clients et prospects",
  "agenda": "Accès à l'agenda global ou personnel",
  "paiement_facturation": "Gestion des paiements et factures personnels",
  "status_page": "Visualisation et modification des statuts clients",
  "sav": "Gestion du service après-vente",
  "applications": "Accès aux applications externes (Gmail, Drive, Whatsapp, etc.)",
  "gestion_tâches": "Gestion des tâches assignées",
  "accès_chat": "Accès au système de messagerie interne",
  "accès_documents": "Accès aux documents et à la bibliothèque de ressources",
  
  // Régie (Project Manager) specific permissions
  "accès_clients": "Accès aux données clients",
  "facturation_paiement": "Gestion de la facturation et des paiements",
  "rapport_statistique": "Accès aux rapports et statistiques",
  
  // Admin permissions
  "accès_complet": "Accès complet à toutes les fonctionnalités",
  "accès_devis_facture": "Gestion des devis et factures",
  "accès_signature_electronique": "Accès au système de signature électronique",
  "accès_rdv_clients": "Gestion des rendez-vous clients",
  "accès_modification_client": "Modification des données clients",
  "accès_ensemble_clients": "Accès à l'ensemble des clients",
  "accès_reglement": "Gestion des règlements",
  "accès_catalog": "Gestion du catalogue de produits/services",
  "accès_installateur": "Gestion des installateurs",
  "accès_mpr": "Accès aux Mandataires MPR",
  "gestion_des_stocks": "Gestion de l'inventaire et des stocks",
  "accès_deals": "Accès et gestion des opportunités commerciales",
  "facturation_paiements": "Gestion complète de la facturation",
  "accès_sav": "Administration du service après-vente",
  "gestion_des_roles": "Gestion des rôles et permissions utilisateurs",
  "accès_applications": "Administration des applications externes",
  "gestion_des_modeles": "Gestion des modèles de documents",
  
  // Legacy permissions (keeping for backward compatibility)
  "accès_crm": "Accès au système CRM pour la gestion des clients",
  "gestion_des_prospects": "Création et gestion des prospects commerciaux",
  "négociation_contrats": "Négociation et finalisation des contrats clients",
  "rapports_de_vente": "Génération et consultation des rapports de vente",
  "planification_projet": "Planification et organisation des projets",
  "coordination_équipes": "Coordination des équipes techniques sur le terrain",
  "suivi_budgétaire": "Suivi du budget des projets et des coûts",
  "gestion_fournisseurs": "Gestion des relations avec les fournisseurs",
  "validation_travaux": "Validation des travaux réalisés",
  "facturation_client": "Création et gestion des factures clients",
  "accès_planning": "Accès au planning des interventions",
  "rapports_intervention": "Création des rapports d'intervention",
  "demandes_matériel": "Gestion des demandes de matériel",
  "documentation_technique": "Accès à la documentation technique",
  "gestion_tickets": "Gestion des tickets de support clients",
  "base_de_connaissances": "Accès à la base de connaissances",
  "communication_client": "Communication directe avec les clients",
  "suivi_sla": "Suivi des accords de niveau de service",
  "escalade_problèmes": "Escalade des problèmes techniques",
  "gestion_des_utilisateurs": "Création et gestion des utilisateurs",
  "configuration_système": "Configuration des paramètres système",
  "audit_activités": "Audit des activités des utilisateurs",
  "gestion_facturation": "Gestion de la facturation globale",
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
  gender?: string;
  
  // Régie specific fields
  companyName?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  siret?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  vatNumber?: string;
  logoUrl?: string;
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
  const [formData, setFormData] = useState<IUser>({...user});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  // États pour le mot de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  // État local pour les permissions du rôle courant sous forme d'objet: { permission: boolean }
  const [permissionToggles, setPermissionToggles] = useState<Record<string, boolean>>({});
  
  // Reference to logo input element
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Check if user has Régie role
  const isRegieRole = formData.role === "Project / Installation Manager";
  
  // Get role config
  const roleConfig = formData.role in rolesConfig 
    ? rolesConfig[formData.role as RoleKey] 
    : { color: "#6b7280", bgColor: "#f3f4f6", gradient: "from-gray-500 to-slate-500", icon: UserIcon };
  
  // Get current role icon component
  const RoleIcon = roleConfig.icon;

  // Met à jour les champs locaux si l'utilisateur change
  useEffect(() => {
    setFormData({...user});
    
    // Set logo preview if available
    if (user.logoUrl) {
      setLogoPreview(user.logoUrl);
    } else {
      setLogoPreview(null);
    }

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
    setConfirmPassword("");
    setIsPasswordTouched(false);
    setDeleteConfirmationText("");
    setDeleteConfirmation(false);
    setSuccess(null);
    setError(null);
    setActiveTab("general");
  }, [user]);

  // Évalue la force du mot de passe
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (formData.password.length >= 8) strength += 1;
    if (formData.password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[a-z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    
    // Normalize to 0-100
    setPasswordStrength(Math.min(100, Math.floor((strength / 6) * 100)));
  }, [formData.password]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for password field
    if (name === "password" && !isPasswordTouched) {
      setIsPasswordTouched(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler pour le changement du rôle
  const handleRoleChange = (newRole: string) => {
    setFormData(prev => ({
      ...prev,
      role: newRole
    }));
    
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

  // Trigger file input click
  const handleLogoClick = () => {
    if (logoInputRef.current) {
      logoInputRef.current.click();
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload the file to your server here
      // and update the formData.logoUrl with the URL from the server
      // For this demo, we'll just set a placeholder
      setFormData(prev => ({
        ...prev,
        logoUrl: URL.createObjectURL(file)
      }));
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData(prev => ({
      ...prev,
      logoUrl: undefined
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Fonction pour enregistrer les modifications
  const handleSave = async () => {
    // If a new password is provided, verify the confirmation
    if (formData.password && formData.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setActiveTab("security");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Store the original role to compare later
    const previousRole = user.role;
  
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          gender: formData.gender,
          
          // Régie specific fields
          ...(isRegieRole && {
            companyName: formData.companyName,
            website: formData.website,
            address: formData.address,
            postalCode: formData.postalCode,
            siret: formData.siret,
            professionalEmail: formData.professionalEmail,
            professionalPhone: formData.professionalPhone,
            vatNumber: formData.vatNumber,
            logoUrl: formData.logoUrl
          }),
          
          // Only include permissions that are enabled
          permissions: Object.keys(permissionToggles).filter((perm) => permissionToggles[perm]),
          
          // Send the new password if provided under a new field
          ...(formData.password && { newPassword: formData.password }),
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la mise à jour de l'utilisateur");
      }
      
      const updatedUser: User = await res.json();
      onUserUpdated(updatedUser);
      
      // If the role has changed, log the activity
      if (previousRole !== formData.role) {
        // Retrieve admin info from localStorage
        const proInfoStr = localStorage.getItem("proInfo");
        const proInfo = proInfoStr ? JSON.parse(proInfoStr) : {};
      
        // Format the current time as "15h30" (example)
        const now = new Date();
        const formattedTime =
          now.getHours() + "h" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
      
        const logDetails = `Changement de ${roleTranslations[previousRole as RoleKey]} → ${roleTranslations[formData.role as RoleKey]}`;
      
        await fetch("/api/activity-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Modification de rôle utilisateur",
            details: logDetails,
            time: formattedTime,
            user: proInfo.email || "unknown",
          }),
        });
      }
      
      setSuccess("Utilisateur mis à jour avec succès!");
      
      // Reset password fields
      setConfirmPassword("");
      setIsPasswordTouched(false);
      
      // Don't close the modal, just show success
      // onClose();
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
    // Verify confirmation text
    if (deleteConfirmationText !== "SUPPRIMER") {
      setError("Veuillez taper SUPPRIMER pour confirmer la suppression");
      return;
    }
    
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
      
      // Log the deletion action
      // Retrieve admin info from localStorage
      const proInfoStr = localStorage.getItem("proInfo");
      const proInfo = proInfoStr ? JSON.parse(proInfoStr) : {};
      
      // Format the current time as "13h45" (example)
      const now = new Date();
      const formattedTime =
        now.getHours() + "h" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
      
      // Create details message with the deleted user's email
      const logDetails = `${formData.email} supprimé`;
  
      await fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Suppression d'utilisateur",
          details: logDetails,
          time: formattedTime,
          user: proInfo.email || "unknown",
        }),
      });
      
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

  // Get display name
  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}`
    : formData.email;

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur effect */}
        <motion.div
          className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <FocusLock>
          <motion.div
            className="relative w-full max-w-6xl h-[90vh] md:h-[90vh] bg-white flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left Sidebar */}
            <div className="w-full md:w-80 md:min-w-[20rem] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-0 flex flex-col relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40"></div>
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
              </div>
              
              {/* User info section with glassmorphism effect */}
              <div className="relative flex flex-col items-center pt-10 px-8 pb-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
                <div className="relative group">
                  {logoPreview ? (
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl group-hover:shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                      <img 
                        src={logoPreview} 
                        alt="Logo" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                      <div className={`absolute inset-0 bg-gradient-to-br ${roleConfig.gradient} opacity-80`}></div>
                      <div className="absolute inset-0 bg-black opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="text-5xl font-bold text-white drop-shadow-md">
                          {formData.firstName && formData.lastName 
                            ? `${formData.firstName[0]}${formData.lastName[0]}`
                            : formData.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="absolute -bottom-3 -right-3 rounded-full bg-gradient-to-r from-white/20 to-white/10 p-1 backdrop-blur-md shadow-lg">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleConfig.gradient} flex items-center justify-center shadow-lg`}>
                      <RoleIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <h2 className="mt-6 text-xl font-bold text-white tracking-wide drop-shadow-sm">{displayName}</h2>
                <div className={`mt-2 px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r ${roleConfig.gradient} shadow-lg backdrop-blur-sm`}>
                  {roleTranslations[formData.role as RoleKey]}
                </div>
                
                <div className="w-full mt-6 flex flex-col items-center space-y-2">
                  <div className="w-full flex items-center backdrop-blur-sm bg-white/5 rounded-lg px-3 py-2 shadow-inner">
                    <EnvelopeIcon className="h-4 w-4 text-blue-300 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-200 truncate">{formData.email}</span>
                  </div>
                  
                  {isRegieRole && formData.companyName && (
                    <div className="w-full flex items-center backdrop-blur-sm bg-white/5 rounded-lg px-3 py-2 shadow-inner">
                      <BuildingOfficeIcon className="h-4 w-4 text-emerald-300 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-200 truncate">{formData.companyName}</span>
                    </div>
                  )}
                  
                  {formData.phone && (
                    <div className="w-full flex items-center backdrop-blur-sm bg-white/5 rounded-lg px-3 py-2 shadow-inner">
                      <PhoneIcon className="h-4 w-4 text-purple-300 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-200 truncate">{formData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation menu */}
              <nav className="flex-1 px-6 py-8 space-y-1.5">
                <h3 className="text-xs uppercase tracking-wider text-blue-300/80 font-semibold ml-2 mb-2">Gestion de Compte</h3>
                <button
                  onClick={() => setActiveTab("general")}
                  className={`group w-full px-4 py-3.5 rounded-xl flex items-center text-left transition-all duration-300 ${
                    activeTab === "general"
                      ? "bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeTab === "general" 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30" 
                      : "bg-white/10 group-hover:bg-white/15"
                  }`}>
                    <UserIcon className={`h-5 w-5 ${activeTab === "general" ? "text-white" : "text-blue-300 group-hover:text-white"}`} />
                  </div>
                  <div className="ml-3">
                    <span className="font-medium">Informations générales</span>
                    <p className="text-xs text-white/60 mt-0.5">Coordonnées et détails</p>
                  </div>
                  {activeTab === "general" && <div className="absolute left-0 w-1 h-10 bg-blue-400 rounded-r-lg"></div>}
                </button>
                
                <button
                  onClick={() => setActiveTab("security")}
                  className={`group w-full px-4 py-3.5 rounded-xl flex items-center text-left transition-all duration-300 ${
                    activeTab === "security"
                      ? "bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeTab === "security" 
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/30" 
                      : "bg-white/10 group-hover:bg-white/15"
                  }`}>
                    <KeyIcon className={`h-5 w-5 ${activeTab === "security" ? "text-white" : "text-amber-300 group-hover:text-white"}`} />
                  </div>
                  <div className="ml-3">
                    <span className="font-medium">Sécurité & Connexion</span>
                    <p className="text-xs text-white/60 mt-0.5">Mot de passe et options</p>
                  </div>
                  {activeTab === "security" && <div className="absolute left-0 w-1 h-10 bg-amber-400 rounded-r-lg"></div>}
                </button>
                
                <button
                  onClick={() => setActiveTab("permissions")}
                  className={`group w-full px-4 py-3.5 rounded-xl flex items-center text-left transition-all duration-300 ${
                    activeTab === "permissions"
                      ? "bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeTab === "permissions" 
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-md shadow-green-500/30" 
                      : "bg-white/10 group-hover:bg-white/15"
                  }`}>
                    <ShieldCheckIcon className={`h-5 w-5 ${activeTab === "permissions" ? "text-white" : "text-emerald-300 group-hover:text-white"}`} />
                  </div>
                  <div className="ml-3">
                    <span className="font-medium">Rôle & Permissions</span>
                    <p className="text-xs text-white/60 mt-0.5">Droits d&apos;accès</p>
                  </div>
                  {activeTab === "permissions" && <div className="absolute left-0 w-1 h-10 bg-emerald-400 rounded-r-lg"></div>}
                </button>
                
                {isRegieRole && (
                  <button
                    onClick={() => setActiveTab("regie")}
                    className={`group w-full px-4 py-3.5 rounded-xl flex items-center text-left transition-all duration-300 ${
                      activeTab === "regie"
                        ? "bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      activeTab === "regie" 
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/30" 
                        : "bg-white/10 group-hover:bg-white/15"
                    }`}>
                      <BuildingOfficeIcon className={`h-5 w-5 ${activeTab === "regie" ? "text-white" : "text-purple-300 group-hover:text-white"}`} />
                    </div>
                    <div className="ml-3">
                      <span className="font-medium">Détails Régie</span>
                      <p className="text-xs text-white/60 mt-0.5">Informations entreprise</p>
                    </div>
                    {activeTab === "regie" && <div className="absolute left-0 w-1 h-10 bg-purple-400 rounded-r-lg"></div>}
                  </button>
                )}
                
                <div className="h-0.5 bg-white/10 my-3 mx-2"></div>
                
                <button
                  onClick={() => setActiveTab("danger")}
                  className={`group w-full px-4 py-3.5 rounded-xl flex items-center text-left transition-all duration-300 ${
                    activeTab === "danger"
                      ? "bg-gradient-to-r from-red-900/40 to-red-900/20 backdrop-blur-sm text-red-300 shadow-lg"
                      : "text-red-400 hover:bg-red-900/10 hover:text-red-300"
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeTab === "danger" 
                      ? "bg-gradient-to-br from-red-600 to-red-700 shadow-md shadow-red-500/30" 
                      : "bg-red-900/20 group-hover:bg-red-900/30"
                  }`}>
                    <TrashIcon className="h-5 w-5 text-red-300" />
                  </div>
                  <div className="ml-3">
                    <span className="font-medium">Zone de danger</span>
                    <p className="text-xs text-red-400/60 mt-0.5">Suppression du compte</p>
                  </div>
                  {activeTab === "danger" && <div className="absolute left-0 w-1 h-10 bg-red-500 rounded-r-lg"></div>}
                </button>
              </nav>
              
              {/* Action buttons */}
              <div className="relative mt-auto pt-6 px-6 pb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="relative flex flex-col gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl flex items-center justify-center font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    {loading ? (
                      <div className="relative flex items-center justify-center">
                        <div className="absolute inline-flex h-full w-full rounded-xl opacity-30 bg-white/20 animate-ping"></div>
                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin text-white" />
                        <span className="text-white">Sauvegarde en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckBadgeIcon className="h-5 w-5 mr-2 text-blue-200" />
                        <span className="text-white">Enregistrer les modifications</span>
                      </div>
                    )}
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl flex items-center justify-center transition-all backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/10 group"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="text-white/90 group-hover:text-white font-medium">Fermer sans enregistrer</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center">
                  {activeTab === "general" && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mr-4 shadow-sm">
                        <UserIcon className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Informations générales</h2>
                        <p className="text-sm text-gray-500">Coordonnées et informations de contact</p>
                      </div>
                    </div>
                  )}
                  {activeTab === "security" && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mr-4 shadow-sm">
                        <KeyIcon className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Sécurité & Connexion</h2>
                        <p className="text-sm text-gray-500">Gestion des mots de passe et options de sécurité</p>
                      </div>
                    </div>
                  )}
                  {activeTab === "permissions" && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mr-4 shadow-sm">
                        <ShieldCheckIcon className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Rôle & Permissions</h2>
                        <p className="text-sm text-gray-500">Configuration des accès et autorisations</p>
                      </div>
                    </div>
                  )}
                  {activeTab === "regie" && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mr-4 shadow-sm">
                        <BuildingOfficeIcon className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Détails Régie</h2>
                        <p className="text-sm text-gray-500">Informations spécifiques à l&apos;entreprise</p>
                      </div>
                    </div>
                  )}
                  {activeTab === "danger" && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mr-4 shadow-sm">
                        <TrashIcon className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Zone de danger</h2>
                        <p className="text-sm text-gray-500">Actions de suppression et opérations sensibles</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-8 px-3 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">ID: {formData._id.substring(0, 6)}...</span>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Status messages */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="mx-8 my-4 overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-r-xl shadow-md text-red-700 flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Erreur</h4>
                        <p className="text-sm text-red-600 mt-0.5">{error}</p>
                      </div>
                      <button 
                        onClick={() => setError(null)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div 
                    className="mx-8 my-4 overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-xl shadow-md text-green-700 flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Succès</h4>
                        <p className="text-sm text-green-600 mt-0.5">{success}</p>
                      </div>
                      <button 
                        onClick={() => setSuccess(null)}
                        className="p-1.5 rounded-full hover:bg-green-100 text-green-400 hover:text-green-600 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Content area */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-slate-50/80">
                {/* General Information Tab */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="mx-8 my-6">
                      <div className="bg-white rounded-2xl shadow-lg border border-blue-100/40 overflow-hidden backdrop-blur-sm">
                        <div className="pl-6 pr-8 py-5 border-b border-blue-100 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3 shadow-sm">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            Informations personnelles
                          </h3>
                          <div className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                            Contact principal
                          </div>
                        </div>
                        
                        <div className="px-8 py-6 relative">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 opacity-10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 opacity-10 blur-3xl rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
                          
                          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all group-focus-within:text-blue-600">Prénom</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <UserIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                </div>
                                <input
                                  type="text"
                                  name="firstName"
                                  value={formData.firstName || ""}
                                  onChange={handleChange}
                                  placeholder="Prénom"
                                  className="pl-12 w-full h-12 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all py-3 px-4 shadow-sm text-gray-800"
                                />
                              </div>
                            </div>
                            
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all group-focus-within:text-blue-600">Nom</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <UserIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                </div>
                                <input
                                  type="text"
                                  name="lastName"
                                  value={formData.lastName || ""}
                                  onChange={handleChange}
                                  placeholder="Nom"
                                  className="pl-12 w-full h-12 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all py-3 px-4 shadow-sm text-gray-800"
                                />
                              </div>
                            </div>
                            
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all group-focus-within:text-blue-600">
                                Email <span className="text-blue-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <EnvelopeIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                </div>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="exemple@email.com"
                                  required
                                  className="pl-12 w-full h-12 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all py-3 px-4 shadow-sm text-gray-800"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                </div>
                              </div>
                              <p className="mt-1.5 text-xs text-gray-500">Adresse email principale du compte</p>
                            </div>
                            
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all group-focus-within:text-blue-600">Téléphone</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <PhoneIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                </div>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone || ""}
                                  onChange={handleChange}
                                  placeholder="+33 6 00 00 00 00"
                                  className="pl-12 w-full h-12 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all py-3 px-4 shadow-sm text-gray-800"
                                />
                              </div>
                              <p className="mt-1.5 text-xs text-gray-500">Format international recommandé</p>
                            </div>
                            
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all group-focus-within:text-blue-600">Genre</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <UserIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                </div>
                                <select
                                  name="gender"
                                  value={formData.gender || ""}
                                  onChange={handleChange}
                                  className="pl-12 w-full h-12 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all py-3 px-4 shadow-sm text-gray-800 appearance-none"
                                >
                                  <option value="">Sélectionner</option>
                                  <option value="Homme">Homme</option>
                                  <option value="Femme">Femme</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mx-8 mt-6 mb-8">
                      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100/40 overflow-hidden backdrop-blur-sm">
                        <div className="pl-6 pr-8 py-5 border-b border-indigo-100 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3 shadow-sm">
                              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            Informations du compte
                          </h3>
                          <div className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                            Système
                          </div>
                        </div>
                        
                        <div className="px-8 py-6 relative">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 opacity-10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                          
                          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Utilisateur</label>
                              <div className="mt-1 flex">
                                <div className="relative flex-1">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                  </div>
                                  <input
                                    type="text"
                                    value={formData._id}
                                    readOnly
                                    className="pl-12 w-full h-12 rounded-xl border border-gray-200 bg-gray-50/80 py-3 px-4 text-gray-500 shadow-sm"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(formData._id);
                                    // You would normally show a toast notification here
                                  }}
                                  className="ml-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all flex items-center shadow-sm"
                                  title="Copier l'ID"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copier
                                </button>
                              </div>
                              <p className="mt-1.5 text-xs text-gray-500">Identifiant unique dans la base de données</p>
                            </div>
                            
                            <div className="group">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de création</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <input
                                  type="text"
                                  value={new Date(formData.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric'
                                  })}
                                  readOnly
                                  className="pl-12 w-full h-12 rounded-xl border border-gray-200 bg-gray-50/80 py-3 px-4 text-gray-500 shadow-sm"
                                />
                              </div>
                              <p className="mt-1.5 text-xs text-gray-500">Date d&apos;ajout de l&apos;utilisateur à la plateforme</p>
                            </div>
                            
                            <div className="col-span-2">
                              <div className="px-5 py-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 shadow-sm">
                                <h4 className="text-sm font-medium text-indigo-800 flex items-center mb-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Informations système
                                </h4>
                                <p className="text-sm text-indigo-700">
                                  Ces informations sont générées par le système et ne peuvent pas être modifiées manuellement.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">Mot de passe</h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={user.realPassword || "••••••••••••"}
                                readOnly
                                className="pl-10 pr-10 w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-gray-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showCurrentPassword ? (
                                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <KeyIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="password"
                                name="password"
                                value={formData.password || ""}
                                onChange={handleChange}
                                placeholder="Nouveau mot de passe"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors py-2 px-3"
                              />
                            </div>
                            
                            {/* Password strength meter */}
                            {isPasswordTouched && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-xs text-gray-500">Force du mot de passe</div>
                                  <div className="text-xs font-medium">
                                    {passwordStrength < 30 && "Faible"}
                                    {passwordStrength >= 30 && passwordStrength < 60 && "Moyen"}
                                    {passwordStrength >= 60 && passwordStrength < 80 && "Fort"}
                                    {passwordStrength >= 80 && "Très fort"}
                                  </div>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      passwordStrength < 30
                                        ? "bg-red-500"
                                        : passwordStrength < 60
                                        ? "bg-yellow-500"
                                        : passwordStrength < 80
                                        ? "bg-green-500"
                                        : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${passwordStrength}%` }}
                                  ></div>
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                  Utilisez au moins 8 caractères avec des lettres majuscules, minuscules, des chiffres et des caractères spéciaux.
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <KeyIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmer le mot de passe"
                                className={`pl-10 w-full rounded-lg border focus:ring-2 transition-colors py-2 px-3 ${
                                  formData.password && confirmPassword && formData.password !== confirmPassword
                                    ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                }`}
                              />
                            </div>
                            
                            {formData.password && confirmPassword && formData.password !== confirmPassword && (
                              <div className="mt-1 text-xs text-red-500">
                                Les mots de passe ne correspondent pas
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">Options de connexion</h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Authentification à deux facteurs</h4>
                              <p className="text-xs text-gray-500 mt-1">Renforce la sécurité de votre compte en exigeant une vérification supplémentaire lors de la connexion.</p>
                            </div>
                            <Switch
                              checked={false}
                              onChange={() => {}}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200`}
                              disabled
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full transition-transform translate-x-1 bg-white`}
                              />
                            </Switch>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Verrouiller après échecs de connexion</h4>
                              <p className="text-xs text-gray-500 mt-1">Verrouille le compte après plusieurs tentatives de connexion échouées.</p>
                            </div>
                            <Switch
                              checked={true}
                              onChange={() => {}}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600`}
                              disabled
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full transition-transform translate-x-6 bg-white`}
                              />
                            </Switch>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Notifications de connexion</h4>
                              <p className="text-xs text-gray-500 mt-1">Envoie une notification par email lors de toute nouvelle connexion à votre compte.</p>
                            </div>
                            <Switch
                              checked={false}
                              onChange={() => {}}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200`}
                              disabled
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full transition-transform translate-x-1 bg-white`}
                              />
                            </Switch>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Permissions Tab */}
                {activeTab === "permissions" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">Rôle de l&apos;utilisateur</h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rôle <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              name="role"
                              value={formData.role}
                              onChange={(e) => handleRoleChange(e.target.value)}
                              className="pl-10 pr-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors py-2 px-3 appearance-none"
                            >
                              {(Object.keys(rolesConfig) as RoleKey[]).map((r) => (
                                <option key={r} value={r}>
                                  {roleTranslations[r]} ({r})
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`mt-4 p-4 rounded-lg bg-${roleConfig.bgColor} text-gray-700`}>
                          <h4 className="font-medium flex items-center">
                            <RoleIcon className={`h-5 w-5 mr-2 text-${roleConfig.color}`} />
                            {roleTranslations[formData.role as RoleKey]}
                          </h4>
                          <p className="mt-1 text-sm">
                            {roleDescriptions[formData.role as RoleKey]}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">Permissions du rôle</h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {Object.keys(permissionToggles).length === 0 ? (
                            <div className="col-span-2 text-center py-8">
                              <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-300" />
                              <p className="mt-2 text-gray-500">Aucune permission disponible pour ce rôle</p>
                            </div>
                          ) : (
                            <>
                              {Object.keys(permissionToggles).map((perm) => (
                                <div key={perm} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                  <Switch
                                    checked={permissionToggles[perm]}
                                    onChange={() => togglePermission(perm)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                      permissionToggles[perm] ? "bg-blue-600" : "bg-gray-200"
                                    }`}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                                        permissionToggles[perm] ? "translate-x-6" : "translate-x-1"
                                      } bg-white`}
                                    />
                                  </Switch>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                      {perm.replace(/_/g, " ")}
                                    </span>
                                    {permissionDescriptions[perm] && (
                                      <p className="text-xs text-gray-500 mt-1">{permissionDescriptions[perm]}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Régie Details Tab */}
                {activeTab === "regie" && isRegieRole && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-green-600" />
                            Informations de l&apos;entreprise
                          </h3>
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Régie
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nom de l&apos;entreprise <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="companyName"
                                value={formData.companyName || ""}
                                onChange={handleChange}
                                placeholder="Nom de l'entreprise"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Site Web
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="url"
                                name="website"
                                value={formData.website || ""}
                                onChange={handleChange}
                                placeholder="https://www.example.com"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              />
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Adresse
                            </label>
                            <div className="relative">
                              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <textarea
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                placeholder="Adresse complète"
                                rows={3}
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              ></textarea>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Code postal et ville
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode || ""}
                                onChange={handleChange}
                                placeholder="75000 Paris"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Numéro SIRET <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCardIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="siret"
                                value={formData.siret || ""}
                                onChange={handleChange}
                                placeholder="123 456 789 00012"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email professionnel <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                name="professionalEmail"
                                value={formData.professionalEmail || ""}
                                onChange={handleChange}
                                placeholder="contact@entreprise.com"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Téléphone professionnel
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                name="professionalPhone"
                                value={formData.professionalPhone || ""}
                                onChange={handleChange}
                                placeholder="01 23 45 67 89"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Numéro de TVA
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BanknotesIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="vatNumber"
                                value={formData.vatNumber || ""}
                                onChange={handleChange}
                                placeholder="FR12345678901"
                                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors py-2 px-3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                          <PhotoIcon className="h-5 w-5 mr-2 text-blue-500" />
                          Logo de l&apos;entreprise
                        </h3>
                      </div>
                      
                      <div className="p-6">
                        <input
                          type="file"
                          ref={logoInputRef}
                          onChange={handleLogoChange}
                          accept="image/*"
                          className="hidden"
                        />
                        
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          <div>
                            {logoPreview ? (
                              <div className="relative group">
                                <img 
                                  src={logoPreview} 
                                  alt="Logo" 
                                  className="w-40 h-40 object-contain border border-gray-200 rounded-lg p-2"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-all">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={handleRemoveLogo}
                                      className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={handleLogoClick}
                              >
                                <PhotoIcon className="h-12 w-12 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">Logo de l&apos;entreprise</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Télécharger un logo</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Téléchargez le logo de l&apos;entreprise pour l&apos;afficher sur son profil. Formats acceptés : PNG, JPG ou SVG.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={handleLogoClick}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <PhotoIcon className="h-5 w-5 mr-2" />
                                {logoPreview ? "Changer le logo" : "Ajouter un logo"}
                              </button>
                              {logoPreview && (
                                <button
                                  type="button"
                                  onClick={handleRemoveLogo}
                                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                                >
                                  <TrashIcon className="h-5 w-5 mr-2" />
                                  Supprimer
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Danger Zone Tab */}
                {activeTab === "danger" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
                        <h3 className="text-lg font-medium text-red-800 flex items-center">
                          <TrashIcon className="h-5 w-5 mr-2 text-red-600" />
                          Zone de danger
                        </h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="bg-red-50 rounded-lg p-4 mb-6">
                          <h4 className="text-sm font-medium text-red-800 flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
                            Attention
                          </h4>
                          <p className="mt-1 text-sm text-red-700">
                            Les actions ci-dessous sont irréversibles. Veuillez procéder avec précaution.
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">Supprimer l&apos;utilisateur</h4>
                            <p className="mt-1 text-sm text-gray-500">
                              Cette action supprimera définitivement le compte de cet utilisateur, y compris toutes ses données et son accès à la plateforme.
                            </p>
                            
                            {!deleteConfirmation ? (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmation(true)}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                              >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Supprimer l&apos;utilisateur
                              </button>
                            ) : (
                              <div className="mt-4 p-4 border border-red-300 rounded-lg bg-red-50">
                                <p className="text-sm text-red-800 mb-3">
                                  Pour confirmer la suppression, veuillez taper <strong>SUPPRIMER</strong> dans le champ ci-dessous:
                                </p>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={deleteConfirmationText}
                                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                    placeholder="SUPPRIMER"
                                    className="flex-1 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors py-2 px-3"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleteConfirmationText !== "SUPPRIMER" || loading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600 flex items-center whitespace-nowrap"
                                  >
                                    {loading ? (
                                      <>
                                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                        Suppression...
                                      </>
                                    ) : (
                                      <>
                                        <TrashIcon className="h-5 w-5 mr-2" />
                                        Confirmer
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteConfirmation(false);
                                      setDeleteConfirmationText("");
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </FocusLock>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}