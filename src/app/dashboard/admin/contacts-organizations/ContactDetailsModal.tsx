// ContactDetailsModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronDownIcon, CurrencyEuroIcon, SparklesIcon, XMarkIcon,
  PencilIcon, StarIcon as StarIconOutline, MapPinIcon, UserCircleIcon,
  IdentificationIcon, BuildingOfficeIcon, BellSlashIcon, EnvelopeIcon,
  BriefcaseIcon, LightBulbIcon, GlobeEuropeAfricaIcon, HomeIcon, PhoneIcon,
  UserIcon, HomeModernIcon, DevicePhoneMobileIcon, PhoneArrowUpRightIcon,
  FireIcon, PaintBrushIcon
} from "@heroicons/react/24/outline";
import { 
  SunIcon, ClockIcon, BuildingOffice2Icon, StarIcon as StarIconSolid 
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import RelatedTab from "./RelatedTab";
import { Contact, ContactActionsModal } from "./ContactActionsModal";
import { EditContactModal } from "./EditContactModal";
import { ExclamationTriangleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

// Import (or define) the helper function to safely get the contact’s name.
import { getContactName } from "./ContactTable";
// If not available, you can uncomment the following local definition:
// const getContactName = (contact: any): string => {
//   if (contact.name) return contact.name;
//   if (contact.firstName || contact.lastName)
//     return `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim();
//   return "Unknown";
// };

interface EditableFieldProps {
  label: string;
  value: string | number | boolean;
  onChange: (val: string) => void;
  icon?: React.ElementType;
  inputType?: string; // e.g. "text", "number", "select"
  readOnly?: boolean;
  options?: Array<{ label: string; value: string }>;
  onAddNew?: () => void; // For "add new" functionality
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
  const [tempValue, setTempValue] = useState(String(value));

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
                className="w-full border-b-2 border-blue-500 focus:outline-none bg-transparent py-1 pr-8 appearance-none"
              >
                <option value="" disabled>Sélectionner une organisation</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                <option 
                  value="__add_new__" 
                  className="bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100"
                >
                  + Créer une nouvelle organisation
                </option>
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
          <div onClick={handleClick} className="cursor-pointer truncate text-gray-900">
            {value !== undefined && value !== null
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

const AccordionSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-3 px-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-500" />}
          <span className="font-semibold text-gray-700">{title}</span>
        </div>
        <motion.span animate={{ rotate: open ? 0 : 180 }} className="text-gray-500">
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const upcomingActivitiesData = [
  { type: "Tâche", activityName: "Appel de suivi", assignedTo: "Alice", dateDue: "2023-08-15" },
  { type: "Événement", activityName: "Réunion client", assignedTo: "Bob", dateDue: "2023-08-20" },
];

const pastActivitiesData = [
  { type: "Tâche", activityName: "Envoyer devis", assignedTo: "Charlie", dateDue: "2023-07-10" },
  { type: "Événement", activityName: "Présentation", assignedTo: "Dana", dateDue: "2023-07-05" },
];

// ===========================
// Updated Props Interface:
// - The toggleFollowLocal prop now expects a string parameter.
interface ContactDetailsModalProps {
  contact: Contact | null;
  onClose: () => void;
  toggleFollowLocal: (id: string) => void;
}

export const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
  contact,
  onClose,
  toggleFollowLocal,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [followed, setFollowed] = useState<boolean>(contact?.suivi ?? false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [localContact, setLocalContact] = useState<Contact>(contact!);
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    icon: string;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<{ name: string }[]>([]);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  const handleEditClick = () => {
    console.log("Ouvrir modal d'édition pour le contact", contact?.id);
    setShowEditModal(true);
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
    61: { label: "Pluie légère", icon: "/weather-icons/61.svg" },
    63: { label: "Pluie modérée", icon: "/weather-icons/61.svg" },
    65: { label: "Pluie forte", icon: "/weather-icons/61.svg" },
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

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations");
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  // const handleAddOrganization = async () => {
  //   if (!newOrgName.trim()) return;

  //   try {
  //     // Add new organization to the database
  //     const response = await fetch("/api/organizations", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify([{ name: newOrgName }]),
  //     });

  //     if (response.ok) {
  //       // Update local state
  //       setOrganizations([...organizations, { name: newOrgName }]);
  //       // Update contact's organization
  //       updateContactField("organization", newOrgName);
  //       setShowOrgForm(false);
  //       setNewOrgName("");
  //     }
  //   } catch (error) {
  //     console.error("Error adding organization:", error);
  //   }
  // };

  const organizationOptions = organizations.map(org => ({
    label: org.name,
    value: org.name
  }));

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) return;

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ name: newOrgName.trim() }]),
      });

      if (response.ok) {
        const newOrg = { name: newOrgName.trim() };
        setOrganizations(prev => [...prev, newOrg]);
        updateContactField("organization", newOrg.name);
        setShowOrgForm(false);
        setNewOrgName("");
      }
    } catch (error) {
      console.error("Erreur de création:", error);
    }
  };

  const handleActionsClick = () => {
    console.log("Ouvrir modal d'actions pour le contact", contact?.id);
    setShowActionsModal(true);
  };

  if (!contact) return null;

  // Updated follow toggle: now calls the passed toggleFollowLocal (which expects a string)
  const handleToggleFollow = () => {
    toggleFollowLocal(String(contact.id));
    setFollowed((prev) => !prev);
  };

  const handleSaveEdit = (updatedContact: Contact) => {
    console.log("Contact mis à jour:", updatedContact);
  };

  const updateContactField = async (field: string, value: string | boolean) => {
    // Update the local state first:
    setLocalContact((prevContact) => ({
      ...prevContact,
      [field]: value,
    }));
  
    try {
      const res = await fetch(`/api/contacts/${localContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed", data);
        // Optionally revert the local state if needed
      } else {
        console.log("Update successful", data);
      }
    } catch (err) {
      console.error("Error updating contact", err);
      // Optionally revert the local state if needed
    }
  };

  // Helper functions.
  const getClimateZone = (department: string): string => {
    const zones: { [key: string]: string } = {
      "75": "H1",
      "77": "H2",
      "78": "H2",
      "91": "H1",
      "92": "H1",
      "93": "H1",
      "94": "H1",
      "95": "H1",
    };
    return zones[department] || "H3";
  };

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

  return (
    <>
      <AnimatePresence>
        {contact && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-7xl max-h-[95vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-6 mb-6 border-b border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-8 ring-blue-50/80 bg-gradient-to-br from-blue-100 to-white">
                      {contact.imageUrl ? (
                        <Image
                          src={contact.imageUrl}
                          alt={getContactName(contact)}
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center h-full w-full text-5xl font-bold">
                          {getContactName(contact).charAt(0)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleToggleFollow}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-md transition-all"
                    >
                      {followed ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <StarIconOutline className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-semibold text-gray-700">
                        {followed ? "Suivi" : "Suivre"}
                      </span>
                    </button>
                  </div>

                  <div className="pt-2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      {getContactName(contact)}
                      <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Contact Actif
                      </span>
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">
                          {contact.organization || "Aucune organisation"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-rose-600" />
                        <span className="text-sm font-medium">
                          {contact.department ? `Département ${contact.department}` : "Localisation inconnue"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleEditClick}
                    className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors group relative"
                    title="Modifier le contact"
                  >
                    <PencilIcon className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Modifier
                    </span>
                  </button>
                  <button
                    onClick={handleActionsClick}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group"
                  >
                    <SparklesIcon className="h-5 w-5 text-white/90" />
                    <span className="font-semibold text-sm">Actions</span>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Actions disponibles
                    </span>
                  </button>
                </div>
              </div>

              {/* Summary Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                    <EditableField
                        label="Record ID"
                        value={localContact.id}
                        onChange={(val) =>
                        console.log(updateContactField("id", val), "Modifier Record ID", val)
                        }
                    />
                    <EditableField
                        label="Nom"
                        value={localContact.name}
                        onChange={(val) =>
                        console.log(updateContactField("name", val), "Modifier Nom", val)
                        }
                    />
                    {/* Dans l'onglet Détails */}
                    <AccordionSection title="Informations Générales" icon={UserCircleIcon}>
                        <EditableField
                        label="Organisation"
                        value={localContact.organization ?? ""}
                        onChange={(val) => updateContactField("organization", val)}
                        icon={BuildingOfficeIcon}
                        inputType="select"
                        options={organizationOptions}
                        onAddNew={() => setShowOrgForm(true)}
                        />
                        {/* ... autres champs */}
                    </AccordionSection>

                    {/* Modal de création d'organisation */}
                    <AnimatePresence>
                        {showOrgForm && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                Nouvelle Organisation
                                </h2>
                                <button
                                onClick={() => setShowOrgForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <EditableField
                                label="Nom de l'organisation"
                                value={newOrgName}
                                onChange={setNewOrgName}
                                inputType="text"
                                icon={BuildingOffice2Icon}
                                />

                                <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowOrgForm(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleCreateOrganization}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <PlusCircleIcon className="h-5 w-5" />
                                    Créer l&apos;organisation
                                </button>
                                </div>
                            </div>
                            </motion.div>
                        </motion.div>
                        )}
                    </AnimatePresence>

                    <EditableField
                        label="Titre"
                        value={localContact.titre ?? ""}
                        onChange={(val) =>
                        console.log(updateContactField("titre", val), "Modifier Titre", val)
                        }
                    />
                    </div>
                    <div>
                    <EditableField
                        label="Téléphone"
                        value={localContact.phone ?? ""}
                        onChange={(val) =>
                        console.log(updateContactField("phone", val), "Modifier Téléphone", val)
                        }
                    />
                    <EditableField
                        label="Email"
                        value={localContact.email ?? ""}
                        onChange={(val) =>
                        console.log(updateContactField("email", val), "Modifier Email", val)
                        }
                    />
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b mb-4">
                    <nav className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`py-2 px-4 text-sm font-medium ${
                        activeTab === "details"
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500 hover:text-blue-500"
                        }`}
                    >
                        Détails
                    </button>
                    <button
                        onClick={() => setActiveTab("related")}
                        className={`py-2 px-4 text-sm font-medium ${
                        activeTab === "related"
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500 hover:text-blue-500"
                        }`}
                    >
                        Liés
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`py-2 px-4 text-sm font-medium ${
                        activeTab === "activity"
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500 hover:text-blue-500"
                        }`}
                    >
                        Activité
                    </button>
                    </nav>
                </div>

                {activeTab === "details" && (
                    <div className="flex gap-6">
                    {/* Left Column: Accordions */}
                    <div className="flex-1 space-y-4">
                        <AccordionSection title="Nom et Occupation" icon={UserCircleIcon}>
                        <EditableField
                            label="Record ID"
                            value={String(localContact.id)}
                            onChange={(val) => updateContactField("id", val)}
                            icon={IdentificationIcon}
                        />
                        <EditableField
                            label="Nom"
                            value={localContact.name}
                            onChange={(val) => updateContactField("name", val)}
                            icon={UserIcon}
                        />
                        <AccordionSection title="Informations Générales" icon={UserCircleIcon}>
                            <EditableField
                            label="Organisation"
                            value={localContact.organization ?? ""}
                            onChange={(val) => updateContactField("organization", val)}
                            icon={BuildingOfficeIcon}
                            inputType="select"
                            options={organizationOptions}
                            onAddNew={() => setShowOrgForm(true)}
                            />
                            {/* ... autres champs */}
                        </AccordionSection>

                        {/* Modal de création d'organisation */}
                        <AnimatePresence>
                            {showOrgForm && (
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                    Nouvelle Organisation
                                    </h2>
                                    <button
                                    onClick={() => setShowOrgForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                    <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <EditableField
                                    label="Nom de l'organisation"
                                    value={newOrgName}
                                    onChange={setNewOrgName}
                                    inputType="text"
                                    icon={BuildingOffice2Icon}
                                    />

                                    <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setShowOrgForm(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleCreateOrganization}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <PlusCircleIcon className="h-5 w-5" />
                                        Créer l&apos;organisation
                                    </button>
                                    </div>
                                </div>
                                </motion.div>
                            </motion.div>
                            )}
                        </AnimatePresence>

                        <EditableField
                            label="Titre"
                            value={localContact.titre ?? ""}
                            onChange={(val) => updateContactField("titre", val)}
                            icon={BriefcaseIcon}
                        />
                        </AccordionSection>

                        <AccordionSection title="Coordonnées" icon={PhoneIcon}>
                        <div className="grid grid-cols-2 gap-4">
                            <EditableField
                            label="Email"
                            value={localContact.email ?? ""}
                            onChange={(val) => updateContactField("email", val)}
                            icon={EnvelopeIcon}
                            />
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                            <BellSlashIcon className="h-5 w-5 text-gray-400" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                Email désinscrit
                                </label>
                                <input
                                type="checkbox"
                                checked={!!localContact.emailOptedOut}
                                onChange={(e) =>
                                    updateContactField("emailOptedOut", e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600"
                                />
                            </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                            { label: "Téléphone", field: "phone", icon: PhoneIcon },
                            { label: "Téléphone fixe", field: "homePhone", icon: HomeModernIcon },
                            { label: "Téléphone mobile", field: "mobilePhone", icon: DevicePhoneMobileIcon },
                            { label: "Autre téléphone", field: "otherPhone", icon: PhoneArrowUpRightIcon },
                            ].map(({ label, field, icon }) => {
                            // Get the raw value from contact.
                            const rawValue = contact[field as keyof Contact];
                            // If the value is an array, join it into a string.
                            const value =
                                Array.isArray(rawValue) ? rawValue.join(", ") : (rawValue ?? "");
                            return (
                                <EditableField
                                key={field}
                                label={label}
                                value={value}
                                onChange={(val) => updateContactField(field, val)}
                                icon={icon}
                                />
                            );
                            })}
                        </div>
                        </AccordionSection>

                        <AccordionSection title="Localisation" icon={MapPinIcon}>
                        <EditableField
                            label="Département"
                            value={localContact.department ?? ""}
                            onChange={(val) => {
                            updateContactField("department", val);
                            updateContactField("climateZone", getClimateZone(val));
                            }}
                            icon={GlobeEuropeAfricaIcon}
                            inputType="select"
                            options={[ { label: "75", value: "75" },
                            { label: "77", value: "77" },
                            { label: "78", value: "78" },
                            { label: "91", value: "91" },
                            { label: "92", value: "92" },
                            { label: "93", value: "93" },
                            { label: "94", value: "94" },
                            { label: "95", value: "95" },
                            { label: "75", value: "75" }]}
                        />
                        <EditableField
                            label="Adresse principale"
                            value={localContact.mailingAddress ?? "Non défini"}
                            onChange={(val) => updateContactField("mailingAddress", val)}
                            icon={HomeIcon}
                        />
                        <EditableField
                            label="Autre adresse"
                            value={localContact.otherAddress ?? "Non défini"}
                            onChange={(val) => updateContactField("otherAddress", val)}
                            icon={HomeModernIcon}
                        />
                        </AccordionSection>

                        <AccordionSection title="Informations Énergétiques" icon={LightBulbIcon}>
                        <div className="grid grid-cols-2 gap-4">
                            <EditableField
                            label="Revenu Fiscal de Référence"
                            value={localContact.rfr ?? ""}
                            onChange={(val) => updateContactField("rfr", val)}
                            icon={CurrencyEuroIcon}
                            inputType="number"
                            />

                            <div className="col-span-2">
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                <PaintBrushIcon className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    MaPrimeRénov
                                </label>
                                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getMaprimeColor(contact.rfr ?? 0)}`}>
                                    {calculateMaprimeLevel(contact.rfr ?? 0)}
                                </div>
                                </div>
                            </div>
                            </div>

                            <EditableField
                            label="Zone Climatique"
                            value={localContact.climateZone ?? "Non défini"}
                            onChange={(val) => updateContactField("climateZone", val)}
                            icon={SunIcon}
                            readOnly
                            />

                            <EditableField
                            label="Type de Chauffage"
                            value={localContact.heatingType ?? "Non défini"}
                            onChange={(val) => updateContactField("heatingType", val)}
                            icon={FireIcon}
                            inputType="select"
                            options={[{ label: "Gaz", value: "Gaz" }, { label: "Électrique", value: "Électrique" }, { label: "Pompe à chaleur", value: "Pompe à chaleur" }, { label: "Bois", value: "Bois" }, { label: "Fioul", value: "Fioul" }]}
                            />
                        </div>
                        </AccordionSection>
                    </div>

                    {/* Right Column: Additional Info Boxes */}
                    <div className="w-80 space-y-6">
                        <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4"
                        >
                        <div className="flex items-center gap-4">
                            <ClockIcon className="h-12 w-12 text-green-600" />
                            <div>
                            <h3 className="font-semibold text-green-800 text-lg">Heure Locale</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-green-900">
                                {new Date().toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                </span>
                            </div>
                            </div>
                        </div>
                        </motion.div>

                        <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                        >
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <BuildingOffice2Icon className="h-6 w-6 text-gray-600" />
                            Infos Organisation
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm">
                            <span className="font-medium">Nom:</span>{" "}
                            {contact.organization ?? "N/A"}
                            </p>
                            <p className="text-sm">
                            <span className="font-medium">Téléphone:</span>{" "}
                            {contact.organizationPhone || "N/A"}
                            </p>
                            <p className="text-sm">
                            <span className="font-medium">Adresse:</span>{" "}
                            {contact.organizationAddress || "N/A"}
                            </p>
                        </div>
                        </motion.div>

                        <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                        >
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <LightBulbIcon className="h-6 w-6 text-yellow-500" />
                            Synthèse Énergétique
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                            <SunIcon className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-500">Zone Climatique</p>
                                <p className="font-medium">{contact.climateZone ?? "N/A"}</p>
                            </div>
                            </div>
                            <div className="flex items-center gap-3">
                            <FireIcon className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500">Chauffage</p>
                                <p className="font-medium">{contact.heatingType ?? "N/A"}</p>
                            </div>
                            </div>
                            <div className="flex items-center gap-3">
                            <PaintBrushIcon className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm text-gray-500">MaPrimeRénov</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaprimeColor(contact.rfr ?? 0)}`}>
                                {calculateMaprimeLevel(contact.rfr ?? 0)}
                                </span>
                            </div>
                            </div>
                        </div>
                        </motion.div>

                        <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
    >
    <div className="flex items-center gap-4">
        {weatherLoading ? (
        <div className="animate-pulse flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
            <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
        </div>
        ) : weatherError ? (
        <div className="text-red-500 text-sm flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            {weatherError}
        </div>
        ) : weather ? (
        <>
            {weather.icon && (
            <Image
                src={weather.icon}
                alt={weather.condition}
                className="h-12 w-12"
            />
            )}
            <div>
            <h3 className="font-semibold text-blue-800 text-lg">Météo Locale</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-900">
                {weather.temp}°C
                </span>
                <span className="text-sm text-blue-800 capitalize">
                {weather.condition}
                </span>
            </div>
            <p className="text-sm text-blue-800 mt-1">
                {contact.department ? 
                `Département ${contact.department}` : 
                "Localisation inconnue"}
            </p>
            </div>
        </>
        ) : null}
    </div>
    </motion.div>
                    </div>
                    </div>
                )}

                {activeTab === "related" && <RelatedTab contactId={String(contact.id)} />}

                {activeTab === "activity" && (
                    <div className="space-y-6">
                    <AccordionSection title="Projets à venir/ en cours">
                        <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                            <th className="px-2 py-1 text-left">Type</th>
                            <th className="px-2 py-1 text-left">Nom du projet</th>
                            <th className="px-2 py-1 text-left">Assigné à</th>
                            <th className="px-2 py-1 text-left">Date d&apos;échéance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingActivitiesData.map((act, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="px-2 py-1">{act.type}</td>
                                <td className="px-2 py-1">{act.activityName}</td>
                                <td className="px-2 py-1">{act.assignedTo}</td>
                                <td className="px-2 py-1">{act.dateDue}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </AccordionSection>
                    <AccordionSection title="Projets passés">
                        <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                            <th className="px-2 py-1 text-left">Type</th>
                            <th className="px-2 py-1 text-left">Nom du projet</th>
                            <th className="px-2 py-1 text-left">Assigné à</th>
                            <th className="px-2 py-1 text-left">Date d&apos;échéance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastActivitiesData.map((act, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="px-2 py-1">{act.type}</td>
                                <td className="px-2 py-1">{act.activityName}</td>
                                <td className="px-2 py-1">{act.assignedTo}</td>
                                <td className="px-2 py-1">{act.dateDue}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </AccordionSection>
                    </div>
                )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showActionsModal && (
        <ContactActionsModal contact={contact} onClose={() => setShowActionsModal(false)} />
      )}
      {showEditModal && (
        <EditContactModal
          contact={contact}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};
