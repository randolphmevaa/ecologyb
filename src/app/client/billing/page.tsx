"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// 1) Create a union type for valid solutions:
type EnergySolution =
  | "Pompes a chaleur"
  | "Chauffe-eau solaire individuel"
  | "Chauffe-eau thermodynamique"
  | "Système Solaire Combiné";

// 2) Type your invoice so that `solution` cannot be anything else:
interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  solution: EnergySolution; // <--- Use the union type here
  amount: number;
  status: string;
}

// 3) Tell TypeScript that `solutionIcons` is keyed by these same strings:
const solutionIcons: Record<EnergySolution, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "Pompes a chaleur": CreditCardIcon,
  "Chauffe-eau solaire individuel": CurrencyDollarIcon,
  "Chauffe-eau thermodynamique": CalendarIcon,
  "Système Solaire Combiné": DocumentTextIcon,
};


// // Map each energy solution to an icon for visual cues
// const solutionIcons = {
//   "Pompes a chaleur": CreditCardIcon,
//   "Chauffe-eau solaire individuel": CurrencyDollarIcon,
//   "Chauffe-eau thermodynamique": CalendarIcon,
//   "Système Solaire Combiné": DocumentTextIcon,
// };

// Sample invoices data
const invoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-1001",
    date: "2025-01-15",
    solution: "Pompes a chaleur",
    amount: 2500,
    status: "Payé",
  },
  {
    id: 2,
    invoiceNumber: "INV-1002",
    date: "2025-02-10",
    solution: "Chauffe-eau solaire individuel",
    amount: 1800,
    status: "En attente",
  },
  {
    id: 3,
    invoiceNumber: "INV-1003",
    date: "2025-02-20",
    solution: "Chauffe-eau thermodynamique",
    amount: 3200,
    status: "En attente",
  },
  {
    id: 4,
    invoiceNumber: "INV-1004",
    date: "2025-03-05",
    solution: "Système Solaire Combiné",
    amount: 4500,
    status: "Payé",
  },
];

export default function ClientBilling() {
  const [filter, setFilter] = useState("Tous");

  // Filter invoices based on the selected energy solution
  const filteredInvoices =
    filter === "Tous"
      ? invoices
      : invoices.filter((invoice) => invoice.solution === filter);

  // Billing summary data
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "Payé")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === "Payé")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const nextPaymentDate = "2025-02-10"; // Example next payment date

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Import the Header component for consistent navigation */}
      <Header user={{ name: "Client", avatar: "/client-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Facturation &amp; Paiements</h1>
          <p className="mt-2 text-lg text-gray-600">
            Consultez vos factures et gérez vos paiements pour nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Billing Summary Cards */}
        <motion.div
          className="grid gap-6 md:grid-cols-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-10 w-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Payé</p>
                <p className="text-xl font-semibold text-gray-800">
                  ${totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <CreditCardIcon className="h-10 w-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total à Payer</p>
                <p className="text-xl font-semibold text-gray-800">
                  ${totalOutstanding.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <CalendarIcon className="h-10 w-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Prochain Paiement</p>
                <p className="text-xl font-semibold text-gray-800">{nextPaymentDate}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
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
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-green-50"
              }`}
            >
              {item}
            </button>
          ))}
        </motion.div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Facture</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Solution</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const Icon = solutionIcons[invoice.solution] || CreditCardIcon;
                return (
                  <tr key={invoice.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Icon className="h-6 w-6 text-green-600" />
                      <span>{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-4 py-3">{invoice.date}</td>
                    <td className="px-4 py-3">{invoice.solution}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Payé"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center text-green-600 font-medium"
                      >
                        Voir Détails <ChevronRightIcon className="h-5 w-5 ml-1" />
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </motion.table>
        </div>

        {/* No Invoices Found Message */}
        {filteredInvoices.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucune facture trouvée pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
