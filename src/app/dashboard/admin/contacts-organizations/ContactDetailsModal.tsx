// ContactDetailsModal.tsx
"use client";

import React, { useState } from "react";
import { CurrencyEuroIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import RelatedTab from "./RelatedTab";
import {
  PencilIcon,
  StarIcon as StarIconOutline,
  MapPinIcon,
  UserCircleIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  BellSlashIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  LightBulbIcon,
  GlobeEuropeAfricaIcon,
  HomeIcon,
  PhoneIcon,
  UserIcon,
  HomeModernIcon,
  DevicePhoneMobileIcon,
  PhoneArrowUpRightIcon,
  FireIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import {
  SunIcon,
  ClockIcon,
  BuildingOffice2Icon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
// Import the shared Contact type from ContactActionsModal
import { Contact, ContactActionsModal } from "./ContactActionsModal";
import { EditContactModal } from "./EditContactModal";

// Change EditableFieldProps so that the value can be string | number | boolean.
interface EditableFieldProps {
  label: string;
  value: string | number | boolean;
  onChange: (val: string) => void;
  icon?: React.ElementType;
  inputType?: string; // e.g. "text", "number", "select"
  options?: string[]; // For select inputs
  readOnly?: boolean;
}

// Updated EditableField with better visual feedback.
const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  icon: Icon,
  inputType = "text",
  options,
  readOnly = false,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value));

  // If the field is read-only, do not allow editing.
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
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => {
                setEditing(false);
                onChange(tempValue);
              }}
              autoFocus
              className="w-full border-b-2 border-blue-500 focus:outline-none bg-transparent py-1"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
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

// Enhanced AccordionSection with better interaction.
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

// Sample data for Activities tab.
const upcomingActivitiesData = [
  { type: "Tâche", activityName: "Appel de suivi", assignedTo: "Alice", dateDue: "2023-08-15" },
  { type: "Événement", activityName: "Réunion client", assignedTo: "Bob", dateDue: "2023-08-20" },
];

const pastActivitiesData = [
  { type: "Tâche", activityName: "Envoyer devis", assignedTo: "Charlie", dateDue: "2023-07-10" },
  { type: "Événement", activityName: "Présentation", assignedTo: "Dana", dateDue: "2023-07-05" },
];

interface ContactDetailsModalProps {
  contact: Contact | null;
  onClose: () => void;
  toggleFollowLocal: (id: number) => void;
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

  const handleEditClick = () => {
    console.log("Ouvrir modal d'édition pour le contact", contact?.id);
    setShowEditModal(true);
  };

  const handleActionsClick = () => {
    console.log("Ouvrir modal d'actions pour le contact", contact?.id);
    setShowActionsModal(true);
  };

  if (!contact) return null;

  const handleToggleFollow = () => {
    setFollowed((prev) => !prev);
    toggleFollowLocal(contact.id);
  };

  const handleSaveEdit = (updatedContact: Contact) => {
    console.log("Contact mis à jour:", updatedContact);
  };

