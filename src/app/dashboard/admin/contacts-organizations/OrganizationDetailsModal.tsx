// OrganizationDetailsModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PencilIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { SunIcon, ClockIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
// Replace these imports with your actual modals for organization if available.
import { OrganizationActionsModal } from "./OrganizationActionsModal";
import { EditOrganizationModal } from "./EditOrganizationModal"; // Uncomment if available

// A simple inline editable field component
const EditableField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  return (
    <div className="group flex items-center gap-2 hover:bg-gray-100 p-1 rounded">
      <span className="w-40 font-medium">{label} :</span>
      {editing ? (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onChange(tempValue);
          }}
          className="border p-1 rounded flex-1"
          autoFocus
        />
      ) : (
        <span onClick={() => setEditing(true)} className="flex-1 cursor-pointer">
          {value || <em className="text-gray-400">Non défini</em>}
        </span>
      )}
      {!editing && (
        <PencilIcon
          className="h-4 w-4 text-gray-400 cursor-pointer hidden group-hover:block"
          onClick={() => setEditing(true)}
        />
      )}
    </div>
  );
};

// Accordion section component for grouping details
const AccordionSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-2 flex justify-between items-center"
      >
        <span className="font-semibold">{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sample data for Activities tab (adjust as needed)
const upcomingActivitiesData = [
  { type: "Tâche", activityName: "Appel de suivi", assignedTo: "Alice", dateDue: "2023-08-15" },
  { type: "Événement", activityName: "Réunion client", assignedTo: "Bob", dateDue: "2023-08-20" },
];

const pastActivitiesData = [
  { type: "Tâche", activityName: "Envoyer devis", assignedTo: "Charlie", dateDue: "2023-07-10" },
  { type: "Événement", activityName: "Présentation", assignedTo: "Dana", dateDue: "2023-07-05" },
];

interface Organization {
  id: number;
  name: string;
  phone: string;
  billingStreet: string;
  billingCity: string;
  email?: string;
  description?: string;
  tags?: string[];
  suivi: boolean;
  // Add other fields as needed.
}

interface OrganizationDetailsModalProps {
  organization: Organization | null;
  onClose: () => void;
  toggleFollowLocal: (id: number) => void;
}

export const OrganizationDetailsModal: React.FC<OrganizationDetailsModalProps> = ({
  organization,
  onClose,
  toggleFollowLocal,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [followed, setFollowed] = useState(organization?.suivi || false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Uncomment if you have an edit modal

  const handleEditClick = () => {
    console.log("Ouvrir modal d'édition pour l'organisation", organization?.id);
    setShowEditModal(true);
  };

  const handleActionsClick = () => {
    console.log("Ouvrir modal d'actions pour l'organisation", organization?.id);
    setShowActionsModal(true);
  };

  if (!organization) return null;

  const handleToggleFollow = () => {
    setFollowed(!followed);
    toggleFollowLocal(organization.id);
  };

  const updateOrganizationField = async (field: string, value: string | number) => {
    // Create an updated organization object (for updating only the specific field)
    // Here, we only send the field that changed.
    try {
      const res = await fetch(`/api/organizations/${organization.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed:", data);
      } else {
        console.log("Update successful:", data);
      }
    } catch (err) {
      console.error("Error updating organization", err);
    }
  };
  

  return (
    <>
      <AnimatePresence>
        {organization && (
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
                    {organization.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold">{organization.name}</h2>
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
                    value={String(organization.id)}
                    onChange={(val) => console.log(updateOrganizationField("id", val), "Modifier Record ID", val)}
                  />
                  <EditableField
                    label="Nom"
                    value={organization.name}
                    onChange={(val) => console.log(updateOrganizationField("name", val), "Modifier Nom", val)}
                  />
                  <EditableField
                    label="Téléphone"
                    value={organization.phone}
                    onChange={(val) => console.log(updateOrganizationField("phone", val), "Modifier Téléphone", val)}
                  />
                </div>
                <div>
                  <EditableField
                    label="Email"
                    value={organization.email || ""}
                    onChange={(val) => console.log(updateOrganizationField("email", val), "Modifier Email", val)}
                  />
                  <EditableField
                    label="Adresse de facturation"
                    value={organization.billingStreet}
                    onChange={(val) => console.log(updateOrganizationField("billingStreet", val), "Modifier Adresse de facturation", val)}
                  />
                  <EditableField
                    label="Ville de facturation"
                    value={organization.billingCity}
                    onChange={(val) => console.log(updateOrganizationField("billingCity", val), "Modifier Ville de facturation", val)}
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
                    <AccordionSection title="Informations de base">
                      <EditableField
                        label="Record ID"
                        value={String(organization.id)}
                        onChange={(val) => console.log(updateOrganizationField("id", val), "Modifier Record ID", val)}
                      />
                      <EditableField
                        label="Nom"
                        value={organization.name}
                        onChange={(val) => console.log(updateOrganizationField("name", val), "Modifier Nom", val)}
                      />
                      <EditableField
                        label="Téléphone"
                        value={organization.phone}
                        onChange={(val) => console.log(updateOrganizationField("phone", val), "Modifier Téléphone", val)}
                      />
                    </AccordionSection>
                    <AccordionSection title="Détails de l'organisation">
                      <EditableField
                        label="Email"
                        value={organization.email || "Non défini"}
                        onChange={(val) => console.log(updateOrganizationField("email", val), "Modifier Email", val)}
                      />
                      <EditableField
                        label="Adresse de facturation"
                        value={organization.billingStreet}
                        onChange={(val) => console.log(updateOrganizationField("billingStreet", val), "Modifier Adresse de facturation", val)}
                      />
                      <EditableField
                        label="Ville de facturation"
                        value={organization.billingCity}
                        onChange={(val) => console.log(updateOrganizationField("billingCity", val), "Modifier Ville de facturation", val)}
                      />
                    </AccordionSection>
                    <AccordionSection title="Informations complémentaires">
                      <EditableField
                        label="Description"
                        value={organization.description || "Non défini"}
                        onChange={(val) => console.log(updateOrganizationField("description", val), "Modifier Description", val)}
                      />
                      <EditableField
                        label="Liste d'étiquettes"
                        value={(organization.tags || []).join(", ")}
                        onChange={(val) => console.log(updateOrganizationField("tags", val), "Modifier Liste d'étiquettes", val)}
                      />
                    </AccordionSection>
                  </div>
                  {/* Right Column: Additional Info Boxes */}
                  <div className="w-80 space-y-6">
                    {/* Météo locale */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-4 p-4 border rounded-lg shadow-lg bg-gradient-to-r from-blue-100 to-blue-50 transition-all duration-200"
                    >
                      <SunIcon className="h-10 w-10 text-yellow-500" />
                      <div>
                        <h3 className="font-semibold text-blue-800 text-lg">Météo locale</h3>
                        <p className="text-sm text-blue-900">Ensoleillé, 25°C</p>
                      </div>
                    </motion.div>
                    {/* Heure locale */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-4 p-4 border rounded-lg shadow-lg bg-gradient-to-r from-green-100 to-green-50 transition-all duration-200"
                    >
                      <ClockIcon className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800 text-lg">Heure locale</h3>
                        <p className="text-sm text-green-900">14:30</p>
                      </div>
                    </motion.div>
                    {/* Opportunités gagnées */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-4 p-4 border rounded-lg shadow-lg bg-gradient-to-r from-yellow-100 to-yellow-50 transition-all duration-200"
                    >
                      <StarIconSolid className="h-10 w-10 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-yellow-800 text-lg">Opportunités gagnées</h3>
                        <p className="text-sm text-yellow-900">3</p>
                      </div>
                    </motion.div>
                    {/* Infos Organisation */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-4 p-4 border rounded-lg shadow-lg bg-gradient-to-r from-gray-100 to-gray-50 transition-all duration-200"
                    >
                      <BuildingOffice2Icon className="h-10 w-10 text-gray-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">Infos Organisation</h3>
                        <p className="text-sm text-gray-900">
                          {organization.name}
                          <br />
                          Téléphone: {organization.phone}
                          <br />
                          Adresse: {organization.billingStreet}, {organization.billingCity}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              {activeTab === "related" && (
                <div className="space-y-6">
                  <AccordionSection title="Organisations liées">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Nom</th>
                          <th className="px-2 py-1 text-left">Rôle</th>
                          <th className="px-2 py-1 text-left">Détails</th>
                          <th className="px-2 py-1 text-left">Lien créé</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-1">Org A</td>
                          <td className="px-2 py-1">Manager</td>
                          <td className="px-2 py-1">Leading organization</td>
                          <td className="px-2 py-1">2023-01-01</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">Org B</td>
                          <td className="px-2 py-1">Employee</td>
                          <td className="px-2 py-1">Secondary organization</td>
                          <td className="px-2 py-1">2023-02-10</td>
                        </tr>
                      </tbody>
                    </table>
                  </AccordionSection>
                  <AccordionSection title="Opportunités">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Nom</th>
                          <th className="px-2 py-1 text-left">Rôle</th>
                          <th className="px-2 py-1 text-left">Détails</th>
                          <th className="px-2 py-1 text-left">Lien créé</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-1">Opportunity X</td>
                          <td className="px-2 py-1">Key Opportunity</td>
                          <td className="px-2 py-1">Details about Opportunity X</td>
                          <td className="px-2 py-1">2023-03-01</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">Opportunity Y</td>
                          <td className="px-2 py-1">Potential</td>
                          <td className="px-2 py-1">Details about Opportunity Y</td>
                          <td className="px-2 py-1">2023-03-15</td>
                        </tr>
                      </tbody>
                    </table>
                  </AccordionSection>
                  <AccordionSection title="Projets">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Nom</th>
                          <th className="px-2 py-1 text-left">Rôle</th>
                          <th className="px-2 py-1 text-left">Détails</th>
                          <th className="px-2 py-1 text-left">Lien créé</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-1">Project Alpha</td>
                          <td className="px-2 py-1">Lead Project</td>
                          <td className="px-2 py-1">Important project</td>
                          <td className="px-2 py-1">2023-04-01</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">Project Beta</td>
                          <td className="px-2 py-1">Support</td>
                          <td className="px-2 py-1">Secondary project</td>
                          <td className="px-2 py-1">2023-04-20</td>
                        </tr>
                      </tbody>
                    </table>
                  </AccordionSection>
                  <AccordionSection title="Contacts liés">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Nom</th>
                          <th className="px-2 py-1 text-left">Rôle</th>
                          <th className="px-2 py-1 text-left">Détails</th>
                          <th className="px-2 py-1 text-left">Lien créé</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-1">Contact One</td>
                          <td className="px-2 py-1">Client</td>
                          <td className="px-2 py-1">Important client</td>
                          <td className="px-2 py-1">2023-05-01</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">Contact Two</td>
                          <td className="px-2 py-1">Prospect</td>
                          <td className="px-2 py-1">New prospect</td>
                          <td className="px-2 py-1">2023-05-10</td>
                        </tr>
                      </tbody>
                    </table>
                  </AccordionSection>
                  <AccordionSection title="Notes">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Nom</th>
                          <th className="px-2 py-1 text-left">Rôle</th>
                          <th className="px-2 py-1 text-left">Détails</th>
                          <th className="px-2 py-1 text-left">Lien créé</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-1">Note 1</td>
                          <td className="px-2 py-1">Interne</td>
                          <td className="px-2 py-1">Follow up</td>
                          <td className="px-2 py-1">2023-06-01</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">Note 2</td>
                          <td className="px-2 py-1">Externe</td>
                          <td className="px-2 py-1">Call scheduled</td>
                          <td className="px-2 py-1">2023-06-05</td>
                        </tr>
                      </tbody>
                    </table>
                  </AccordionSection>
                  <AccordionSection title="Fichiers">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Nom</th>
                          <th className="px-2 py-1 text-left">Rôle</th>
                          <th className="px-2 py-1 text-left">Détails</th>
                          <th className="px-2 py-1 text-left">Lien créé</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-1">File A</td>
                          <td className="px-2 py-1">Document</td>
                          <td className="px-2 py-1">Contract</td>
                          <td className="px-2 py-1">2023-07-01</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">File B</td>
                          <td className="px-2 py-1">Image</td>
                          <td className="px-2 py-1">Profile picture</td>
                          <td className="px-2 py-1">2023-07-10</td>
                        </tr>
                      </tbody>
                    </table>
                  </AccordionSection>
                </div>
              )}
              {activeTab === "activity" && (
                <div className="space-y-6">
                  <AccordionSection title="Activités à venir">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Type</th>
                          <th className="px-2 py-1 text-left">Nom de l&apos;activité</th>
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
                  <AccordionSection title="Activités passées">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Type</th>
                          <th className="px-2 py-1 text-left">Nom de l&apos;activité</th>
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

      {/* Conditionally render the Organization Actions Modal */}
      {showActionsModal && (
        <OrganizationActionsModal
          organization={organization}
          onClose={() => setShowActionsModal(false)}
        />
      )}
      {/* Uncomment and adjust if you have an edit modal for organizations */}
      {showEditModal && (
        <EditOrganizationModal
          organization={organization}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};
