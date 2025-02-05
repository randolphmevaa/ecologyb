"use client";

import React, { useState } from "react";
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
import { ContactDetailsModal} from "./ContactDetailsModal";
import { Contact, ContactActionsModal } from "./ContactActionsModal";

// A simple fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContactTable() {
  // Fetch contacts from API
  const { data: contacts, error } = useSWR<Contact[]>("/api/contacts", fetcher, {
    fallbackData: [],
  });

  const [searchFilter, setSearchFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("all");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedActionsContact, setSelectedActionsContact] = useState<Contact | null>(null);

  // Initialize follow status from fetched contacts
  const [followStatus, setFollowStatus] = useState<{ [key: number]: boolean }>(() => {
    const initial: { [key: number]: boolean } = {};
    contacts?.forEach((contact) => {
      initial[contact.id] = contact.suivi;
    });
    return initial;
  });

  const refreshContacts = () => {
    console.log("Rafraîchissement des contacts...");
    // Optionally, you can trigger a revalidation here using SWR's mutate.
  };

  const toggleFollow = (id: number) => {
    setFollowStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter contacts using searchFilter (you can later incorporate contactFilter)
  const filteredContacts = (contacts || []).filter((contact) =>
    // Use optional chaining to avoid errors if contact.name is undefined
    contact.name?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (error) return <div>Erreur de chargement des contacts.</div>;
  if (!contacts) return <div>Chargement...</div>;

  return (
    <>
      <motion.div
        className="flex flex-col bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-[#bfddf9]/20 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header with filters */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="h-6 w-6 text-[#1a365d]" />
              <h2 className="text-xl font-semibold text-[#1a365d]">Contacts</h2>
              <select
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
                className="ml-4 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#2a75c7]"
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
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Rechercher un contact..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="px-4 py-2 w-full sm:w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#2a75c7]"
              />
              <Button variant="ghost" onClick={refreshContacts}>
                <ArrowPathIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={() => setSidebarVisible(!sidebarVisible)}>
                {sidebarVisible ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </Button>
              <Button>Ajouter un contact</Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex relative">
          <div className="flex-1 overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3">
                    <input type="checkbox" />
                  </th>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Titre</th>
                  <th className="px-4 py-3">Téléphone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Étiquettes</th>
                  <th className="px-4 py-3">Suivre</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <motion.tr
                      key={contact.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" className="form-checkbox" />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedContact(contact)}>
                          <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                            {contact.name.charAt(0)}
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="underline hover:text-blue-600"
                        >
                          {contact.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">{contact.titre}</td>
                      <td className="px-4 py-3">{contact.phone}</td>
                      <td className="px-4 py-3">{contact.email}</td>
                      <td className="px-4 py-3">{contact.tags?.join(", ") || ""}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleFollow(contact.id)}>
                          {followStatus[contact.id] ? (
                            <StarIconSolid className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <StarIconOutline className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedActionsContact(contact)}>
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Aucun contact trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar */}
          <AnimatePresence>
            {sidebarVisible && <ContactSidebar onClose={() => setSidebarVisible(false)} />}
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
      className="w-64 bg-white p-4 border-l border-gray-200 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1a365d]">Actions</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-3">
        <Button variant="outline" fullWidth>
          Importer des contacts
        </Button>
        <Button variant="outline" fullWidth>
          Exporter des contacts
        </Button>
        <Button variant="outline" fullWidth>
          Importer des notes
        </Button>
        <Button variant="outline" fullWidth>
          Exporter des notes
        </Button>
      </div>
    </motion.div>
  );
}