  const updateContactField = async (field: string, value: string | boolean) => {
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed", data);
      } else {
        console.log("Update successful", data);
      }
    } catch (err) {
      console.error("Error updating contact", err);
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
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-6xl font-bold">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold">{contact.name}</h2>
                    <button
                      onClick={handleToggleFollow}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-500"
                    >
                      {followed ? (
                        <StarIconSolid className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <StarIconOutline className="h-6 w-6 text-gray-400" />
                      )}
                      {followed ? "Suivi" : "Suivre"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleEditClick}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <PencilIcon className="h-8 w-8 text-gray-600" />
                  </button>
                  <button
                    onClick={handleActionsClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Actions
                  </button>
                </div>
              </div>

              {/* Summary Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <EditableField
                    label="Record ID"
                    value={String(contact.id)}
                    onChange={(val) =>
                      console.log(updateContactField("id", val), "Modifier Record ID", val)
                    }
                  />
                  <EditableField
                    label="Nom"
                    value={contact.name}
                    onChange={(val) =>
                      console.log(updateContactField("name", val), "Modifier Nom", val)
                    }
                  />
                  <EditableField
                    label="Organisation"
                    value={contact.organization ?? ""}
                    onChange={(val) =>
                      console.log(updateContactField("organization", val), "Modifier Organisation", val)
                    }
                  />
                  <EditableField
                    label="Titre"
                    value={contact.titre ?? ""}
                    onChange={(val) =>
                      console.log(updateContactField("titre", val), "Modifier Titre", val)
                    }
                  />
                </div>
                <div>
                  <EditableField
                    label="Téléphone"
                    value={contact.phone ?? ""}
                    onChange={(val) =>
                      console.log(updateContactField("phone", val), "Modifier Téléphone", val)
                    }
                  />
                  <EditableField
                    label="Email"
                    value={contact.email ?? ""}
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
                        value={String(contact.id)}
                        onChange={(val) => updateContactField("id", val)}
                        icon={IdentificationIcon}
                      />
                      <EditableField
                        label="Nom"
                        value={contact.name}
                        onChange={(val) => updateContactField("name", val)}
                        icon={UserIcon}
                      />
                      <EditableField
                        label="Organisation"
                        value={contact.organization ?? ""}
                        onChange={(val) => updateContactField("organization", val)}
                        icon={BuildingOfficeIcon}
                      />
                      <EditableField
                        label="Titre"
                        value={contact.titre ?? ""}
                        onChange={(val) => updateContactField("titre", val)}
                        icon={BriefcaseIcon}
                      />
                    </AccordionSection>

                    <AccordionSection title="Coordonnées" icon={PhoneIcon}>
                      <div className="grid grid-cols-2 gap-4">
                        <EditableField
                          label="Email"
                          value={contact.email ?? ""}
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
                              checked={!!contact.emailOptedOut}
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
                        value={contact.department ?? ""}
                        onChange={(val) => {
                          updateContactField("department", val);
                          updateContactField("climateZone", getClimateZone(val));
                        }}
                        icon={GlobeEuropeAfricaIcon}
                        inputType="select"
                        options={["75", "77", "78", "91", "92", "93", "94", "95"]}
                      />
                      <EditableField
                        label="Adresse principale"
                        value={contact.mailingAddress ?? "Non défini"}
                        onChange={(val) => updateContactField("mailingAddress", val)}
                        icon={HomeIcon}
                      />
                      <EditableField
                        label="Autre adresse"
                        value={contact.otherAddress ?? "Non défini"}
                        onChange={(val) => updateContactField("otherAddress", val)}
                        icon={HomeModernIcon}
                      />
                    </AccordionSection>

                    <AccordionSection title="Informations Énergétiques" icon={LightBulbIcon}>
                      <div className="grid grid-cols-2 gap-4">
                        <EditableField
                          label="Revenu Fiscal de Référence"
                          value={contact.rfr ?? ""}
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
                          value={contact.climateZone ?? "Non défini"}
                          onChange={(val) => updateContactField("climateZone", val)}
                          icon={SunIcon}
                          readOnly
                        />

                        <EditableField
                          label="Type de Chauffage"
                          value={contact.heatingType ?? "Non défini"}
                          onChange={(val) => updateContactField("heatingType", val)}
                          icon={FireIcon}
                          inputType="select"
                          options={["Gaz", "Électrique", "Fioul", "Bois", "Pompe à chaleur"]}
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
                        <SunIcon className="h-12 w-12 text-yellow-500" />
                        <div>
                          <h3 className="font-semibold text-blue-800 text-lg">Météo Locale</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-900">25°C</span>
                            <span className="text-sm text-blue-800">Ensoleillé</span>
                          </div>
                          <p className="text-sm text-blue-800 mt-1">
                            Département {contact.department}
                          </p>
                        </div>
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

      {/* Render the Contact Actions Modal */}
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
