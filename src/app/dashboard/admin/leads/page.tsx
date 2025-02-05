"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Dummy leads data for demonstration
const dummyLeads = [
  {
    id: 1,
    name: "Jean Dupont",
    company: "EnerSol",
    solution: "Pompes a chaleur",
    status: "Nouveau",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Marie Claire",
    company: "Solaire Expert",
    solution: "Chauffe-eau solaire individuel",
    status: "Contacté",
    createdAt: "2025-01-20",
  },
  {
    id: 3,
    name: "Luc Martin",
    company: "Eco Energie",
    solution: "Chauffe-eau thermodynamique",
    status: "En négociation",
    createdAt: "2025-01-22",
  },
  {
    id: 4,
    name: "Sophie Durand",
    company: "Green Solutions",
    solution: "Système Solaire Combiné",
    status: "Converti",
    createdAt: "2025-01-25",
  },
  // ... more sample leads if needed
];

const solutions = [
  "Pompes a chaleur",
  "Chauffe-eau solaire individuel",
  "Chauffe-eau thermodynamique",
  "Système Solaire Combiné",
];

export default function LeadsPage() {
  // State for filtering and search
  const [filterSolution, setFilterSolution] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // In a real app, leads might come from an API
  const [leads] = useState(dummyLeads);

  // Filter the leads based on solution and search query
  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        const matchesSolution = filterSolution
          ? lead.solution === filterSolution
          : true;
        const matchesSearch =
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSolution && matchesSearch;
      }),
    [leads, filterSolution, searchQuery]
  );

  // Summary statistics
  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "Nouveau").length;
  const contactedLeads = leads.filter((lead) => lead.status === "Contacté").length;
  const convertedLeads = leads.filter((lead) => lead.status === "Converti").length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header remains at the top */}
      <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8">
        {/* Page Title */}
        <motion.h1
          className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Leads
        </motion.h1>

        {/* Filter & Action Bar */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter by Solution */}
            <div className="relative">
              <select
                value={filterSolution}
                onChange={(e) => setFilterSolution(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm"
              >
                <option value="">Toutes les solutions</option>
                {solutions.map((solution) => (
                  <option key={solution} value={solution}>
                    {solution}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Rechercher par nom ou entreprise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            className="whitespace-nowrap shadow-lg hover:shadow-2xl transition-shadow"
          >
            Ajouter un Lead
          </Button>
        </motion.div>

        {/* Summary Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: "Total Leads", value: totalLeads },
            { label: "Nouveaux Leads", value: newLeads },
            { label: "Contactés", value: contactedLeads },
            { label: "Convertis", value: convertedLeads },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Leads Table */}
        <motion.div
          className="bg-white rounded-xl shadow overflow-hidden mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {["Nom", "Entreprise", "Solution", "Statut", "Créé le", ""].map(
                    (header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.solution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            lead.status === "Converti"
                              ? "bg-green-100 text-green-800"
                              : lead.status === "Contacté"
                              ? "bg-blue-100 text-blue-800"
                              : lead.status === "En négociation"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="outline">Voir</Button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Aucun lead trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Leads Distribution Chart */}
        <motion.div
          className="bg-white p-8 rounded-xl shadow hover:shadow-2xl transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h2 className="text-2xl font-bold text-gray-800 mb-6">
            Distribution des Leads par Solution
          </motion.h2>
          <div className="flex justify-around items-end space-x-4">
            {solutions.map((solution) => {
              const count = leads.filter((lead) => lead.solution === solution).length;
              return (
                <div key={solution} className="flex flex-col items-center">
                  <motion.span
                    className="text-sm text-gray-600 text-center mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {solution}
                  </motion.span>
                  <motion.div
                    className="w-10 bg-primary rounded-t-md"
                    style={{ height: `${count * 12}px` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${count * 12}px` }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.span
                    className="text-sm text-gray-800 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {count}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
