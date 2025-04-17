"use client";

import React, { useEffect, useState } from "react";
import {CameraIcon} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  HomeIcon,
  ClockIcon,
  UserCircleIcon,
  LightBulbIcon,
  SunIcon,
  FireIcon,
  PaintBrushIcon,
  ExclamationTriangleIcon,
  CurrencyEuroIcon,
  ChevronDownIcon,
  CalendarIcon,
  PhoneIcon,
  MapIcon,
  // IdentificationIcon,
  PencilIcon,
  LockClosedIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  // ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
// import CommentsSection from "./CommentsSection";
// import { Button } from "@/components/ui/Button";
// import { useRouter } from "next/navigation";

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
  nombrePersonne?: string;
  codePostal?: string;
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

interface User {
  gender?: string; // Now optional
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

{/* Enhanced EditableField with Map Hover for Address */}
interface EditableFieldWithMapProps {
  label: string;
  value: string | undefined | null;
  onChange: (value: string) => void;
  icon?: React.ElementType;
  inputType?: string;
  readOnly?: boolean;
  mapAddress?: boolean;
}

const EditableFieldWithMap: React.FC<EditableFieldWithMapProps> = ({
  label,
  value,
  onChange,
  icon: Icon,
  inputType = "text",
  readOnly = true,
  mapAddress
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value ?? ""));
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleClick = () => {
    if (!readOnly) {
      setEditing(true);
    }
  };

  // Reset mapLoaded state when showMap changes
  useEffect(() => {
    if (!showMap) {
      setMapLoaded(false);
    }
  }, [showMap]);

