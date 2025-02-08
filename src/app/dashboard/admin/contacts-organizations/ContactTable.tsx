"use client";

import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  ArrowPathIcon,
  Bars3Icon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  StarIcon as StarIconOutline,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { ContactDetailsModal } from "./ContactDetailsModal";
import { Contact, ContactActionsModal } from "./ContactActionsModal";
import { AddContactModal } from "./AddContactModal"; // adjust the import path as needed

// A simple fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper functions to normalize the contact data
export function getContactName(contact: Contact): string {
  // If a full name is provided, use it; otherwise, combine firstName and lastName.
  if (contact.name) return contact.name;
  if (contact.firstName || contact.lastName)
    return `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim();
  return "Unknown";
}

function getContactTitle(contact: Contact): string {
  // Use 'titre' if available; otherwise fallback to 'role'
  return contact.titre ?? contact.role ?? "";
}

export default function ContactTable() {
  // Using SWR to fetch contacts; note that contacts may have id as number or string.
  const { data: contacts, error, mutate } = useSWR<Contact[]>("/api/contacts", fetcher, {
    fallbackData: [],
  });
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("all");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedActionsContact, setSelectedActionsContact] = useState<Contact | null>(null);

  // Multiple row selection state (using string IDs)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Follow status for each contact (using string IDs as keys)
  const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (contacts) {
      const initialStatus: { [key: string]: boolean } = {};
      contacts.forEach((contact) => {
        // Default to false if 'suivi' is not provided
        initialStatus[String(contact.id)] = contact.suivi ?? false;
      });
      setFollowStatus(initialStatus);
    }
  }, [contacts]);

  // Filter contacts by search text using the normalized name
  const filteredContacts = (contacts || []).filter((contact) =>
    getContactName(contact).toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Header checkbox ref to control the "indeterminate" state
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        selectedRows.size > 0 && selectedRows.size < filteredContacts.length;
    }
  }, [selectedRows, filteredContacts]);

  // Toggle selection of a single row (using string IDs)
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Toggle selection for all visible rows
  const toggleAllRows = () => {
    if (selectedRows.size === filteredContacts.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredContacts.map((contact) => String(contact.id))));
    }
  };

  const refreshContacts = async () => {
    console.log("Refreshing contacts...");
    await mutate(); // Trigger SWR revalidation
  };

  // Updated toggleFollow function accepts a string id.
  const toggleFollow = (id: string) => {
    setFollowStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Erreur de chargement des contacts.
      </div>
    );
  if (!contacts)
    return <div className="p-8 text-center">Chargement...</div>;

  return (
    <>
      <motion.div
        className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header with filters */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#213f5b]/10 to-white backdrop-blur-md px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UserCircleIcon className="h-10 w-10 text-[#213f5b]" />
            <h2 className="text-2xl font-bold text-[#213f5b]">Contacts</h2>
            <select
              value={contactFilter}
              onChange={(e) => setContactFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#213f5b] transition-all"
            >
              <option value="all">Tous les contacts</option>
              <option value="recently-viewed">Récemment consultés</option>
              <option value="last-24h">Ajoutés dans les dernières 24 heures</option>
              <option value="last-7d">Ajoutés dans les 7 derniers jours</option>
              <option value="no-notes-1m">Sans notes dans le dernier mois</option>
              <option value="no-notes-7d">Sans notes dans les 7 derniers jours</option>
              <option value="following">Articles que je suis</option>
            </select>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher un contact..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#213f5b] transition-all"
            />
            <Button
              variant="ghost"
              onClick={refreshContacts}
              aria-label="Rafraîchir"
              className="transition-transform transform hover:scale-105"
            >
              <ArrowPathIcon className="h-6 w-6 text-[#213f5b]" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSidebarVisible(!sidebarVisible)}
              aria-label="Ouvrir le menu"
              className="transition-transform transform hover:scale-105"
            >
              {sidebarVisible ? (
                <XMarkIcon className="h-6 w-6 text-[#213f5b]" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-[#213f5b]" />
              )}
            </Button>
            <Button
              variant="primary"
              className="transition-transform transform hover:scale-105"
              onClick={() => setShowAddContactModal(true)}
            >
              Ajouter un contact
            </Button>

            {/* AnimatePresence will handle mounting/unmounting the modal */}
            <AnimatePresence>
              {showAddContactModal && (
                <AddContactModal onClose={() => setShowAddContactModal(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Toolbar for multiple row selection */}
        {selectedRows.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#213f5b] text-white px-6 py-3 flex items-center justify-between"
          >
            <div>
              {selectedRows.size} contact
              {selectedRows.size > 1 ? "s sélectionnés" : " sélectionné"}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#213f5b]"
              >
                Supprimer
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#213f5b]"
              >
                Exporter
              </Button>
              {/* You can add more bulk actions here */}
            </div>
          </motion.div>
        )}

        {/* Table Section */}
        <div className="flex relative">
          <div className="flex-1 overflow-x-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#213f5b]/10 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      ref={headerCheckboxRef}
                      checked={
                        selectedRows.size === filteredContacts.length &&
                        filteredContacts.length > 0
                      }
                      onChange={toggleAllRows}
                      className="form-checkbox h-4 w-4 text-[#213f5b]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Étiquettes
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Suivre
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => {
                    const contactId = String(contact.id);
                    return (
                      <motion.tr
                        key={contactId}
                        className={`transition-all duration-200 ${
                          selectedRows.has(contactId)
                            ? "bg-[#213f5b]/10"
                            : "hover:bg-[#213f5b]/20"
                        }`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(contactId)}
                            onChange={() => toggleRowSelection(contactId)}
                            className="form-checkbox h-4 w-4 text-[#213f5b]"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            aria-label={`Voir le profil de ${getContactName(contact)}`}
                          >
                            <div className="h-10 w-10 rounded-full bg-[#213f5b] text-white flex items-center justify-center font-bold shadow-md">
                              {getContactName(contact).charAt(0).toUpperCase()}
                            </div>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="underline text-[#213f5b] hover:text-[#213f5b] transition-colors"
                          >
                            {getContactName(contact)}
                          </button>
                        </td>
                        <td className="px-4 py-3">{getContactTitle(contact)}</td>
                        <td className="px-4 py-3">{contact.phone}</td>
                        <td className="px-4 py-3">{contact.email}</td>
                        <td className="px-4 py-3">
                          {contact.tags?.join(", ") || "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleFollow(contactId)}
                            aria-label={
                              followStatus[contactId]
                                ? "Ne plus suivre"
                                : "Suivre"
                            }
                            className="transition-transform transform hover:scale-110"
                          >
                            {followStatus[contactId] ? (
                              <StarIconSolid className="h-6 w-6 text-yellow-500" />
                            ) : (
                              <StarIconOutline className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedActionsContact(contact)}
                            aria-label="Actions"
                            className="transition-transform transform hover:scale-110"
                          >
                            <EllipsisHorizontalIcon className="h-6 w-6 text-[#213f5b]" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      Aucun contact trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar & Backdrop Overlay */}
          <AnimatePresence>
            {sidebarVisible && (
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-20"
                  onClick={() => setSidebarVisible(false)}
                ></motion.div>
                {/* Sidebar */}
                <ContactSidebar onClose={() => setSidebarVisible(false)} />
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedContact && (
          <ContactDetailsModal
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
            toggleFollowLocal={toggleFollow}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedActionsContact && (
          <ContactActionsModal
            contact={selectedActionsContact}
            onClose={() => setSelectedActionsContact(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ----------------------
// ContactSidebar Component
// ----------------------
function ContactSidebar({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="w-72 bg-white p-6 border-l border-gray-200 shadow-2xl fixed right-0 top-0 bottom-0 z-30"
      transition={{ type: "tween", duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#213f5b]">Actions</h3>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Fermer le menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        <Button
          variant="outline"
          fullWidth
          className="transition-transform transform hover:scale-105"
        >
          Importer des contacts
        </Button>
        <Button
          variant="outline"
          fullWidth
          className="transition-transform transform hover:scale-105"
        >
          Exporter des contacts
        </Button>
        <Button
          variant="outline"
          fullWidth
          className="transition-transform transform hover:scale-105"
        >
          Importer des notes
        </Button>
        <Button
          variant="outline"
          fullWidth
          className="transition-transform transform hover:scale-105"
        >
          Exporter des notes
        </Button>
      </div>
    </motion.div>
  );
}
