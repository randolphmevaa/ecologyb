"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  BuildingOfficeIcon,
  ArrowPathIcon,
  Bars3Icon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  StarIcon as StarIconOutline,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/outline";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { OrganizationDetailsModal } from "./OrganizationDetailsModal";
import { OrganizationActionsModal } from "./OrganizationActionsModal";
import L from "leaflet";

// Define the Organization interface
interface Organization {
  id: number;
  name: string;
  lat: number;
  lng: number;
  phone: string;
  billingStreet: string;
  billingCity: string;
  suivi: boolean;
  // add any other properties as needed
}

// Define an interface for the Leaflet Icon prototype to avoid using 'any'
interface IconDefaultPrototype {
  _getIconUrl?: () => string;
}

// Fix default marker icon issues with Leaflet
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// A simple fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrganizationMap() {
  // Fetch organizations from the API endpoint
  const { data: organizations, error } = useSWR<Organization[]>("/api/organizations", fetcher, {
    fallbackData: [],
  });

  const [searchFilter, setSearchFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedActionsOrganization, setSelectedActionsOrganization] = useState<Organization | null>(null);

  // Initialize follow status from fetched organizations
  const [followStatus, setFollowStatus] = useState<{ [key: number]: boolean }>(() => {
    const initial: { [key: number]: boolean } = {};
    organizations?.forEach((org) => {
      initial[org.id] = org.suivi;
    });
    return initial;
  });

  const refreshOrganizations = () => {
    console.log("Rafraîchissement des organisations...");
    // You could call SWR's mutate() here to revalidate the data
  };

  const toggleFollow = (id: number) => {
    setFollowStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter organizations using the search filter
  const filteredOrganizations = (organizations || []).filter((org) =>
    org.name?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (error) return <div>Erreur de chargement des organisations.</div>;
  if (!organizations) return <div>Chargement...</div>;

  const center: [number, number] = [48.8566, 2.3522];

  return (
    <>
      <motion.div
        className="flex flex-col bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-[#bfddf9]/20 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header with Search & Filter */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BuildingOfficeIcon className="h-6 w-6 text-[#1a4231]" />
              <h2 className="text-xl font-semibold text-[#1a4231]">Organisations</h2>
              <select
                value={organizationFilter}
                onChange={(e) => setOrganizationFilter(e.target.value)}
                className="ml-4 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#2a75c7]"
              >
                <option value="all">Toutes les organisations</option>
                <option value="recently-viewed">Récemment consultées</option>
                <option value="last-24h">Ajoutées dans les dernières 24 heures</option>
                <option value="last-7d">Ajoutées dans les 7 derniers jours</option>
                <option value="no-notes-1m">Sans notes dans le dernier mois</option>
                <option value="no-notes-7d">Sans notes dans les 7 derniers jours</option>
                <option value="following">Organisations suivies</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Rechercher une organisation..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="px-4 py-2 w-full sm:w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#2a75c7]"
              />
              <Button variant="ghost" onClick={refreshOrganizations}>
                <ArrowPathIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={() => setSidebarVisible(!sidebarVisible)}>
                {sidebarVisible ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </Button>
              <Button>Ajouter une organisation</Button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-6 h-80 rounded-xl overflow-hidden">
          <MapContainer center={center} zoom={6} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredOrganizations.map((org) => (
              <Marker key={org.id} position={[org.lat, org.lng]}>
                <Popup>
                  <strong>{org.name}</strong>
                  <br />
                  {org.billingStreet}, {org.billingCity}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Table Section with Sidebar */}
        <div className="flex relative">
          <div className="flex-1 overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3">
                    <input type="checkbox" />
                  </th>
                  <th className="px-4 py-3">Logo</th>
                  <th className="px-4 py-3">Nom de l&apos;organisation</th>
                  <th className="px-4 py-3">Téléphone</th>
                  <th className="px-4 py-3">Adresse de facturation</th>
                  <th className="px-4 py-3">Ville de facturation</th>
                  <th className="px-4 py-3">Suivre</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <motion.tr
                      key={org.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" className="form-checkbox" />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedOrganization(org)}>
                          <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                            {org.name.charAt(0)}
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrganization(org)}
                          className="underline hover:text-blue-600"
                        >
                          {org.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">{org.phone}</td>
                      <td className="px-4 py-3">{org.billingStreet}</td>
                      <td className="px-4 py-3">{org.billingCity}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleFollow(org.id)}>
                          {followStatus[org.id] ? (
                            <StarIconSolid className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <StarIconOutline className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedActionsOrganization(org)}>
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Aucune organisation trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <AnimatePresence>
            {sidebarVisible && <OrganizationSidebar onClose={() => setSidebarVisible(false)} />}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedOrganization && (
          <OrganizationDetailsModal
            organization={selectedOrganization}
            onClose={() => setSelectedOrganization(null)}
            toggleFollowLocal={toggleFollow}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedActionsOrganization && (
          <OrganizationActionsModal
            organization={selectedActionsOrganization}
            onClose={() => setSelectedActionsOrganization(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Inline OrganizationSidebar Component
function OrganizationSidebar({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="w-64 bg-white p-4 border-l border-gray-200 shadow-lg absolute right-0 top-0 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1a4231]">Actions</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-3">
        <Button variant="outline" fullWidth>
          Importer des organisations
        </Button>
        <Button variant="outline" fullWidth>
          Exporter des organisations
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
