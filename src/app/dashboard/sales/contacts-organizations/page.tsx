"use client";

import Image from "next/image";
import { useState } from "react";
import { Header } from "@/components/Header";
import { motion} from "framer-motion";
import {
  MapIcon,
  PhoneIcon,
  // UserCircleIcon,
  // BuildingOffice2Icon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Sample contacts data for Sales
const contacts = [
  {
    id: 1,
    name: "Alice Martin",
    title: "Responsable Commerciale",
    email: "alice.martin@client.com",
    phone: "+33 6 12 34 56 78",
    solution: "Pompes a chaleur",
    avatar: "/contacts/alice.png",
  },
  {
    id: 2,
    name: "Bertrand Dupont",
    title: "Conseiller Technique",
    email: "bertrand.dupont@client.com",
    phone: "+33 6 87 65 43 21",
    solution: "Chauffe-eau solaire individuel",
    avatar: "/contacts/bertrand.png",
  },
  {
    id: 3,
    name: "Caroline Legrand",
    title: "Directrice Commerciale",
    email: "caroline.legrand@client.com",
    phone: "+33 7 12 98 76 54",
    solution: "Chauffe-eau thermodynamique",
    avatar: "/contacts/caroline.png",
  },
];

// Sample organizations data for Sales
const organizations = [
  {
    id: 1,
    name: "Energie Plus",
    industry: "Installation Énergétique",
    contactEmail: "contact@energieplus.com",
    phone: "+33 1 23 45 67 89",
    solution: "Système Solaire Combiné",
    logo: "/orgs/energieplus.png",
  },
  {
    id: 2,
    name: "Chaleur & Confort",
    industry: "Maintenance & Support",
    contactEmail: "info@chaleurconfort.com",
    phone: "+33 1 98 76 54 32",
    solution: "Pompes a chaleur",
    logo: "/orgs/chaleurconfort.png",
  },
  {
    id: 3,
    name: "SolarTech",
    industry: "Technologies Solaires",
    contactEmail: "sales@solartech.com",
    phone: "+33 2 34 56 78 90",
    solution: "Chauffe-eau solaire individuel",
    logo: "/orgs/solartech.png",
  },
];

export default function SalesContactsOrganizations() {
  // Optionally, you could add filtering functionality by solution.
  const [filter, setFilter] = useState("Tous");

  const filteredContacts =
    filter === "Tous"
      ? contacts
      : contacts.filter((contact) => contact.solution === filter);

  const filteredOrganizations =
    filter === "Tous"
      ? organizations
      : organizations.filter((org) => org.solution === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Common Header */}
      <Header user={{ name: "Account Executive", avatar: "/sales-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Clients & Organisations</h1>
          <p className="mt-4 text-lg text-gray-700">
            Retrouvez vos contacts clés et partenaires stratégiques pour nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-10 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            "Tous",
            "Pompes a chaleur",
            "Chauffe-eau solaire individuel",
            "Chauffe-eau thermodynamique",
            "Système Solaire Combiné",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                filter === item
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-purple-50"
              }`}
            >
              {item}
            </button>
          ))}
        </motion.div>

        {/* Contacts Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contacts</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact.id}
                className="bg-white/80 backdrop-blur-md border border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={contact.avatar}
                    alt={contact.name}
                    className="h-16 w-16 rounded-full object-cover border-4 border-purple-600"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                    <p className="text-sm text-purple-600">{contact.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{contact.phone}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-purple-600 text-white rounded-full transition-colors hover:bg-purple-700"
                >
                  Voir Détails <ChevronRightIcon className="ml-2 h-5 w-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Organizations Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Organisations</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((org) => (
              <motion.div
                key={org.id}
                className="bg-white/80 backdrop-blur-md border border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={org.logo}
                    alt={org.name}
                    className="h-16 w-16 rounded-full object-cover border-4 border-purple-600"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{org.name}</h3>
                    <p className="text-sm text-purple-600">{org.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{org.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{org.phone}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-purple-600 text-white rounded-full transition-colors hover:bg-purple-700"
                >
                  Voir Détails <ChevronRightIcon className="ml-2 h-5 w-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* No Data Found Message */}
        {filteredContacts.length === 0 && filteredOrganizations.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucun contact ou organisation trouvé pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
