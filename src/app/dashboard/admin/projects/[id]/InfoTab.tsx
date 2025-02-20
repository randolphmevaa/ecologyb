"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  HomeIcon,
  // BriefcaseIcon,
  ClockIcon,
  UserCircleIcon,
  LightBulbIcon,
  SunIcon,
  FireIcon,
  PaintBrushIcon,
  // LightBulbIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  CalendarIcon,
  PhoneIcon,
  MapIcon,
  IdentificationIcon,
  PencilIcon,
  // CurrencyRupeeIcon,
  LockClosedIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  EnvelopeIcon,
  // BriefcaseIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import CommentsSection from "./CommentsSection";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

// ------------------------------------------------------
// Type Definitions
// ------------------------------------------------------

export interface Dossier {
  nombrePersonne?: string;
  typeTravaux?: string;
  nombrePersonnes?: string;
  codePostal?: string;
  mprColor?: string;
  anneeConstruction?: string;
  typeCompteurElectrique?: string;
  compteurElectrique?: string;
  surfaceChauffee?: string;
  profil?: string;
  typeDeLogement?: string;
  numero: string;
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam?: string;
  notes?: string;
  informationLogement?: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
    profil?: string;
    nombrePersonnes?: string;
  };
  informationTravaux?: {
    typeTravaux?: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
  _id: string;
  contactId?: string;
}

export interface DossierFormData {
  nombrePersonnes?: string;
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam: string;
  notes: string;
  numero?: string;
  surfaceChauffee?: string;
  compteurElectrique?: string;
  anneeConstruction?: string;
  typeDeLogement?: string;
  profil?: string;
  typeTravaux?: string;
  mprColor?: string;
  // Additional properties expected by InfoTab
  nombrePersonne?: string;  // if different from nombrePersonnes
  codePostal?: string;
  // New field for API/COMMENTAIRES:
  commentaire?: string;
  informationLogement?: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
    profil?: string;
    nombrePersonnes?: string;
  };
  informationTravaux?: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
}

// A type for comment data
export interface CommentData {
  _id?: string;
  commentaire?: string;
  auteur?: string;
  date?: string;
  linkedTo?: string;
}

// interface UserDetailsCardProps {
//   user: User;
//   label?: string;
// }

// Contact data interface
export interface Contact {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  organizationPhone?: string;
  organizationAddress?: string;
  role?: string;
  titre?: string;
  tags?: string[];
  suivi?: boolean;
  dateNextActivity?: string;
  heatingType?: string;
  rfr?: string;
  prefix?: string;
  emailOptedOut?: boolean;
  homePhone?: string;
  mobilePhone?: string;
  otherPhone?: string;
  assistantPhone?: string;
  assistantName?: string;
  fax?: string;
  linkedIn?: string;
  firstName?: string;
  lastName?: string;
  facebook?: string;
  twitter?: string;
  mailingAddress?: string;
  otherAddress?: string;
  dateToRemember?: string;
  dateOfBirth?: string;
  description?: string;
  department?: string;
  climateZone?: string;
  imageUrl?: string;
  mpremail?: string;
  mprpassword?: string;
  maprNumero?: string;     // Numéro de dossier MPR
  maprEmail?: string;      // Accès Ma Prime Renov - Email
  mprPassword?: string;    // Accès Ma Prime Renov - Mot de passe    // Zone climatique          // Revenue Fiscal de Référence
  eligible?: string;
  mprColor?: string;
  codePostal?: string;
  nombrePersonnes?: string;
}

// Weather data type
// interface WeatherData {
//   icon: string;
//   condition: string;
//   temp: number;
// }

// User type
interface User {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface AssignedUserCardProps {
  user: User;
}

// Helper function to translate roles if needed
function getRoleInFrench(role: string | undefined) {
  const ROLE_TRANSLATIONS: Record<string, string> = {
    "Sales Representative / Account Executive": "Représentant commercial / Directeur de compte",
    "Project / Installation Manager": "Responsable de projet / Gestionnaire d'installation",
    "Technician / Installer": "Technicien / Installateur",
    "Customer Support / Service Representative": "Support client / Représentant du service",
    "Client / Customer (Client Portal)": "Client / Consommateur (Portail client)",
    "Super Admin": "Super Admin",
  };
  return role ? ROLE_TRANSLATIONS[role] || role : "N/A";
}

// Props for InfoTab
interface InfoTabProps {
  dossier: Dossier;
  formData: DossierFormData;
  commentData?: CommentData;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleNestedInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: "informationLogement" | "informationTravaux"
  ) => void;
  userList: User[];
  handleSave: () => void;
  handleCancel: () => void;
  contact?: Contact;
}

// ------------------------------------------------------
// EditableField Component
// ------------------------------------------------------

interface EditableFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  icon?: React.ElementType;
  inputType?: string; // "text" | "number" | "select" ...
  options?: { label: string; value: string }[];
  readOnly?: boolean;
  onAddNew?: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  icon: Icon,
  inputType = "text",
  options,
  readOnly = false,
  onAddNew,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value ?? ""));

  const handleClick = () => {
    if (!readOnly) {
      setEditing(true);
    }
  };

  return (
    <div className="group flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
      {Icon && (
        <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
      )}
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
        {editing && !readOnly ? (
          inputType === "select" && options ? (
            <div className="relative">
              <select
                value={tempValue}
                onChange={(e) => {
                  if (e.target.value === "__add_new__") {
                    onAddNew?.();
                    setEditing(false);
                  } else {
                    setTempValue(e.target.value);
                  }
                }}
                onBlur={() => {
                  setEditing(false);
                  onChange(tempValue);
                }}
                className="w-full border-b-2 border-blue-500 focus:outline-none bg-transparent py-1 pr-8 appearance-none"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="h-4 w-4 absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          ) : (
            <input
              type={inputType}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => {
                setEditing(false);
                onChange(tempValue);
              }}
              className="w-full border-b-2 border-blue-500 focus:outline-none bg-transparent py-1"
              autoFocus
            />
          )
        ) : (
          <div
            onClick={handleClick}
            className={`cursor-pointer truncate text-gray-900 ${
              readOnly ? "pointer-events-none" : ""
            }`}
          >
            {value !== undefined && value !== null && value !== ""
              ? String(value)
              : <span className="text-gray-400 italic">Non défini</span>}
          </div>
        )}
      </div>
      {!readOnly && (
        <PencilIcon
          className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setEditing(true)}
        />
      )}
    </div>
  );
};

