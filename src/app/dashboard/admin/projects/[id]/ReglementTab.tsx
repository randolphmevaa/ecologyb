import React, { FC, useState } from "react";
import { 
  Clock, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  ArrowDownUp, 
  // Filter, 
  // ChevronDown 
} from "lucide-react";

interface ReglementTabProps {
  contactId: string;
}

interface Payment {
  id: number;
  product: string;
  amount: string;
  dueDate: string;
  status: string;
}

const samplePayments: Payment[] = [
  { id: 1, product: "Pompes à chaleur", amount: "1 200€", dueDate: "15/03/2025", status: "À venir" },
  { id: 2, product: "Chauffe-eau solaire individuel", amount: "850€", dueDate: "01/04/2025", status: "À venir" },
  { id: 3, product: "Chauffe-eau thermodynamique", amount: "900€", dueDate: "15/04/2025", status: "À venir" },
  { id: 4, product: "Système Solaire Combiné", amount: "2 500€", dueDate: "01/05/2025", status: "À venir" },
];

const ReglementTab: FC<ReglementTabProps> = ({ contactId }) => {
  const [sortConfig, setSortConfig] = useState<{key: keyof Payment, direction: 'asc' | 'desc'}>({
    key: 'dueDate',
    direction: 'asc'
  });
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const totalUpcomingPayments = samplePayments.reduce((sum, payment) => 
    sum + parseFloat(payment.amount.replace('€', '').replace(' ', '')), 0);

  const sortedPayments = [...samplePayments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredPayments = filterStatus 
    ? sortedPayments.filter(payment => payment.status === filterStatus)
    : sortedPayments;

  const handleSort = (key: keyof Payment) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div 
    >
      <div className="max-w-6xl mx-auto">
        <div 
          className="bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div 
            className="p-6 md:p-8 flex items-center justify-between"
            style={{
              backgroundColor: '#213f5b',
              color: '#ffffff'
            }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Finances & Paiements
              </h1>
              <p className="text-sm md:text-base opacity-80">
                Vue d&apos;ensemble de vos solutions énergétiques
              </p>
            </div>
            <div 
              className="p-3 rounded-xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)'
              }}
            >
              <CreditCard className="text-white" size={32} />
            </div>
          </div>

          {/* Summary Cards */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6"
            style={{
              backgroundColor: '#bfddf9'
            }}
          >
            {[
              { 
                icon: <Clock className="text-blue-600" size={24} />, 
                title: "Paiements à venir", 
                value: samplePayments.length 
              },
              { 
                icon: <Calendar className="text-green-600" size={24} />, 
                title: "Total à payer", 
                value: `${totalUpcomingPayments.toFixed(2)}€` 
              },
              { 
                icon: <CheckCircle className="text-purple-600" size={24} />, 
                title: "Statut", 
                value: "En règle" 
              }
            ].map((card, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4 transform transition hover:scale-105"
              >
                {card.icon}
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-xl font-bold" style={{ color: '#213f5b' }}>
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
              backgroundColor: '#d2fcb2'
            }}
          >
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilterStatus(null)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filterStatus === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-blue-600 border border-blue-600'
                }`}
              >
                Tous
              </button>
              <button 
                onClick={() => setFilterStatus('À venir')}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filterStatus === 'À venir' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-blue-600 border border-blue-600'
                }`}
              >
                À venir
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
                  <option value="product">Produit</option>
                  <option value="amount">Montant</option>
                  <option value="dueDate">Date</option>
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
                      backgroundColor: '#bfddf9'
                    }}
                  >
                    {['Produit', 'Montant', 'Date d\'échéance', 'Statut'].map((header, index) => (
                      <th 
                        key={index} 
                        className={`px-4 py-3 text-left ${
                          index === 0 ? 'rounded-l-lg' : 
                          index === 3 ? 'rounded-r-lg' : ''
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr 
                      key={payment.id} 
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium" style={{ color: '#213f5b' }}>
                        {payment.product}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {payment.amount}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {payment.dueDate}
                      </td>
                      <td className="px-4 py-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: '#d2fcb2',
                            color: '#213f5b'
                          }}
                        >
                          {payment.status}
                        </span>
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
              backgroundColor: '#bfddf9'
            }}
          >
            <p className="text-sm text-gray-700">
              Contact ID: {contactId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReglementTab;