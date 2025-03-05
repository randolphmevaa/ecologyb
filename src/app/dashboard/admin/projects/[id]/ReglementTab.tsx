import React, { FC, useState } from "react";
import { 
  Clock, 
  CreditCard, 
  // Calendar, 
  CheckCircle, 
  ArrowDownUp, 
} from "lucide-react";

interface ReglementTabProps {
  contactId: string;
}

interface Payment {
  id: number;
  provenance: string; // formerly product
  amount: string;
  paymentDate: string; // to be filled only when status is set to "PAIEMENT RECU"
  status: string;
}

const samplePayments: Payment[] = [
  { id: 1, provenance: "MaPrimeRenov", amount: "1 200€", paymentDate: "", status: "PAIEMENT A VENIR" },
  { id: 2, provenance: "Cee", amount: "850€", paymentDate: "", status: "PAIEMENT A VENIR" },
  { id: 3, provenance: "Chèque", amount: "900€", paymentDate: "", status: "PAIEMENT A VENIR" },
  { id: 4, provenance: "Virement", amount: "2 500€", paymentDate: "", status: "PAIEMENT A VENIR" },
];

const ReglementTab: FC<ReglementTabProps> = ({ contactId }) => {
  const [payments, setPayments] = useState<Payment[]>(samplePayments);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Payment; direction: "asc" | "desc" }>({
    key: "paymentDate",
    direction: "asc",
  });
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const paiementsAVenirCount = payments.filter(payment => payment.status === "PAIEMENT A VENIR").length;
  const paiementRecuCount = payments.filter(payment => payment.status === "PAIEMENT RECU").length;

  const sortedPayments = [...payments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredPayments = filterStatus
    ? sortedPayments.filter((payment) => payment.status === filterStatus)
    : sortedPayments;

  const handleSort = (key: keyof Payment) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleProvenanceChange = (id: number, value: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, provenance: value } : payment
      )
    );
  };

  const handleStatusChange = (id: number, value: string) => {
    setPayments((prev) =>
      prev.map((payment) => {
        if (payment.id === id) {
          return {
            ...payment,
            status: value,
            // If status is not "PAIEMENT RECU", clear the payment date
            paymentDate: value === "PAIEMENT RECU" ? payment.paymentDate : "",
          };
        }
        return payment;
      })
    );
  };

  const handlePaymentDateChange = (id: number, value: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === id ? { ...payment, paymentDate: value } : payment))
    );
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div
            className="p-6 md:p-8 flex items-center justify-between"
            style={{
              backgroundColor: "#213f5b",
              color: "#ffffff",
            }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Paiements
              </h1>
              <p className="text-sm md:text-base opacity-80">
                Vue d&apos;ensemble de vos solutions énergétiques
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            >
              <CreditCard className="text-white" size={32} />
            </div>
          </div>

          {/* Summary Cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
            style={{
              backgroundColor: "#bfddf9",
            }}
          >
            {[
              {
                icon: <Clock className="text-blue-600" size={24} />,
                title: "Paiements à venir",
                value: paiementsAVenirCount,
              },
              {
                icon: <CheckCircle className="text-purple-600" size={24} />,
                title: "Paiement recu",
                value: paiementRecuCount,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4 transform transition hover:scale-105"
              >
                {card.icon}
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-xl font-bold" style={{ color: "#213f5b" }}>
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Sorting */}
          <div
            className="px-6 pt-4 flex justify-between items-center"
            style={{
              backgroundColor: "#d2fcb2",
            }}
          >
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus(null)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filterStatus === null
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus("PAIEMENT A VENIR")}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filterStatus === "PAIEMENT A VENIR"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600"
                }`}
              >
                Paiement à venir
              </button>
              <button
                onClick={() => setFilterStatus("PAIEMENT RECU")}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filterStatus === "PAIEMENT RECU"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600"
                }`}
              >
                Paiement recu
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Trier par</span>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm"
                  value={sortConfig.key}
                  onChange={(e) => handleSort(e.target.value as keyof Payment)}
                >
                  <option value="provenance">Provenance</option>
                  <option value="amount">Montant</option>
                  <option value="paymentDate">Date de paiement</option>
                </select>
                <ArrowDownUp
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="text-blue-600"
                    style={{
                      backgroundColor: "#bfddf9",
                    }}
                  >
                    {["Provenance", "Montant", "Date de paiement", "Statut"].map(
                      (header, index) => (
                        <th
                          key={index}
                          className={`px-4 py-3 text-left ${
                            index === 0
                              ? "rounded-l-lg"
                              : index === 3
                              ? "rounded-r-lg"
                              : ""
                          }`}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      {/* Provenance dropdown */}
                      <td className="px-4 py-4 font-medium" style={{ color: "#213f5b" }}>
                        <select
                          value={payment.provenance}
                          onChange={(e) => handleProvenanceChange(payment.id, e.target.value)}
                          className="border border-gray-300 rounded-md p-1 text-sm"
                        >
                          <option value="MaPrimeRenov">MaPrimeRenov</option>
                          <option value="Cee">Cee</option>
                          <option value="Chèque">Chèque</option>
                          <option value="Virement">Virement</option>
                          <option value="Financement">Financement</option>
                          <option value="Acompte">Acompte</option>
                          <option value="L’anah">L’anah</option>
                        </select>
                      </td>
                      {/* Amount remains as is */}
                      <td className="px-4 py-4 text-gray-600">{payment.amount}</td>
                      {/* Payment Date: input only if status is "PAIEMENT RECU" */}
                      <td className="px-4 py-4 text-gray-600">
                        {payment.status === "PAIEMENT RECU" ? (
                          <input
                            type="date"
                            value={payment.paymentDate}
                            onChange={(e) => handlePaymentDateChange(payment.id, e.target.value)}
                            className="border border-gray-300 rounded-md p-1 text-sm"
                          />
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      {/* Status dropdown */}
                      <td className="px-4 py-4">
                        <select
                          value={payment.status}
                          onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                          className="border border-gray-300 rounded-md p-1 text-sm"
                        >
                          <option value="PAIEMENT A VENIR">Paiement à venir</option>
                          <option value="PAIEMENT RECU">Paiement recu</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div
            className="p-4 text-right"
            style={{
              backgroundColor: "#bfddf9",
            }}
          >
            <p className="text-sm text-gray-700">Contact ID: {contactId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReglementTab;