const AssignedUserCard: React.FC<AssignedUserCardProps> = ({ user }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-300"
    >
      {/* Top Banner Image */}
      <div className="relative w-full h-40">
        <Image
          src="https://www.hotesse-interim.fr/ressources/images/ab4fec7ce0ed.jpg"
          alt="Chargé de compte"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/100" />
      </div>

      {/* User Info Section */}
      <div className="p-6 space-y-5">
        {/* Title & Role */}
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-xl font-bold text-gray-800">Chargé de compte</h3>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
            {getRoleInFrench(user.role)}
          </span>
        </div>

        {/* Full Name */}
        <div className="flex items-start gap-2 flex-wrap break-words">
          <UserIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <p className="text-base text-gray-700 leading-snug">
            {user.firstName} {user.lastName}
          </p>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2 flex-wrap break-words">
          <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <p className="text-base text-gray-700 leading-snug">
            {user.phone || "N/A"}
          </p>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2 flex-wrap break-words">
          <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <p className="text-base text-gray-700 leading-snug">
            {user.email || "N/A"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ------------------------------------------------------
// AccordionSection Component
// ------------------------------------------------------
// const AccordionSection = ({
//   title,
//   icon: Icon,
//   children,
// }: {
//   title: string;
//   icon?: React.ElementType;
//   children: React.ReactNode;
// }) => {
//   const [open, setOpen] = useState(true);
//   return (
//     <div className="border-b border-gray-200">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full text-left py-3 px-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
//       >
//         <div className="flex items-center gap-2">
//           {Icon && <Icon className="h-5 w-5 text-gray-500" />}
//           <span className="font-semibold text-gray-700">{title}</span>
//         </div>
//         <motion.span animate={{ rotate: open ? 0 : 180 }} className="text-gray-500">
//           ▼
//         </motion.span>
//       </button>
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="overflow-hidden"
//           >
//             <div className="p-4 space-y-4">{children}</div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// const UserDetailsCard: React.FC<UserDetailsCardProps> = ({
//   user,
//   label = "Gestionnaire de suivi",
// }) => {
//   return (
//     <div className="border p-4 rounded-lg bg-white shadow-sm">
//       <div className="flex items-center gap-2 mb-3">
//         <UserCircleIcon className="h-8 w-8 text-gray-600" />
//         <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
//       </div>
//       <div className="space-y-1 text-sm text-gray-700">
//         <p>
//           <span className="font-medium">Nom:</span> {user.firstName}{" "}
//           {user.lastName}
//         </p>
//         <p>
//           <span className="font-medium">Email:</span> {user.email}
//         </p>
//         <p>
//           <span className="font-medium">Rôle:</span> {user.role}
//         </p>
//       </div>
//     </div>
//   );
// };

// Custom PasswordField Component
const PasswordField: React.FC<{ 
  label: string; 
  password: string; 
  icon?: React.ElementType; 
}> = ({ label, password, icon: Icon }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="group flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
      {Icon && (
        <Icon
          className="h-5 w-5 text-gray-400 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
        <input
          type={revealed ? "text" : "password"}
          value={password}
          readOnly
          className="w-full bg-transparent border-b border-gray-300 py-1 focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={() => setRevealed(!revealed)}
        className="text-sm text-blue-600 hover:underline"
      >
        {revealed ? "Masquer" : "Afficher"}
      </button>
    </div>
  );
};

function formatPhaseLabel(phase: string): string {
  const parts = phase.split(" ");
  if (parts.length > 1) {
    const stepNumber = parts[0];
    const stepTitle = parts.slice(1).join(" ");
    return `Étape ${stepNumber} – ${stepTitle}`;
  }
  return phase;
}

function getPhaseBadgeColor(phase: string): string {
  switch (phase) {
    case "1 Prise de contact":
      return "bg-gray-100 text-gray-800";
    case "2 En attente des documents":
      return "bg-blue-100 text-blue-800";
    case "3 Instruction du dossier":
      return "bg-yellow-100 text-yellow-800";
    case "4 Dossier Accepter":
      return "bg-green-100 text-green-800";
    case "5 Installation":
      return "bg-purple-100 text-purple-800";
    case "6 Contrôle":
      return "bg-orange-100 text-orange-800";
    case "7 Dossier clôturé":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// ------------------------------------------------------
// InfoTab Component (Updated with EditableFields)
// ------------------------------------------------------
const InfoTab: React.FC<InfoTabProps> = ({
  dossier,
  formData,
  // handleInputChange,
  // handleNestedInputChange,
  // userList,
  contact: contactProp,
  // commentData,
}) => {
  const router = useRouter();
  // const [saveStatus] = useState("Sauvegardé");
  const [weather, setWeather] = useState<{
      temp: number;
      condition: string;
      icon: string;
    } | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);

  const [contact, setContact] = useState<Contact | null>(contactProp ?? null);
  const [ , setAssignedUserDetails] = useState<User | null>(null);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  // const [contactLoading, setContactLoading] = useState(false);
  // const [contactError, setContactError] = useState<string | null>(null);

  const rfrValue = Number(contact?.rfr ?? 0);

  // Update a contact field locally and via API
  // const updateContactField = async (field: string, value: string | boolean) => {
  //   if (!contact || !contact._id) return;
  //   // 1) update local state
  //   setContact((prev) => (prev ? { ...prev, [field]: value } : null));

  //   // 2) update the server
  //   try {
  //     const res = await fetch(`/api/contacts/${dossier.contactId}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ [field]: value }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       console.error("Update failed", data);
  //       // Optional: revert local state if needed
  //     } else {
  //       console.log("Update successful", data);
  //     }
  //   } catch (err) {
  //     console.error("Error updating contact", err);
  //     // Optional: revert local state if needed
  //   }
  // };

  {/* Helper to convert French color names to hex values */}
const getColorHex = (colorName: string | undefined) => {
  if (!colorName) return "#ffffff";
  switch (colorName.toLowerCase()) {
    case "vert":
      return "#28a745"; // Bootstrap green
    case "rouge":
      return "#dc3545"; // Bootstrap red
    case "bleu":
      return "#007bff"; // Bootstrap blue
    case "jaune":
      return "#ffc107"; // Bootstrap yellow
    default:
      return colorName; // Assume it's already a valid hex or CSS color
  }
};

  const DEPARTMENT_COORDINATES: { [key: string]: { lat: number; lon: number } } = {
      // Metropolitan France
      "01": { lat: 46.2055, lon: 5.2257 },   // Ain (Bourg-en-Bresse)
      "02": { lat: 49.8942, lon: 3.0589 },   // Aisne (Laon)
      "03": { lat: 46.5655, lon: 3.3363 },   // Allier (Moulins)
      "04": { lat: 44.0925, lon: 6.2379 },   // Alpes-de-Haute-Provence (Digne-les-Bains)
      "05": { lat: 44.5581, lon: 6.0824 },   // Hautes-Alpes (Gap)
      "06": { lat: 43.6961, lon: 7.2719 },   // Alpes-Maritimes (Nice)
      "07": { lat: 44.5167, lon: 4.6667 },   // Ardèche (Privas)
      "08": { lat: 49.7667, lon: 4.7167 },   // Ardennes (Charleville-Mézières)
      "09": { lat: 42.9833, lon: 1.6167 },   // Ariège (Foix)
      "10": { lat: 48.3000, lon: 4.0833 },   // Aube (Troyes)
      "11": { lat: 43.1852, lon: 2.3544 },   // Aude (Carcassonne)
      "12": { lat: 44.5167, lon: 2.1667 },   // Aveyron (Rodez)
      "13": { lat: 43.2964, lon: 5.3700 },   // Bouches-du-Rhône (Marseille)
      "14": { lat: 49.1833, lon: -0.3500 },  // Calvados (Caen)
      "15": { lat: 44.9283, lon: 2.4417 },   // Cantal (Aurillac)
      "16": { lat: 45.6500, lon: 0.1500 },   // Charente (Angoulême)
      "17": { lat: 45.9333, lon: -0.9667 },  // Charente-Maritime (La Rochelle)
      "18": { lat: 47.0833, lon: 2.4000 },   // Cher (Bourges)
      "19": { lat: 45.1467, lon: 1.5333 },   // Corrèze (Tulle)
      "2A": { lat: 41.9264, lon: 8.7369 },   // Corse-du-Sud (Ajaccio)
      "2B": { lat: 42.7019, lon: 9.4500 },   // Haute-Corse (Bastia)
      "21": { lat: 47.3167, lon: 5.0167 },   // Côte-d'Or (Dijon)
      "22": { lat: 48.5136, lon: -2.7653 },  // Côtes-d'Armor (Saint-Brieuc)
      "23": { lat: 46.1167, lon: 1.8667 },   // Creuse (Guéret)
      "24": { lat: 45.1833, lon: 0.7167 },   // Dordogne (Périgueux)
      "25": { lat: 47.2381, lon: 6.0244 },   // Doubs (Besançon)
      "26": { lat: 44.9333, lon: 4.8833 },   // Drôme (Valence)
      "27": { lat: 49.0236, lon: 1.1506 },   // Eure (Évreux)
      "28": { lat: 48.4444, lon: 1.4889 },   // Eure-et-Loir (Chartres)
      "29": { lat: 48.3833, lon: -4.4833 },  // Finistère (Quimper)
      "30": { lat: 43.8369, lon: 4.3600 },   // Gard (Nîmes)
      "31": { lat: 43.6043, lon: 1.4436 },   // Haute-Garonne (Toulouse)
      "32": { lat: 43.6489, lon: 0.5853 },   // Gers (Auch)
      "33": { lat: 44.8378, lon: -0.5792 },  // Gironde (Bordeaux)
      "34": { lat: 43.6108, lon: 3.8764 },   // Hérault (Montpellier)
      "35": { lat: 48.1147, lon: -1.6794 },  // Ille-et-Vilaine (Rennes)
      "36": { lat: 46.8094, lon: 1.6914 },   // Indre (Châteauroux)
      "37": { lat: 47.3936, lon: 0.6892 },   // Indre-et-Loire (Tours)
      "38": { lat: 45.1885, lon: 5.7245 },   // Isère (Grenoble)
      "39": { lat: 46.6753, lon: 5.5553 },   // Jura (Lons-le-Saunier)
      "40": { lat: 43.8914, lon: -0.5017 },  // Landes (Mont-de-Marsan)
      "41": { lat: 47.5931, lon: 1.3358 },   // Loir-et-Cher (Blois)
      "42": { lat: 45.4333, lon: 4.3833 },   // Loire (Saint-Étienne)
      "43": { lat: 45.0425, lon: 3.8853 },   // Haute-Loire (Le Puy-en-Velay)
      "44": { lat: 47.2173, lon: -1.5534 },  // Loire-Atlantique (Nantes)
      "45": { lat: 47.9000, lon: 2.0833 },   // Loiret (Orléans)
      "46": { lat: 44.4489, lon: 1.4406 },   // Lot (Cahors)
      "47": { lat: 44.2000, lon: 0.6167 },   // Lot-et-Garonne (Agen)
      "48": { lat: 44.5167, lon: 3.5000 },   // Lozère (Mende)
      "49": { lat: 47.4667, lon: -0.5500 },  // Maine-et-Loire (Angers)
      "50": { lat: 49.1167, lon: -1.0833 },  // Manche (Saint-Lô)
      "51": { lat: 49.2533, lon: 4.0289 },   // Marne (Châlons-en-Champagne)
      "52": { lat: 48.1000, lon: 5.1333 },   // Haute-Marne (Chaumont)
      "53": { lat: 48.0667, lon: -0.7667 },  // Mayenne (Laval)
      "54": { lat: 48.6833, lon: 6.1833 },   // Meurthe-et-Moselle (Nancy)
      "55": { lat: 48.9558, lon: 5.3847 },   // Meuse (Bar-le-Duc)
      "56": { lat: 47.6667, lon: -2.7500 },  // Morbihan (Vannes)
      "57": { lat: 49.1194, lon: 6.1758 },   // Moselle (Metz)
      "58": { lat: 47.0000, lon: 3.3333 },   // Nièvre (Nevers)
      "59": { lat: 50.6667, lon: 3.0667 },   // Nord (Lille)
      "60": { lat: 49.4000, lon: 2.0833 },   // Oise (Beauvais)
      "61": { lat: 48.4333, lon: 0.0833 },   // Orne (Alençon)
      "62": { lat: 50.7264, lon: 1.6139 },   // Pas-de-Calais (Arras)
      "63": { lat: 45.7831, lon: 3.0825 },   // Puy-de-Dôme (Clermont-Ferrand)
      "64": { lat: 43.2950, lon: -0.3708 },  // Pyrénées-Atlantiques (Pau)
      "65": { lat: 43.2333, lon: 0.0667 },   // Hautes-Pyrénées (Tarbes)
      "66": { lat: 42.7011, lon: 2.8958 },   // Pyrénées-Orientales (Perpignan)
      "67": { lat: 48.5833, lon: 7.7500 },   // Bas-Rhin (Strasbourg)
      "68": { lat: 47.7500, lon: 7.3333 },   // Haut-Rhin (Colmar)
      "69": { lat: 45.7589, lon: 4.8414 },   // Rhône (Lyon)
      "70": { lat: 47.6333, lon: 6.1500 },   // Haute-Saône (Vesoul)
      "71": { lat: 46.7833, lon: 4.8500 },   // Saône-et-Loire (Mâcon)
      "72": { lat: 47.9833, lon: 0.2000 },   // Sarthe (Le Mans)
      "73": { lat: 45.5667, lon: 5.9167 },   // Savoie (Chambéry)
      "74": { lat: 46.0500, lon: 6.5833 },   // Haute-Savoie (Annecy)
      "75": { lat: 48.8566, lon: 2.3522 },   // Paris (Paris)
      "76": { lat: 49.4431, lon: 1.0993 },   // Seine-Maritime (Rouen)
      "77": { lat: 48.5392, lon: 2.6533 },   // Seine-et-Marne (Melun)
      "78": { lat: 48.8014, lon: 2.1305 },   // Yvelines (Versailles)
      "79": { lat: 46.6667, lon: -0.3667 },  // Deux-Sèvres (Niort)
      "80": { lat: 49.8958, lon: 2.3000 },   // Somme (Amiens)
      "81": { lat: 43.9281, lon: 2.1475 },   // Tarn (Albi)
      "82": { lat: 44.0000, lon: 1.3333 },   // Tarn-et-Garonne (Montauban)
      "83": { lat: 43.3000, lon: 6.1500 },   // Var (Toulon)
      "84": { lat: 43.9500, lon: 4.8000 },   // Vaucluse (Avignon)
      "85": { lat: 46.6667, lon: -1.4333 },  // Vendée (La Roche-sur-Yon)
      "86": { lat: 46.5833, lon: 0.3333 },   // Vienne (Poitiers)
      "87": { lat: 45.8333, lon: 1.2500 },   // Haute-Vienne (Limoges)
      "88": { lat: 48.2000, lon: 6.4500 },   // Vosges (Épinal)
      "89": { lat: 47.8000, lon: 3.5667 },   // Yonne (Auxerre)
      "90": { lat: 47.6333, lon: 6.8667 },   // Territoire de Belfort (Belfort)
      "91": { lat: 48.6328, lon: 2.4407 },   // Essonne (Évry)
      "92": { lat: 48.8924, lon: 2.2153 },   // Hauts-de-Seine (Nanterre)
      "93": { lat: 48.9102, lon: 2.4390 },   // Seine-Saint-Denis (Bobigny)
      "94": { lat: 48.7904, lon: 2.4556 },   // Val-de-Marne (Créteil)
      "95": { lat: 49.0389, lon: 2.0775 },   // Val-d'Oise (Cergy)
    
      // Overseas departments
      "971": { lat: 16.2500, lon: -61.5833 }, // Guadeloupe (Basse-Terre)
      "972": { lat: 14.6000, lon: -61.0833 }, // Martinique (Fort-de-France)
      "973": { lat: 4.9372, lon: -52.3260 },  // Guyane (Cayenne)
      "974": { lat: -20.8789, lon: 55.4481 }, // La Réunion (Saint-Denis)
      "976": { lat: -12.7870, lon: 45.2750 }  // Mayotte (Mamoudzou)
    };

    // Department list (code + short name) in an array
const DEPARTMENT_OPTIONS = [
  { value: "01", label: "Ain" },
  { value: "02", label: "Aisne" },
  { value: "03", label: "Allier" },
  { value: "04", label: "Alpes-de-Haute-Provence" },
  { value: "05", label: "Hautes-Alpes" },
  { value: "06", label: "Alpes-Maritimes" },
  { value: "07", label: "Ardèche" },
  { value: "08", label: "Ardennes" },
  { value: "09", label: "Ariège" },
  { value: "10", label: "Aube" },
  { value: "11", label: "Aude" },
  { value: "12", label: "Aveyron" },
  { value: "13", label: "Bouches-du-Rhône" },
  { value: "14", label: "Calvados" },
  { value: "15", label: "Cantal" },
  { value: "16", label: "Charente" },
  { value: "17", label: "Charente-Maritime" },
  { value: "18", label: "Cher" },
  { value: "19", label: "Corrèze" },
  { value: "2A", label: "Corse-du-Sud" },
  { value: "2B", label: "Haute-Corse" },
  { value: "21", label: "Côte-d'Or" },
  { value: "22", label: "Côtes-d'Armor" },
  { value: "23", label: "Creuse" },
  { value: "24", label: "Dordogne" },
  { value: "25", label: "Doubs" },
  { value: "26", label: "Drôme" },
  { value: "27", label: "Eure" },
  { value: "28", label: "Eure-et-Loir" },
  { value: "29", label: "Finistère" },
  { value: "30", label: "Gard" },
  { value: "31", label: "Haute-Garonne" },
  { value: "32", label: "Gers" },
  { value: "33", label: "Gironde" },
  { value: "34", label: "Hérault" },
  { value: "35", label: "Ille-et-Vilaine" },
  { value: "36", label: "Indre" },
  { value: "37", label: "Indre-et-Loire" },
  { value: "38", label: "Isère" },
  { value: "39", label: "Jura" },
  { value: "40", label: "Landes" },
  { value: "41", label: "Loir-et-Cher" },
  { value: "42", label: "Loire" },
  { value: "43", label: "Haute-Loire" },
  { value: "44", label: "Loire-Atlantique" },
  { value: "45", label: "Loiret" },
  { value: "46", label: "Lot" },
  { value: "47", label: "Lot-et-Garonne" },
  { value: "48", label: "Lozère" },
  { value: "49", label: "Maine-et-Loire" },
  { value: "50", label: "Manche" },
  { value: "51", label: "Marne" },
  { value: "52", label: "Haute-Marne" },
  { value: "53", label: "Mayenne" },
  { value: "54", label: "Meurthe-et-Moselle" },
  { value: "55", label: "Meuse" },
  { value: "56", label: "Morbihan" },
  { value: "57", label: "Moselle" },
  { value: "58", label: "Nièvre" },
  { value: "59", label: "Nord" },
  { value: "60", label: "Oise" },
  { value: "61", label: "Orne" },
  { value: "62", label: "Pas-de-Calais" },
  { value: "63", label: "Puy-de-Dôme" },
  { value: "64", label: "Pyrénées-Atlantiques" },
  { value: "65", label: "Hautes-Pyrénées" },
  { value: "66", label: "Pyrénées-Orientales" },
  { value: "67", label: "Bas-Rhin" },
  { value: "68", label: "Haut-Rhin" },
  { value: "69", label: "Rhône" },
  { value: "70", label: "Haute-Saône" },
  { value: "71", label: "Saône-et-Loire" },
  { value: "72", label: "Sarthe" },
  { value: "73", label: "Savoie" },
  { value: "74", label: "Haute-Savoie" },
  { value: "75", label: "Paris" },
  { value: "76", label: "Seine-Maritime" },
  { value: "77", label: "Seine-et-Marne" },
  { value: "78", label: "Yvelines" },
  { value: "79", label: "Deux-Sèvres" },
  { value: "80", label: "Somme" },
  { value: "81", label: "Tarn" },
  { value: "82", label: "Tarn-et-Garonne" },
  { value: "83", label: "Var" },
  { value: "84", label: "Vaucluse" },
  { value: "85", label: "Vendée" },
  { value: "86", label: "Vienne" },
  { value: "87", label: "Haute-Vienne" },
  { value: "88", label: "Vosges" },
  { value: "89", label: "Yonne" },
  { value: "90", label: "Territoire de Belfort" },
  { value: "91", label: "Essonne" },
  { value: "92", label: "Hauts-de-Seine" },
  { value: "93", label: "Seine-Saint-Denis" },
  { value: "94", label: "Val-de-Marne" },
  { value: "95", label: "Val-d'Oise" },
  // Overseas:
  { value: "971", label: "Guadeloupe" },
  { value: "972", label: "Martinique" },
  { value: "973", label: "Guyane" },
  { value: "974", label: "La Réunion" },
  { value: "976", label: "Mayotte" },
];

  
    const WEATHER_CODES: { [key: number]: { label: string, icon: string } } = {
      0: { label: "Ciel dégagé", icon: "/weather-icons/0.svg" },
      1: { label: "Principalement clair", icon: "/weather-icons/partly-cloudy-day.svg" },
      2: { label: "Partiellement nuageux", icon: "/weather-icons/partly-cloudy-day.svg" },
      3: { label: "Couvert", icon: "/weather-icons/overcast.svg" },
      45: { label: "Brouillard", icon: "/weather-icons/fog-day.svg" },
      48: { label: "Brouillard givrant", icon: "/weather-icons/fog.svg" },
      51: { label: "Bruine légère", icon: "/weather-icons/51.svg" },
      53: { label: "Bruine modérée", icon: "/weather-icons/51.svg" },
      55: { label: "Bruine dense", icon: "/weather-icons/51.svg" },
      61: { label: "Pluie légère", icon: "/weather-icons/rain.svg" },
      63: { label: "Pluie modérée", icon: "/weather-icons/rain.svg" },
      65: { label: "Pluie forte", icon: "/weather-icons/rain.svg" },
      71: { label: "Neige légère", icon: "/weather-icons/71.svg" },
      73: { label: "Neige modérée", icon: "/weather-icons/71.svg" },
      75: { label: "Neige forte", icon: "/weather-icons/71.svg" },
      77: { label: "Grêle", icon: "/weather-icons/71.svg" },
      80: { label: "Averses légères", icon: "/weather-icons/80.svg" },
      81: { label: "Averses modérées", icon: "/weather-icons/80.svg" },
      82: { label: "Averses violentes", icon: "/weather-icons/80.svg" },
      85: { label: "Averses de neige", icon: "/weather-icons/85.svg" },
      86: { label: "Tempête de neige", icon: "/weather-icons/85.svg" },
      95: { label: "Orage", icon: "/weather-icons/95.svg" },
      96: { label: "Orage avec grêle", icon: "/weather-icons/95.svg" },
      99: { label: "Orage violent", icon: "/weather-icons/95.svg" },
    };
  
    useEffect(() => {
        const fetchWeather = async () => {
          if (!contact?.department) return;
          
          try {
            setWeatherLoading(true);
            setWeatherError(null);
            
            const coords = DEPARTMENT_COORDINATES[contact.department] || DEPARTMENT_COORDINATES["75"];
            
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=Europe%2FParis`
            );
      
            if (!response.ok) throw new Error("Échec de la récupération météo");
            
            const data = await response.json();
            const weatherCode = data.current.weather_code;
            
            setWeather({
              temp: Math.round(data.current.temperature_2m),
              condition: WEATHER_CODES[weatherCode]?.label || "Conditions inconnues",
              icon: WEATHER_CODES[weatherCode]?.icon || "/weather-icons/default.svg"
            });
          } catch (err) {
            console.error("Erreur météo:", err);
            setWeatherError("Météo non disponible");
          } finally {
            setWeatherLoading(false);
          }
        };
      
        if (contact) fetchWeather();
      }, [contact]);

  // Helper to update top-level fields via handleInputChange
  // const handleEditableFieldChange = async (fieldName: string, value: string) => {
  //   // 1) Update local state
  //   handleInputChange({
  //     target: { name: fieldName, value },
  //   } as React.ChangeEvent<HTMLInputElement>);

  //   // 2) PATCH the single changed field to server
  //   try {
  //     const res = await fetch(`/api/dossiers/${dossier._id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ [fieldName]: value }),
  //     });
  //     if (!res.ok) {
  //       console.error("Failed to patch field:", fieldName);
  //     }
  //   } catch (err) {
  //     console.error("Patch error:", err);
  //   }
  // };

  // Helper to update nested fields (informationLogement / informationTravaux)
  // const handleNestedEditableFieldChange = async (
  //   section: "informationLogement" | "informationTravaux",
  //   fieldName: string,
  //   value: string
  // ) => {
  //   // 1) Update local state
  //   handleNestedInputChange(
  //     {
  //       target: { name: fieldName, value },
  //     } as React.ChangeEvent<HTMLInputElement>,
  //     section
  //   );

  //   // 2) Build new partial object for PATCH
  //   // For example, if user updates "typeDeLogement",
  //   // then we send { informationLogement: { ...existing, typeDeLogement: newVal } }
  //   const oldSectionData = dossier[section] || {};
  //   const newSectionData = {
  //     ...oldSectionData,
  //     [fieldName]: value,
  //   };

  //   try {
  //     const res = await fetch(`/api/dossiers/${dossier._id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         [section]: newSectionData,
  //       }),
  //     });
  //     if (!res.ok) {
  //       console.error(`Failed to patch nested field: ${section}.${fieldName}`);
  //     }
  //   } catch (error) {
  //     console.error("Nested patch error:", error);
  //   }
  // };

  // Helper function for MaPrimeRenov badge color
  // const getMaPrimeRenovColor = (rfr: string | undefined) => {
  //   const value = parseInt(rfr || "0", 10);
  //   if (isNaN(value)) return "bg-gray-500";
  //   if (value < 50000) return "bg-green-500";
  //   else if (value < 100000) return "bg-yellow-500";
  //   else return "bg-red-500";
  // };

  const calculateMaprimeLevel = (rfr: number): string => {
    if (!rfr) return "Non défini";
    if (rfr < 20000) return "Bleu";
    if (rfr < 35000) return "Jaune";
    return "Violet";
  };
  
  const getMaprimeColor = (rfr: number): string => {
    const level = calculateMaprimeLevel(rfr);
    switch (level) {
      case "Bleu":
        return "bg-blue-100 text-blue-800";
      case "Jaune":
        return "bg-yellow-100 text-yellow-800";
      case "Violet":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  

  // Get assigned team email and matching user
  // const assignedTeamEmail = dossier.assignedTeam
  //   ? dossier.assignedTeam.split(" (")[0]
  //   : "";
  // const assignedUser = userList.find((user) => user.email === assignedTeamEmail);

  // Update assigned team via PATCH request (only needed if you still want it to happen automatically)
  // const handleAssignedTeamChange = async (val: string) => {
  //   // First, update local formData
  //   handleEditableFieldChange("assignedTeam", val);

  //   // Then, call your API to persist
  //   try {
  //     const res = await fetch(`/api/dossiers/${dossier._id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         assignedTeam: val,
  //       }),
  //     });
  //     if (!res.ok) {
  //       console.error("Failed to update assignedTeam");
  //     }
  //   } catch (error) {
  //     console.error("Error updating assignedTeam:", error);
  //   }
  // };

  // Pre-build some select options
  // const solutionOptions = [
  //   { label: "Sélectionnez une solution", value: "" },
  //   { label: "Pompes à chaleur", value: "Pompes a chaleur" },
  //   { label: "Chauffe-eau solaire individuel", value: "Chauffe-eau solaire individuel" },
  //   { label: "Chauffe-eau thermodynamique", value: "Chauffe-eau thermodynamique" },
  //   { label: "Système Solaire Combiné", value: "Système Solaire Combiné" },
  // ];

  // const etapeOptions = [
  //   { label: "1 – Prise de contact", value: "1Prise de contact" },
  //   { label: "2 – En attente des documents", value: "2En attente des documents" },
  //   { label: "3 – Instruction du dossier", value: "3Instruction du dossier" },
  //   { label: "4 – Dossier accepté", value: "4Dossier Accepter" },
  //   { label: "5 – Installation", value: "5Installation" },
  //   { label: "6 – Contrôle", value: "6Controle" },
  //   { label: "7 – Dossier clôturé", value: "7Dossier cloturer" },
  // ];

  // const assignedTeamOptions = [
  //   { label: "Sélectionnez une équipe", value: "" },
  //   ...userList.map((user) => {
  //     // Translate user.role to French if needed
  //     const roleTranslations: { [key: string]: string } = {
  //       "Sales Representative / Account Executive":
  //         "Représentant commercial / Directeur de compte",
  //       "Project / Installation Manager":
  //         "Responsable de projet / Gestionnaire d'installation",
  //       "Technician / Installer": "Technicien / Installateur",
  //       "Customer Support / Service Representative":
  //         "Support client / Représentant du service",
  //       "Client / Customer (Client Portal)":
  //         "Client / Consommateur (Portail client)",
  //       "Super Admin": "Super Admin",
  //     };
  //     const roleLabel = roleTranslations[user.role] || user.role;

  //     return {
  //       label: `${user.email} (${roleLabel})`,
  //       value: user.email,
  //     };
  //   }),
  // ];

  // Create a dictionary of English -> French translations
// const ROLE_TRANSLATIONS: Record<string, string> = {
//   "Sales Representative / Account Executive": "Représentant commercial / Directeur de compte",
//   "Project / Installation Manager": "Responsable de projet / Gestionnaire d'installation",
//   "Technician / Installer": "Technicien / Installateur",
//   "Customer Support / Service Representative": "Support client / Représentant du service",
//   "Client / Customer (Client Portal)": "Client / Consommateur (Portail client)",
//   "Super Admin": "Super Admin"
// };

// function getRoleInFrench(role: string | undefined) {
//   if (!role) return "";
//   return ROLE_TRANSLATIONS[role] ?? role; 
//   // ^ If `role` is missing in the dictionary, fallback to the original value
// }

  // For "informationLogement"
  // const typeDeLogementOptions = [
  //   { label: "Sélectionnez un type", value: "" },
  //   { label: "Maison", value: "maison" },
  //   { label: "Appartement", value: "appartement" },
  //   { label: "Autre", value: "autre" },
  // ];

  // const chauffageOptions = [
  //   { label: "Sélectionnez un type de chauffage", value: "" },
  //   { label: "Gaz", value: "gaz" },
  //   { label: "Bois", value: "bois" },
  //   { label: "Électrique", value: "electrique" },
  //   { label: "Autre", value: "autre" },
  // ];

  // const profilOptions = [
  //   { label: "Sélectionnez un profil", value: "" },
  //   { label: "Propriétaire", value: "proprietaire" },
  //   { label: "Occupant", value: "occupant" },
  //   { label: "Bailleur", value: "bailleur" },
  //   { label: "SCI", value: "SCI" },
  // ];

  // // For "informationTravaux"
  // const typeTravauxOptions = [
  //   { label: "Sélectionnez un type de travaux", value: "" },
  //   { label: "Rénovation", value: "renovation" },
  //   { label: "Extension", value: "extension" },
  //   { label: "Installation", value: "installation" },
  //   { label: "Autre", value: "autre" },
  // ];

  useEffect(() => {
    if (!dossier.contactId) return;
    if (contact && contact._id === dossier.contactId) return; 
  
    const fetchContactById = async () => {
      try {
        const res = await fetch(`/api/contacts/${dossier.contactId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch contact ${dossier.contactId}`);
        }
        const data = await res.json();
        setContact(data);
      } catch (err: unknown) {
        console.error("Error fetching contact:", err);
      }
    };
  
    fetchContactById();
  }, [dossier.contactId]);

  // Fetch the user details whenever formData.assignedTeam changes
useEffect(() => {
  if (formData.assignedTeam) {
    fetch(`/api/users?id=${formData.assignedTeam}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setAssignedUserDetails(data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setAssignedUserDetails(null);
      });
  }
}, [formData.assignedTeam]);

// Format the user details as a string (you can adjust the format as needed)
// const formattedUserDetails = assignedUserDetails
//   ? `Email: ${assignedUserDetails.email}
// Role: ${assignedUserDetails.role}
// First Name: ${assignedUserDetails.firstName}
// Last Name: ${assignedUserDetails.lastName}`
//   : "";

  useEffect(() => {
    if (formData.assignedTeam) {
      fetch(`/api/users?id=${formData.assignedTeam}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch assigned user");
          return res.json();
        })
        .then((data) => {
          setAssignedUser(data);
        })
        .catch((err) => {
          console.error("Error fetching assigned user:", err);
          setAssignedUser(null);
        });
    }
  }, [formData.assignedTeam]);

  function formatEligible(eligible: string | boolean | undefined): string {
    if (eligible === undefined) return "";
    if (typeof eligible === "boolean") {
      return eligible ? "oui" : "non";
    }
    if (typeof eligible === "string") {
      const lowerValue = eligible.toLowerCase();
      if (lowerValue === "true") return "oui";
      if (lowerValue === "false") return "non";
      return eligible;
    }
    return "";
  }

  // Function to navigate to the dynamic edit page
  const handleEditClick = () => {
    // Navigate to a dynamic route for editing (e.g., /modifier/[id])
    router.push(`/dashboard/admin/projects/modifier/${dossier._id}`);
  };
  
  
  return (
    <div className="flex gap-8">
      {/* Left Column: Main Sections */}
      <div className="flex-1 space-y-10">
        {/* "Modifier" Button on top */}
        <div className="flex justify-end">
        <Button
    onClick={handleEditClick}
    className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded"
  >
            Modifier
          </Button>
        </div>

        {/* --- Information du client --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-white rounded-2xl p-10 border border-blue-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-full w-20 h-20 mr-6 shadow-lg">
                <UserCircleIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                Information du client
              </h2>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* <EditableField
              label="Photo de profil (facultatif)"
              value={contact?.imageUrl || ""}
              onChange={() => {}}
              icon={UserCircleIcon}
              inputType="text"
              readOnly={true}
            /> */}
            <EditableField
              label="Nom"
              value={contact?.firstName || ""}
              onChange={() => {}}
              icon={UserCircleIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Prénom"
              value={contact?.lastName || ""}
              onChange={() => {}}
              icon={UserCircleIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Date de naissance"
              value={contact?.dateOfBirth || ""}
              onChange={() => {}}
              icon={CalendarIcon}
              inputType="date"
              readOnly={true}
            />
            <EditableField
              label="Adresse"
              value={contact?.mailingAddress || ""}
              onChange={() => {}}
              icon={HomeIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Téléphone"
              value={contact?.phone || ""}
              onChange={() => {}}
              icon={PhoneIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Email"
              value={contact?.email || ""}
              onChange={() => {}}
              icon={MapIcon}
              inputType="email"
              readOnly={true}
            />
            <EditableField
              label="Numéro de dossier"
              value={dossier?.numero || ""}
              onChange={() => {}}
              icon={ClipboardDocumentCheckIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Département"
              value={contact?.department || ""}
              onChange={() => {}}
              icon={HomeIcon}
              inputType="select"
              options={DEPARTMENT_OPTIONS}
              readOnly={true}
            />
            {/* <EditableField
              label="Contact ID"
              value={contact?._id || ""}
              onChange={() => {}}
              icon={IdentificationIcon}
              readOnly={true}
            /> */}
            {/* {assignedUserDetails ? (
              <UserDetailsCard user={assignedUserDetails} />
            ) : (
              <div className="border p-4 rounded-lg bg-white shadow-sm">
                <p className="text-sm text-gray-500">Aucun gestionnaire de suivi assigné</p>
              </div>
            )} */}
            {/* <EditableField
              label="Commentaires"
              value={commentData?.commentaire || ""}
              onChange={() => {}}
              icon={PencilIcon}
              inputType="textarea"
              readOnly={true}
            /> */}

          </div>
        </motion.section>

        {/* --- Information de l'habitation --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="bg-white rounded-2xl p-10 border border-green-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gradient-to-r from-green-700 to-green-500 text-white rounded-full w-20 h-20 mr-6 shadow-lg">
                <FireIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                Information de l&apos;habitation
              </h2>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EditableField
              label="Type de logement"
              value={dossier?.typeDeLogement || ""}
              onChange={() => {}}
              icon={HomeIcon}
              inputType="select"
              readOnly={true}
            />
            <EditableField
              label="Type de travaux"
              value={dossier.typeTravaux || ""}
              onChange={() => {}}
              // Use a more relevant icon:
              icon={WrenchScrewdriverIcon}
              inputType="select"
              readOnly={true}
            />
            <EditableField
              label="Profil"
              value={dossier?.profil || ""}
              onChange={() => {}}
              icon={UserCircleIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Système de chauffage"
              value={dossier?.projet || ""}
              onChange={() => {}}
              icon={FireIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Surface habitable (m²)"
              value={dossier?.surfaceChauffee || ""}
              onChange={() => {}}
              icon={HomeIcon}
              inputType="number"
              readOnly={true}
            />
            <EditableField
              label="Type de compteur électrique"
              value={dossier?.typeCompteurElectrique || ""}
              onChange={() => {}}
              icon={LightBulbIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Année de construction"
              value={dossier?.anneeConstruction || ""}
              onChange={() => {}}
              icon={CalendarIcon}
              inputType="number"
              readOnly={true}
            />
            <div className="group flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
      {MapIcon && (
        <MapIcon className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
      )}
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Projet proposé
        </label>
        {dossier?.solution ? (
          <div className="flex flex-wrap gap-2">
            {dossier.solution.split(',').map((sol, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {sol.trim()}
              </span>
            ))}
          </div>
        ) : (
          <div className="cursor-pointer truncate text-gray-900">
            <span className="text-gray-400 italic">Non défini</span>
          </div>
        )}
      </div>
    </div>
          </div>
        </motion.section>

        {/* --- Information des aides --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl p-10 border border-yellow-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gradient-to-r from-yellow-700 to-yellow-500 text-white rounded-full w-20 h-20 mr-6 shadow-lg">
                <ClipboardDocumentCheckIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                Information des aides
              </h2>
            </div>
          </div>
          {/* Aides Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <EditableField
              label="Accès Ma Prime Renov - Email"
              value={contact?.mpremail || ""}
              onChange={() => {}}
              icon={MapIcon}
              inputType="email"
              readOnly={true}
            />
            <PasswordField
              label="Accès Ma Prime Renov - Mot de passe"
              password={contact?.mprpassword || ""}
              icon={LockClosedIcon}
            />
            {/* Updated "Phase du projet" field */}
          <div className="group flex items-center gap-4 p-3 rounded-lg transition-colors bg-white shadow-sm hover:shadow-md">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-50 group-hover:bg-blue-100" />
              <CalendarIcon
                className="h-6 w-6 text-blue-600 relative z-10 flex-shrink-0"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phase du projet
              </label>
              {formData.etape ? (
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getPhaseBadgeColor(
                    formData.etape
                  )}`}
                >
                  {formatPhaseLabel(formData.etape)}
                </span>
              ) : (
                <span className="text-gray-400 italic">Non défini</span>
              )}
            </div>
          </div>
            <EditableField
              label="Nombre de personne"
              value={dossier?.nombrePersonne || ""}
              onChange={() => {}}
              icon={UserCircleIcon}
              inputType="number"
              readOnly={true}
            />
            <EditableField
              label="Numéro de dossier MPR"
              value={contact?.maprNumero || ""}
              onChange={() => {}}
              icon={ClipboardDocumentCheckIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Code postal"
              value={dossier?.codePostal || ""}
              onChange={() => {}}
              icon={HomeIcon}
              inputType="text"
              readOnly={true}
            />
            <EditableField
              label="Zone climatique"
              value={contact?.climateZone || ""}
              onChange={() => {}}
              icon={CalendarIcon}
              inputType="text"
              readOnly={true}
            />

              {/* Ma Prime Renov Couleur Field */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow border border-gray-200 flex-1">
                <PencilIcon className="h-8 w-8 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Ma Prime Renov Couleur</div>
                  <div className="flex items-center gap-3 mt-1">
                    {/* Color swatch */}
                    <div
                      className="w-10 h-10 rounded-full border border-gray-300"
                      style={{ backgroundColor: getColorHex(dossier?.mprColor) }}
                    />
                    <span className="text-gray-800 font-semibold">
                      {dossier?.mprColor ? dossier?.mprColor : "Non défini"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Eligible Field */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow border border-gray-200 flex-1">
                <IdentificationIcon className="h-8 w-8 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Éligibilité</div>
                  <div className="mt-1">
                    {contact?.eligible !== undefined ? (
                      <span
                        className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                          formatEligible(contact?.eligible).toLowerCase() === "oui"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {formatEligible(contact?.eligible).toLowerCase() === "oui"
                          ? "Eligible"
                          : "Non Eligible"}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Non défini</span>
                    )}
                  </div>
                </div>
              </div>


          </div>
        </motion.section>

        {/* Le projet */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="bg-white rounded-2xl p-10 border border-purple-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-full w-20 h-20 mr-6 shadow-lg">
                <ClipboardDocumentCheckIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                Commentaires
              </h2>
            </div>
          </div>
          {/* Projet Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CommentsSection dossier={dossier} />
          </div>
        </motion.section>

        {/* Auto-Save Status */}
        {/* <div className="text-right text-xs text-gray-500 italic">{saveStatus}</div> */}
      </div>

      {/* Right Column: Additional Info Boxes */}
      <div className="w-80 space-y-6 sticky top-10">

        {/* Infos Organisation (Assigned User) */}
        {assignedUser ? (
            <AssignedUserCard user={assignedUser} />
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <p className="text-sm text-gray-500">Aucun chargé de compte assigné</p>
            </motion.div>
          )}

        {/* Synthèse Énergétique */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-yellow-300"
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Icon Container */}
            <div className="flex items-center justify-center p-3 bg-yellow-100 rounded-full shadow-inner">
              <LightBulbIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800">Synthèse Énergétique</h3>
          </div>
          <div className="space-y-4">
            {/* Zone Climatique */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full shadow-inner">
                <SunIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Zone Climatique</p>
                <p className="font-semibold text-gray-700">{contact?.climateZone ?? "N/A"}</p>
              </div>
            </div>
            {/* Chauffage */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-full shadow-inner">
                <FireIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chauffage</p>
                <p className="font-semibold text-gray-700">{dossier?.projet ?? "N/A"}</p>
              </div>
            </div>
            {/* MaPrimeRénov */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full shadow-inner">
                <PaintBrushIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">MaPrimeRénov</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMaprimeColor(rfrValue)}`}>
                  {calculateMaprimeLevel(rfrValue)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Météo Locale */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-300 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-blue-400"
        >
          {weatherLoading ? (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="h-16 w-16 bg-gray-300 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gray-300 rounded" />
                <div className="h-6 w-20 bg-gray-300 rounded" />
              </div>
            </div>
          ) : weatherError ? (
            <div className="flex items-center gap-2 text-red-600">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <span>{weatherError}</span>
            </div>
          ) : weather ? (
            <div className="flex items-center">
              {/* Icon container */}
              <div className="flex items-center justify-center p-4 bg-blue-200 rounded-full shadow-inner">
                {weather.icon && (
                  <Image
                    src={weather.icon}
                    alt={weather.condition}
                    width={48}
                    height={48}
                    className="h-12 w-12"
                  />
                )}
              </div>
              {/* Weather details */}
              <div className="ml-5">
                <h3 className="text-2xl font-extrabold text-blue-800">Météo Locale</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-900">
                    {weather.temp}°C
                  </span>
                  <span className="text-xl text-blue-700 capitalize">
                    {weather.condition}
                  </span>
                </div>
                <p className="mt-1 text-sm text-blue-700">
                  {contact?.department
                    ? `Département ${contact.department}`
                    : "Localisation inconnue"}
                </p>
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Heure Locale */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-green-100 to-green-50 border border-green-300 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-green-400"
        >
          <div className="flex items-center">
            {/* Icon container */}
            <div className="flex items-center justify-center p-4 bg-green-200 rounded-full shadow-inner">
              <ClockIcon className="h-12 w-12 text-green-700" />
            </div>
            {/* Textual info */}
            <div className="ml-5">
              <h3 className="text-2xl font-extrabold text-green-800">Heure Locale</h3>
              <p className="mt-2 text-4xl font-bold text-green-900">
                {new Date().toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default InfoTab;
