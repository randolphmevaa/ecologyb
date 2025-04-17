"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

// Define the Organization interface (extend as needed)
export interface Organization {
  id: number;
  name: string;
  phone: string;
  billingStreet: string;
  billingCity: string;
  email?: string;
  description?: string;
  tags?: string[];
  suivi: boolean;
  // Add any additional fields you require
}

interface EditOrganizationModalProps {
  organization: Organization;
  onClose: () => void;
  onSave?: (updatedOrganization: Organization) => void; // now optional
}

// Reusable collapsible section component (accordion), open by default.
const SectionDeroulante: React.FC<{ titre: string; children: React.ReactNode }> = ({
  titre,
  children,
}) => {
  const [ouvert, setOuvert] = useState(true);
  return (
    <div className="border-b pb-4 mb-4">
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full flex justify-between items-center text-left text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors"
      >
        <span>{titre}</span>
        {ouvert ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>
      {ouvert && <div className="mt-3">{children}</div>}
    </div>
  );
};

export function EditOrganizationModal({
  organization,
  onClose,
  onSave,
}: EditOrganizationModalProps) {
  // State for "Informations de base"
  const [name, setName] = useState(organization.name || "");
  const [phone, setPhone] = useState(organization.phone || "");
  const [billingStreet, setBillingStreet] = useState(organization.billingStreet || "");
  const [billingCity, setBillingCity] = useState(organization.billingCity || "");

  // State for "Détails de l'organisation"
  const [email, setEmail] = useState(organization.email || "");

  // State for "Informations de description"
  const [description, setDescription] = useState(organization.description || "");

  // State for "Informations sur les étiquettes" (tags)
  const [tags, setTags] = useState(organization.tags ? organization.tags.join(", ") : "");

  // Loading state while saving
  const [isLoading, setIsLoading] = useState(false);

  // Simple function to update one field of the organization
  const updateOrganizationField = async (field: string, value: string | boolean | string[]) => {
    try {
      const res = await fetch(`/api/organizations/${organization.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }), // update only the changed field
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed", data);
      } else {
        console.log("Update successful", data);
      }
    } catch (err) {
      console.error("Error updating organization", err);
    }
  };

  // Updated handleSave: update each field separately and show a loading indicator
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateOrganizationField("name", name);
      await updateOrganizationField("phone", phone);
      await updateOrganizationField("billingStreet", billingStreet);
      await updateOrganizationField("billingCity", billingCity);
      await updateOrganizationField("email", email);
      await updateOrganizationField("description", description);
      await updateOrganizationField("tags", tags.split(",").map((t) => t.trim()).filter(Boolean));

      // Update the parent state with the fully updated organization, if onSave is provided
      onSave?.({
        ...organization,
        name,
        phone,
        billingStreet,
        billingCity,
        email,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
    } catch (error) {
      console.error("Error in handleSave", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl p-8 w-11/12 max-w-3xl max-h-[95vh] overflow-y-auto"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Modifier l&apos;organisation</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors">
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          {/* Form Sections */}
          <div className="space-y-8">
            {/* Section: Informations de base */}
            <SectionDeroulante titre="Informations de base">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Entrez le nom de l'organisation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Numéro de téléphone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse de facturation</label>
                  <input
                    type="text"
                    value={billingStreet}
                    onChange={(e) => setBillingStreet(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Adresse de facturation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville de facturation</label>
                  <input
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ville de facturation"
                  />
                </div>
              </div>
            </SectionDeroulante>
            {/* Section: Détails de l'organisation */}
            <SectionDeroulante titre="Détails de l'organisation">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="exemple@domaine.com"
                  />
                </div>
              </div>
            </SectionDeroulante>
            {/* Section: Informations de description */}
            <SectionDeroulante titre="Informations de description">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Décrivez l'organisation"
                />
              </div>
            </SectionDeroulante>
            {/* Section: Informations sur les étiquettes */}
            <SectionDeroulante titre="Informations sur les étiquettes">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Étiquettes (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="exemple: client, prospect, VIP"
                />
              </div>
            </SectionDeroulante>
          </div>
          {/* Modal Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Enregistrer"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
