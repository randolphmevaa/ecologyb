"use client";

import Image from "next/image";
import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  // MapIcon,
  PhoneIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
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
  // Filter state
  const [filter, setFilter] = useState("Tous");
  const [activeTab, setActiveTab] = useState("contacts"); // 'contacts' or 'organizations'

  const filteredContacts =
    filter === "Tous"
      ? contacts
      : contacts.filter((contact) => contact.solution === filter);

  const filteredOrganizations =
    filter === "Tous"
      ? organizations
      : organizations.filter((org) => org.solution === filter);

  // Count contacts and organizations by solution type
  const solutionCounts = {
    "Tous": contacts.length + organizations.length,
    "Pompes a chaleur": contacts.filter(c => c.solution === "Pompes a chaleur").length + 
                         organizations.filter(o => o.solution === "Pompes a chaleur").length,
    "Chauffe-eau solaire individuel": contacts.filter(c => c.solution === "Chauffe-eau solaire individuel").length + 
                                      organizations.filter(o => o.solution === "Chauffe-eau solaire individuel").length,
    "Chauffe-eau thermodynamique": contacts.filter(c => c.solution === "Chauffe-eau thermodynamique").length + 
                                   organizations.filter(o => o.solution === "Chauffe-eau thermodynamique").length,
    "Système Solaire Combiné": contacts.filter(c => c.solution === "Système Solaire Combiné").length + 
                              organizations.filter(o => o.solution === "Système Solaire Combiné").length,
  };

  return (
    <div className="flex h-screen bg-[#ffffff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <Header />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
          }}
        >
          {/* Hero Section */}
          <div className="w-full py-10" style={{ backgroundColor: "rgba(33,63,91,0.95)" }}>
            <motion.div
              className="max-w-7xl mx-auto px-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white">
                Clients & Organisations
              </h1>
              <p className="mt-4 text-lg text-[#d2fcb2]">
                Retrouvez vos contacts clés et partenaires stratégiques pour nos
                solutions énergétiques spécialisées.
              </p>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Stats and Quick Access */}
            <motion.div 
              className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="col-span-1 bg-white rounded-xl shadow-md p-6 border-l-4 border-[#213f5b]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Contacts</p>
                    <h3 className="text-2xl font-bold text-[#213f5b]">{contacts.length}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-[#bfddf9]/20">
                    <UserGroupIcon className="h-6 w-6 text-[#213f5b]" />
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 bg-white rounded-xl shadow-md p-6 border-l-4 border-[#d2fcb2]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Organisations</p>
                    <h3 className="text-2xl font-bold text-[#213f5b]">{organizations.length}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-[#d2fcb2]/20">
                    <BuildingOfficeIcon className="h-6 w-6 text-[#213f5b]" />
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">Solutions populaires</p>
                <div className="space-y-2">
                  {Object.entries(solutionCounts)
                    .filter(([key]) => key !== "Tous")
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 2)
                    .map(([solution, count]) => (
                      <div key={solution} className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#213f5b] h-2.5 rounded-full" 
                            style={{ width: `${(count / solutionCounts["Tous"]) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{solution.substring(0, 15)}...</span>
                        <span className="ml-auto text-xs font-medium text-[#213f5b]">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* Filter and Tab Selection */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
              {/* Filter Buttons */}
              <motion.div
                className="flex flex-wrap gap-2"
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === item
                        ? "bg-[#213f5b] text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-[#bfddf9] hover:bg-[#bfddf9]/10"
                    }`}
                  >
                    {item} 
                    <span className="ml-1 text-xs opacity-70">({solutionCounts[item as keyof typeof solutionCounts]})</span>

                  </button>
                ))}
              </motion.div>

              {/* Tab Selector */}
              <motion.div 
                className="inline-flex bg-white p-1 rounded-lg shadow-sm border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "contacts"
                      ? "bg-[#bfddf9]/30 text-[#213f5b]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Contacts
                </button>
                <button
                  onClick={() => setActiveTab("organizations")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "organizations"
                      ? "bg-[#bfddf9]/30 text-[#213f5b]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Organisations
                </button>
              </motion.div>
            </div>

            {/* Contacts Section */}
            {activeTab === "contacts" && (
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <motion.div
                        key={contact.id}
                        className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#bfddf9]/10 rounded-bl-full z-0"></div>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#213f5b] to-[#bfddf9] blur-sm opacity-50"></div>
                            <Image
                              src={contact.avatar}
                              alt={contact.name}
                              width={64}
                              height={64}
                              className="relative rounded-full object-cover border-2 border-white shadow-md"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#213f5b]">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-[#213f5b]/70">
                              {contact.title}
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#bfddf9]/5 p-3 rounded-lg mb-4">
                          <div className="text-xs font-medium text-[#213f5b]/60 mb-1">
                            SOLUTION
                          </div>
                          <div className="text-sm font-medium text-[#213f5b]">
                            {contact.solution}
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-4 w-4 text-[#213f5b]/60" />
                            <span className="text-sm text-gray-700 truncate">
                              {contact.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-[#213f5b]/60" />
                            <span className="text-sm text-gray-700">
                              {contact.phone}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="mt-auto flex items-center justify-center w-full py-2 px-4 bg-[#213f5b] text-white rounded-lg transition-colors hover:bg-[#213f5b]/90"
                        >
                          Voir Détails
                          <ChevronRightIcon className="ml-2 h-5 w-5" />
                        </motion.button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-3 py-16 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-[#bfddf9]/20 flex items-center justify-center mb-4">
                        <UserGroupIcon className="h-8 w-8 text-[#213f5b]/40" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Aucun contact trouvé</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Aucun contact correspondant au filtre &quot;{filter}&quot; n&apos;a été trouvé.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Organizations Section */}
            {activeTab === "organizations" && (
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org) => (
                      <motion.div
                        key={org.id}
                        className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#d2fcb2]/10 rounded-bl-full z-0"></div>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#213f5b] to-[#d2fcb2] blur-sm opacity-50"></div>
                            <Image
                              src={org.logo}
                              alt={org.name}
                              width={64}
                              height={64}
                              className="relative rounded-full object-cover border-2 border-white shadow-md"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#213f5b]">
                              {org.name}
                            </h3>
                            <p className="text-sm text-[#213f5b]/70">
                              {org.industry}
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#d2fcb2]/10 p-3 rounded-lg mb-4">
                          <div className="text-xs font-medium text-[#213f5b]/60 mb-1">
                            SOLUTION
                          </div>
                          <div className="text-sm font-medium text-[#213f5b]">
                            {org.solution}
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-4 w-4 text-[#213f5b]/60" />
                            <span className="text-sm text-gray-700 truncate">
                              {org.contactEmail}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-[#213f5b]/60" />
                            <span className="text-sm text-gray-700">
                              {org.phone}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="mt-auto flex items-center justify-center w-full py-2 px-4 bg-[#213f5b] text-white rounded-lg transition-colors hover:bg-[#213f5b]/90"
                        >
                          Voir Détails
                          <ChevronRightIcon className="ml-2 h-5 w-5" />
                        </motion.button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-3 py-16 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-[#d2fcb2]/20 flex items-center justify-center mb-4">
                        <BuildingOfficeIcon className="h-8 w-8 text-[#213f5b]/40" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Aucune organisation trouvée</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Aucune organisation correspondant au filtre &quot;{filter}&quot; n&apos;a été trouvée.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