  return (
    <div 
      className="group relative flex items-center gap-3 hover:bg-blue-50 p-2 rounded-lg transition-colors"
      onMouseEnter={() => mapAddress && setShowMap(true)}
      onMouseLeave={() => setShowMap(false)}
    >
      {Icon && (
        <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
      )}
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
        {editing && !readOnly ? (
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

      {/* Map Popup on Hover */}
      {showMap && value && (
        <div className="absolute z-50 top-full mt-2 left-0 w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center text-gray-500 text-xs z-10">
              Chargement de la carte...
            </div>
          )}
          <iframe 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(value)}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-64 border-none" 
            allowFullScreen
            loading="lazy"
            title="Carte d'adresse"
            onLoad={() => setMapLoaded(true)}
          />
          <div className="absolute top-2 right-2 rounded-full bg-white w-6 h-6 flex items-center justify-center shadow-md cursor-pointer" onClick={() => setShowMap(false)}>
            <XCircleIcon className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  );
};

const AssignedUserCard: React.FC<AssignedUserCardProps> = ({ user }) => {
  // Set the banner image based on the user's gender
  const bannerImage =
    user.gender === "Homme"
      ? "https://www.advancia-teleservices.com/wp-content/uploads/2023/11/Centre-dappels-tunisie.jpg"
      : "https://www.hotesse-interim.fr/ressources/images/ab4fec7ce0ed.jpg";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="max-w-xl w-full bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-100/40"
    >
      {/* Enhanced Top Banner */}
      <div className="relative w-full h-40 group">
        <Image
          src={bannerImage}
          alt="Banner image"
          fill
          priority
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        {/* Improved Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white group-hover:scale-105" />
      </div>

      {/* User Info Section */}
      <div className="p-6 space-y-6">
        {/* Title & Role */}
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Chargé de compte
          </h3>
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-sm font-medium backdrop-blur-sm border border-emerald-200/50">
            {getRoleInFrench(user.role)}
          </span>
        </div>

        {/* Enhanced Info Items */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="text-base font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="p-2 bg-green-100 rounded-lg">
              <PhoneIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="text-base font-medium text-gray-900">
                {user.phone || "Non disponible"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="p-2 bg-purple-100 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-900 truncate">
                {user.email || "Non renseigné"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
  // const router = useRouter();
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

// Instead of naming your state 'dossier', we rename it to 'dossierState'
const [dossierState, setDossierState] = useState<Partial<Dossier>>({
  nombrePersonne: "",
  codePostal: "",
  mprColor: "",
  // You may add other defaults or leave them undefined if you use Partial<Dossier>
});

// Merge API dossier into local state on mount/update
useEffect(() => {
  if (dossier) {
    setDossierState({
      ...dossier,
      // Ensure these fields are strings (or empty if missing)
      nombrePersonne: dossier.nombrePersonne ?? "",
      codePostal: dossier.codePostal ?? "",
      mprColor: dossier.mprColor ?? "",
    });
  }
}, [dossier]);

// Helper function to calculate the MPR color
const calculateMprColor = (
  rfrStr: string,
  nombrePersonneStr: string,
  department: string
): string => {
  const rfr = parseFloat(rfrStr);
  const persons = parseInt(nombrePersonneStr, 10);
  if (isNaN(rfr) || isNaN(persons)) return "";

  const ileDeFranceDepartments = ["91", "92", "93", "94", "95", "75", "77", "78"];
  const isIDF = ileDeFranceDepartments.includes(department);

  let thresholds: [number, number, number];

  if (isIDF) {
    const thresholdsMap: Record<number, [number, number, number]> = {
      1: [23768, 28933, 40404],
      2: [34884, 42463, 59394],
      3: [41893, 51000, 71060],
      4: [48914, 59549, 83637],
      5: [55961, 68123, 95758],
    };
    if (persons <= 5) {
      thresholds = thresholdsMap[persons];
    } else {
      const extra = persons - 5;
      const base = thresholdsMap[5];
      thresholds = [
        base[0] + extra * 7038,
        base[1] + extra * 8568,
        base[2] + extra * 12122,
      ];
    }
  } else {
    const thresholdsMap: Record<number, [number, number, number]> = {
      1: [17173, 22015, 30844],
      2: [25115, 32197, 45340],
      3: [30206, 38719, 54592],
      4: [35285, 45234, 63844],
      5: [40388, 51775, 73098],
    };
    if (persons <= 5) {
      thresholds = thresholdsMap[persons];
    } else {
      const extra = persons - 5;
      const base = thresholdsMap[5];
      thresholds = [
        base[0] + extra * 5094,
        base[1] + extra * 6525,
        base[2] + extra * 9524,
      ];
    }
  }

  if (rfr <= thresholds[0]) return "Bleu";
  else if (rfr <= thresholds[1]) return "Jaune";
  else if (rfr <= thresholds[2]) return "Violet";
  else return "Rose";
};

// const getMPRLevelIndex = (color?: string): number => {
//   const order = ['Bleu', 'Jaune', 'Violet', 'Rose'];
//   return color ? order.indexOf(color) + 1 : 0;
// };

const getColorHex = (mprColor: string | undefined): string => {
  switch (mprColor) {
    case "Bleu": return "#007AFF";
    case "Jaune": return "#FFCC00";
    case "Violet": return "#5856D6";
    case "Rose": return "#FF2D55";
    default: return "#E5E5EA";
  }
};

// Recalculate and update mprColor whenever contact.rfr, nombrePersonne, or codePostal change
useEffect(() => {
  // Only run calculation if required fields are available.
  if (dossierState.nombrePersonne && dossierState.codePostal) {
    const codePostal: string = dossierState.codePostal;
    const department: string = codePostal.slice(0, 2);
    const rfrValue: string = contact?.rfr ?? "";
    const nombrePersonneValue: string = dossierState.nombrePersonne;
    
    const color: string = calculateMprColor(rfrValue, nombrePersonneValue, department);
    
    setDossierState((prev: Partial<Dossier>) => ({
      ...prev,
      mprColor: color,
    }));
  }
}, [contact?.rfr, dossierState.nombrePersonne, dossierState.codePostal]);


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
  // const handleEditClick = () => {
  //   // Navigate to a dynamic route for editing (e.g., /modifier/[id])
  //   router.push(`/dashboard/admin/projects/modifier/${dossier._id}`);
  // };

  return (
    <div className="flex gap-8">
      {/* Left Column: Main Sections */}
      <div className="flex-1 space-y-10">
        {/* "Modifier" Button on top */}
        {/* <div className="flex justify-end">
        <Button
          onClick={handleEditClick}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded"
        >
            Modifier
          </Button>
        </div> */}

        {/* --- Information du client (IMPROVED) --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-100"
        >
          {/* Enhanced Header with Background */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-10 py-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-16 -mt-20 opacity-30" />
            <div className="absolute bottom-0 right-24 w-32 h-32 bg-blue-300 rounded-full -mb-10 opacity-20" />
            
            <div className="flex items-center relative z-10">
              <div className="flex items-center justify-center bg-white text-blue-600 rounded-full w-20 h-20 mr-6 shadow-xl">
                <UserCircleIcon className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white">
                  Information du client
                </h2>
                <p className="text-blue-100 mt-1">Détails personnels et coordonnées</p>
              </div>
            </div>
          </div>

          {/* Client Card */}
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                {contact?.firstName?.charAt(0) || "?"}{contact?.lastName?.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {contact?.firstName || "Prénom"} {contact?.lastName || "Nom"}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4" /> 
                  <span>{contact?.phone || "Téléphone non renseigné"}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <EnvelopeIcon className="h-4 w-4" /> 
                  <span>{contact?.email || "Email non renseigné"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields - Enhanced Layout */}
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Group 1: Personal Info */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">
                  Informations personnelles
                </h4>
                
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
              </div>
              
              {/* Group 2: Contact Info */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">
                  Coordonnées
                </h4>
                
                <EditableFieldWithMap
                  label="Adresse"
                  value={contact?.mailingAddress || ""}
                  onChange={() => {}}
                  icon={HomeIcon}
                  inputType="text"
                  readOnly={true}
                  mapAddress={true}
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
                  icon={EnvelopeIcon}
                  inputType="email"
                  readOnly={true}
                />
              </div>
            </div>
            
            {/* Administrative Info */}
            <div className="mt-10">
              <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">
                Informations administratives
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  icon={MapIcon}
                  inputType="select"
                  options={DEPARTMENT_OPTIONS}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- Information de l'habitation (IMPROVED) --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 mt-10"
        >
          {/* Enhanced Header with Background */}
          <div className="relative bg-gradient-to-r from-green-600 to-green-400 px-10 py-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-16 -mt-20 opacity-30" />
            <div className="absolute bottom-0 right-24 w-32 h-32 bg-green-300 rounded-full -mb-10 opacity-20" />
            
            <div className="flex items-center relative z-10">
              <div className="flex items-center justify-center bg-white text-green-600 rounded-full w-20 h-20 mr-6 shadow-xl">
                <HomeIcon className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white">
                  Information de l&apos;habitation
                </h2>
                <p className="text-green-100 mt-1">Caractéristiques et spécifications du logement</p>
              </div>
            </div>
          </div>

          {/* Property Summary Card */}
          <div className="p-6 bg-green-50 border-b border-green-100">
            <div className="flex flex-wrap items-center gap-8">
              {/* Type */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                  <HomeIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type de logement</p>
                  <p className="font-semibold text-gray-900">{dossier?.typeDeLogement || "Non défini"}</p>
                </div>
              </div>
              
              {/* Construction Year */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Année de construction</p>
                  <p className="font-semibold text-gray-900">{dossier?.anneeConstruction || "Non défini"}</p>
                </div>
              </div>
              
              {/* Surface */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                  <span className="text-sm font-bold">m²</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Surface</p>
                  <p className="font-semibold text-gray-900">{dossier?.surfaceChauffee || "0"} m²</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields - Enhanced Layout */}
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Group 1: Property Details */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4 border-b pb-2">
                  Caractéristiques du logement
                </h4>
                
                <EditableField
                  label="Type de logement"
                  value={dossier?.typeDeLogement || ""}
                  onChange={() => {}}
                  icon={HomeIcon}
                  inputType="select"
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
                  label="Année de construction"
                  value={dossier?.anneeConstruction || ""}
                  onChange={() => {}}
                  icon={CalendarIcon}
                  inputType="number"
                  readOnly={true}
                />
              </div>
              
              {/* Group 2: Technical Details */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4 border-b pb-2">
                  Caractéristiques techniques
                </h4>
                
                <EditableField
                  label="Système de chauffage"
                  value={dossier?.informationLogement?.systemeChauffage || ""}
                  onChange={() => {}}
                  icon={FireIcon}
                  inputType="text"
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
              </div>
            </div>
            
            {/* Project Info */}
            <div className="mt-10">
              <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4 border-b pb-2">
                Projet et travaux
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <EditableField
                  label="Type de travaux"
                  value={dossier.typeTravaux || ""}
                  onChange={() => {}}
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
              </div>
              
              {/* Project Solutions */}
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    <LightBulbIcon className="h-5 w-5" />
                  </div>
                  <h5 className="text-lg font-semibold text-gray-900">Solutions proposées</h5>
                </div>
                
                {dossier?.solution ? (
                  <div className="flex flex-wrap gap-3">
                    {dossier.solution.split(',').map((sol, index) => (
                      <div key={index} className="bg-white border border-green-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-800 font-medium">{sol.trim()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500 italic">
                    Aucune solution proposée pour le moment
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- Information des aides (IMPROVED) --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-yellow-100 mt-10"
        >
          {/* Enhanced Header with Background */}
          <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-400 px-10 py-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full -mr-16 -mt-20 opacity-30" />
            <div className="absolute bottom-0 right-24 w-32 h-32 bg-yellow-300 rounded-full -mb-10 opacity-20" />
            
            <div className="flex items-center relative z-10">
              <div className="flex items-center justify-center bg-white text-yellow-600 rounded-full w-20 h-20 mr-6 shadow-xl">
                <ClipboardDocumentCheckIcon className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white">
                  Information des aides
                </h2>
                <p className="text-yellow-100 mt-1">Éligibilité et aides financières disponibles</p>
              </div>
            </div>
          </div>

          {/* MaPrimeRénov Banner */}
          <div className="p-6 bg-yellow-50 border-b border-yellow-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image 
                  src="/Group 9.svg"
                  alt="MaPrimeRénov' Logo"
                  width={40}
                  height={40}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">MaPrimeRénov&apos;</h3>
                  <p className="text-sm text-gray-600">Programme national d&apos;aide à la rénovation énergétique</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg shadow-inner" style={{ 
                  backgroundColor: dossierState?.mprColor ? getColorHex(dossierState.mprColor) : '#f3f4f6',
                  borderColor: dossierState?.mprColor ? `${getColorHex(dossierState.mprColor)}30` : '#e5e7eb'
                }}>
                  {!dossierState?.mprColor && (
                    <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400 m-auto" />
                  )}
                </div>
                <div>
                  <span className="text-xs text-gray-500">Niveau</span>
                  <p className="font-semibold text-gray-900">{dossierState?.mprColor || "Non défini"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields - Enhanced Layout */}
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left column: 7 columns wide */}
              <div className="md:col-span-7 space-y-10">
                {/* Credentials Group */}
                <div>
                  <h4 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-4 border-b pb-2">
                    Accès au compte MaPrimeRénov&apos;
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableField
                      label="Accès Ma Prime Renov - Email"
                      value={contact?.mpremail || ""}
                      onChange={() => {}}
                      icon={EnvelopeIcon}
                      inputType="email"
                      readOnly={true}
                    />
                    
                    <PasswordField
                      label="Accès Ma Prime Renov - Mot de passe"
                      password={contact?.mprpassword || ""}
                      icon={LockClosedIcon}
                    />
                  </div>
                </div>
                
                {/* Administrative Info Group */}
                <div>
                  <h4 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-4 border-b pb-2">
                    Informations administratives
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableField
                      label="Numéro de dossier MPR"
                      value={contact?.maprNumero || ""}
                      onChange={() => {}}
                      icon={ClipboardDocumentCheckIcon}
                      inputType="text"
                      readOnly={true}
                    />
                    
                    <EditableField
                      label="Nombre de personne"
                      value={dossier?.nombrePersonne || ""}
                      onChange={() => {}}
                      icon={UserCircleIcon}
                      inputType="number"
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
                      icon={SunIcon}
                      inputType="text"
                      readOnly={true}
                    />
                  </div>
                </div>
                
                {/* Project Phase */}
                <div>
                  <h4 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-4 border-b pb-2">
                    Statut du projet
                  </h4>
                  
                  <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-50" />
                        <CalendarIcon className="h-6 w-6 text-blue-600 relative z-10 flex-shrink-0" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900">Phase actuelle</h5>
                    </div>
                    
                    {formData.etape ? (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${parseInt(formData.etape.split(' ')[0]) * 14}%` }}></div>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getPhaseBadgeColor(formData.etape)}`}>
                          {formatPhaseLabel(formData.etape)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Non défini</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right column: 5 columns wide */}
              <div className="md:col-span-5">
                {/* Financial Information */}
                <div className="sticky top-4">
                  <h4 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-4 border-b pb-2">
                    Informations financières
                  </h4>
                  
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* RFR Card */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Revenu Fiscal de Référence
                          </p>
                          <div className="mt-1 flex items-baseline">
                            <h5 className="text-2xl font-bold text-gray-900">{contact?.rfr ? new Intl.NumberFormat('fr-FR').format(parseInt(contact.rfr)) : "0"} €</h5>
                          </div>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <CurrencyEuroIcon className="h-5 w-5 text-yellow-700" />
                        </div>
                      </div>
                    </div>
                    
                    {/* MPR Color Level Visualization */}
                    <div className="p-5 bg-gray-50">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Niveau MaPrimeRénov&apos;
                      </p>
                      
                      <div className="flex space-x-2">
                        {["Bleu", "Jaune", "Violet", "Rose"].map((color) => (
                          <div key={color} className="flex-1">
                            <div 
                              className={`h-8 rounded-md w-full ${
                                dossierState?.mprColor === color 
                                ? `ring-2 ring-offset-2 ring-${color === 'Bleu' ? 'blue' : color === 'Jaune' ? 'yellow' : color === 'Violet' ? 'purple' : 'pink'}-500` 
                                : ''
                              }`}
                              style={{ 
                                backgroundColor: getColorHex(color)
                              }}
                            />
                            <p className="text-xs mt-1 text-center text-gray-600">{color}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Eligibility Status */}
                    <div className="p-5 border-t border-gray-100">
                      <div className="group relative bg-white rounded-xl p-4 transition-all">
                        <div className="relative z-10 flex items-center gap-5">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-inner">
                            <Image 
                              src="/Group 9.svg"
                              alt="MaPrimeRénov' Logo"
                              width={24}
                              height={24}
                              className="w-6 h-6"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                              Éligibilité MaPrimeRénov&apos;
                            </div>
                            
                            {contact?.eligible !== undefined ? (
                              <div className="flex items-center gap-3">
                                <motion.div 
                                  initial={{ scale: 0.9 }}
                                  animate={{ scale: 1 }}
                                  className={`relative p-2 rounded-full ${
                                    formatEligible(contact.eligible) === "oui" 
                                      ? "bg-green-50" 
                                      : "bg-red-50"
                                  }`}
                                >
                                  {formatEligible(contact.eligible) === "oui" ? (
                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                  ) : (
                                    <XCircleIcon className="h-6 w-6 text-red-600" />
                                  )}
                                  <div className="absolute inset-0 animate-pulse rounded-full border-2 opacity-50" />
                                </motion.div>
                                
                                <div className="space-y-1">
                                  <span className={`text-xl font-semibold ${
                                    formatEligible(contact.eligible) === "oui"
                                      ? "text-green-700"
                                      : "text-red-700"
                                  }`}>
                                    {formatEligible(contact.eligible) === "oui" ? "Éligible" : "Non éligible"}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-gray-100">
                                  <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500" />
                                </div>
                                <span className="text-xl font-semibold text-gray-600">Statut inconnu</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* iMessage-style Comments Section */}
        {/* Replace the entire Comments Section with: */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100 mt-10"
        >
          {/* Enhanced Header with Background */}
          <div className="relative bg-gradient-to-r from-purple-600 to-purple-400 px-10 py-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full -mr-16 -mt-20 opacity-30" />
            <div className="absolute bottom-0 right-24 w-32 h-32 bg-purple-300 rounded-full -mb-10 opacity-20" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-white text-purple-600 rounded-full w-20 h-20 mr-6 shadow-xl">
                  <ClipboardDocumentCheckIcon className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-white">
                    Commentaires
                  </h2>
                  <p className="text-purple-100 mt-1">Suivi et historique des interactions</p>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-white text-purple-700 rounded-lg shadow-md hover:bg-purple-50 transition-colors flex items-center gap-2">
                <PencilIcon className="h-4 w-4" />
                <span>Nouveau commentaire</span>
              </button>
            </div>
          </div>

          {/* iMessage-like Comments Section */}
          <div className="p-6 bg-gray-50">
            {/* Comment Timeline Header */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative flex items-center">
                <div className="h-px w-16 bg-gray-300"></div>
                <div className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                  Historique des commentaires
                </div>
                <div className="h-px w-16 bg-gray-300"></div>
              </div>
            </div>

            {/* Comments Timeline */}
            <div className="flex flex-col space-y-6 px-4 max-w-4xl mx-auto">
              {/* Date Separator */}
              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  15 mars 2025
                </div>
              </div>

              {/* Comment 1 */}
              <div className="flex flex-col max-w-3xl mx-auto w-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                    SM
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-gray-900">Sophie Martin</h5>
                      <span className="text-xs text-gray-500 font-medium px-2 py-0.5 rounded-full bg-blue-50">Chargée de clientèle</span>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <p className="text-gray-700">Premier contact téléphonique effectué. Le client est très intéressé par l&apos;installation d&apos;une pompe à chaleur air/eau. Il souhaite recevoir un devis détaillé incluant les aides MaPrimeRénov&apos; dont il pourrait bénéficier.</p>
                    </div>
                    
                    <div className="flex items-center mt-1.5 ml-1">
                      <span className="text-xs text-gray-500">15:32</span>
                      <div className="ml-3 flex items-center gap-1.5">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Premier contact</span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Pompe à chaleur</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="flex flex-col max-w-3xl mx-auto w-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold flex-shrink-0">
                    TD
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-gray-900">Thomas Dupont</h5>
                      <span className="text-xs text-gray-500 font-medium px-2 py-0.5 rounded-full bg-green-50">Conseiller technique</span>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <p className="text-gray-700">Visite technique réalisée. La maison est compatible pour l&apos;installation d&apos;une PAC air/eau. Situation optimale pour les unités extérieures côté jardin. Diagnostic de performance énergétique à jour. Client prêt à démarrer les travaux dès l&apos;acceptation du dossier MaPrimeRénov&apos;.</p>
                    </div>
                    
                    <div className="flex items-center mt-1.5 ml-1">
                      <span className="text-xs text-gray-500">17:45</span>
                      <div className="ml-3 flex items-center gap-1.5">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Visite technique</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Installation validée</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Separator */}
              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  20 mars 2025
                </div>
              </div>

              {/* Comment 3 */}
              <div className="flex flex-col max-w-3xl mx-auto w-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold flex-shrink-0">
                    LD
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-gray-900">Lucie Durand</h5>
                      <span className="text-xs text-gray-500 font-medium px-2 py-0.5 rounded-full bg-red-50">Responsable administrative</span>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <p className="text-gray-700">Dossier MaPrimeRénov&apos; déposé. Tous les documents ont été validés et transmis. Le client a fourni l&apos;ensemble des pièces justificatives nécessaires dans les délais. En attente de confirmation d&apos;éligibilité de l&apos;ANAH. Rappel programmé dans 10 jours pour suivi.</p>
                    </div>
                    
                    <div className="flex items-center mt-1.5 ml-1">
                      <span className="text-xs text-gray-500">10:15</span>
                      <div className="ml-3 flex items-center gap-1.5">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Administratif</span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Dossier déposé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* iMessage-style Comment Form */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
                  {/* Current user initials */}
                  ME
                </div>
                
                <div className="flex-1 relative">
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <CameraIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <textarea 
                    className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 pr-20 min-h-[120px] focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-colors"
                    placeholder="Ajouter un commentaire..."
                    rows={3}
                  ></textarea>
                </div>
                
                <button className="h-12 w-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-md transition-colors">
                  <PaperAirplaneIcon className="h-6 w-6 text-white -rotate-45" />
                </button>
              </div>
              
              <div className="flex justify-end mt-2">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold">Conseils :</span> Ajoutez des notes sur les interactions, les demandes ou les préférences du client
                </div>
              </div>
            </div>
          </div>
        </motion.section>

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
                <p className="font-semibold text-gray-700">{dossier?.informationLogement?.systemeChauffage ?? "N/A"}</p>
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
          whileHover={{ scale: 1.005 }}
          className="relative bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-8 shadow-2xl overflow-hidden transition-all duration-300 group"
        >
          {/* Background texture */}
          <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
          
          {/* Animated highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {weatherLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="h-12 w-12 bg-white/20 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-white/20 rounded-full animate-pulse" />
              <div className="h-4 w-48 bg-white/20 rounded-full animate-pulse" />
            </div>
          ) : weatherError ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-red-100">
              <ExclamationTriangleIcon className="h-12 w-12" />
              <p className="text-lg font-semibold">{weatherError}</p>
            </div>
          ) : weather ? (
            <div className="relative z-10 space-y-6 text-white">
              {/* Location */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">
                  {contact?.department ? `Département ${contact.department}` : "Localisation"}
                </h3>
                <span className="text-sm opacity-80">
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Main weather data */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-6xl font-extrabold tracking-tighter">
                    {weather.temp}°
                  </span>
                  <p className="text-xl font-medium capitalize opacity-90">
                    {weather.condition}
                  </p>
                </div>

                {/* Weather icon with floating effect */}
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative w-24 h-24"
                >
                  {weather.icon && (
                    <Image
                      src={weather.icon}
                      alt={weather.condition}
                      fill
                      className="drop-shadow-weather"
                    />
                  )}
                </motion.div>
              </div>

              {/* Additional details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-sm opacity-75">Ressenti</p>
                  <p className="text-lg font-semibold">{weather.temp}°</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm opacity-75">Vent</p>
                  <p className="text-lg font-semibold">10 km/h</p>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Heure Locale */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="relative bg-gradient-to-br from-indigo-600 to-blue-800 rounded-2xl p-8 shadow-2xl overflow-hidden transition-all duration-300 group"
        >
          {/* Background texture */}
          <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
          
          {/* Animated highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10 flex items-center justify-between text-white">
            {/* Time display */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-widest uppercase opacity-75">
                Heure Locale
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight tabular-nums">
                  {new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-lg font-medium opacity-80">
                  {new Date().toLocaleTimeString("fr-FR", {
                    second: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-lg font-medium opacity-90">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>

            {/* Animated clock icon */}
            <motion.div 
              className="flex items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-sm"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <ClockIcon className="h-12 w-12 text-white/90" />
            </motion.div>
          </div>

          {/* Second indicator */}
          <div className="absolute bottom-6 right-6">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default InfoTab;
