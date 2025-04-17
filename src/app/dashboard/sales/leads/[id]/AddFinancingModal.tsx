import { BanknotesIcon, XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Define TypeScript interface for financing data
interface FinancingData {
    bankName: string;
    fixedRate: string;
    paymentAmountWithInsurance: string;
    loanAmount: string;
    annualPercentageRate: string;
    paymentAmountWithoutInsurance: string;
    frequency: string;
    deferredMonths: string;
    numberOfPayments: string;
    personalContribution: string;
    totalAmountDue: string;
    sellerName: string;
  }
  
  // Available financing types for selection
  const financingOptions = [
    { id: 'F1', name: 'Prêt classique' },
    { id: 'F2', name: 'Crédit à la consommation' },
    { id: 'F3', name: 'Eco-prêt à taux zéro' },
  ];
  
  // Available banks for selection
  const bankOptions = [
    { id: 'B1', name: 'Crédit Agricole' },
    { id: 'B2', name: 'BNP Paribas' },
    { id: 'B3', name: 'Société Générale' },
    { id: 'B4', name: 'Caisse d\'Epargne' },
    { id: 'B5', name: 'Banque Populaire' },
    { id: 'B6', name: 'LCL' },
    { id: 'B7', name: 'Crédit Mutuel' },
  ];
  
  // Available payment frequencies
  const frequencyOptions = [
    { id: 'monthly', name: 'Mensuelle' },
    { id: 'quarterly', name: 'Trimestrielle' },
    { id: 'biannual', name: 'Semestrielle' },
    { id: 'annual', name: 'Annuelle' },
  ];
  
  // Add Financing Modal Component
  interface AddFinancingModalProps {
    onClose: () => void;
    onSave: (financing: FinancingData) => void;
    existingFinancing?: FinancingData | null; // NEW
  }
  
  
  const AddFinancingModal: React.FC<AddFinancingModalProps> = ({ onClose, onSave, existingFinancing }) => {
    const isEditMode = !!existingFinancing;
    const [selectedFinancing, setSelectedFinancing] = useState<string>("");
    const [financing, setFinancing] = useState<FinancingData>({
      bankName: "",
      fixedRate: "",
      paymentAmountWithInsurance: "",
      loanAmount: "",
      annualPercentageRate: "",
      paymentAmountWithoutInsurance: "",
      frequency: "monthly",
      deferredMonths: "0",
      numberOfPayments: "",
      personalContribution: "0",
      totalAmountDue: "",
      sellerName: ""
    });

    useEffect(() => {
      if (existingFinancing) {
        setFinancing(existingFinancing);
      }
    }, [existingFinancing]);
  
    // Handle financing selection
    const handleSelectFinancing = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      setSelectedFinancing(selectedId);
      
      // Pre-fill data based on selection (in a real app, this would be dynamic)
      if (selectedId === 'F3') {
        setFinancing({
          ...financing,
          bankName: 'Crédit Agricole',
          fixedRate: '0',
          annualPercentageRate: '0',
          frequency: 'monthly',
        });
      }
    };
  
    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFinancing({
        ...financing,
        [name]: value
      });
      
      // Auto-calculate total amount due when loan amount and number of payments change
      if (name === 'loanAmount' || name === 'numberOfPayments' || name === 'paymentAmountWithInsurance') {
        // const loanAmount = parseFloat(financing.loanAmount) || 0;
        const numberOfPayments = parseInt(financing.numberOfPayments) || 0;
        const paymentAmount = parseFloat(financing.paymentAmountWithInsurance) || 0;
        
        if (numberOfPayments > 0 && paymentAmount > 0) {
          const totalDue = (paymentAmount * numberOfPayments).toFixed(2);
          setFinancing(prev => ({
            ...prev,
            totalAmountDue: totalDue
          }));
        }
      }
    };
  
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Basic validation
      if (!financing.bankName || !financing.fixedRate || !financing.loanAmount || 
          !financing.annualPercentageRate || !financing.paymentAmountWithInsurance || 
          !financing.paymentAmountWithoutInsurance || !financing.numberOfPayments) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      onSave(financing);
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl w-full max-w-4xl m-4 overflow-hidden shadow-2xl"
        >
          {/* Modal header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <BanknotesIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {isEditMode ? "Modifier un financement" : "Ajouter un financement"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Modal body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="selectFinancing" className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionner un financement (Optionnel)
                </label>
                <select
                  id="selectFinancing"
                  value={selectedFinancing}
                  onChange={handleSelectFinancing}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">-- Sélectionnez un type de financement --</option>
                  {financingOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                    Organisme Bancaire : *
                  </label>
                  <select
                    id="bankName"
                    name="bankName"
                    value={financing.bankName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">-- Sélectionnez une banque --</option>
                    {bankOptions.map(bank => (
                      <option key={bank.id} value={bank.name}>{bank.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant du prêt : *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="loanAmount"
                      name="loanAmount"
                      value={financing.loanAmount}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="fixedRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Taux débiteur fixe : *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="fixedRate"
                      name="fixedRate"
                      value={financing.fixedRate}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pr-7 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="annualPercentageRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Taux annuel effectif global (TAEG) : *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="annualPercentageRate"
                      name="annualPercentageRate"
                      value={financing.annualPercentageRate}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pr-7 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="paymentAmountWithInsurance" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant des échéances avec assurance : *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="paymentAmountWithInsurance"
                      name="paymentAmountWithInsurance"
                      value={financing.paymentAmountWithInsurance}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="paymentAmountWithoutInsurance" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant des échéances sans assurance : *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="paymentAmountWithoutInsurance"
                      name="paymentAmountWithoutInsurance"
                      value={financing.paymentAmountWithoutInsurance}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Périodicité : *
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={financing.frequency}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    {frequencyOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="deferredMonths" className="block text-sm font-medium text-gray-700 mb-1">
                    Mois de report : *
                  </label>
                  <input
                    type="number"
                    id="deferredMonths"
                    name="deferredMonths"
                    value={financing.deferredMonths}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label htmlFor="numberOfPayments" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre d&apos;échéances : *
                  </label>
                  <input
                    type="number"
                    id="numberOfPayments"
                    name="numberOfPayments"
                    value={financing.numberOfPayments}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label htmlFor="personalContribution" className="block text-sm font-medium text-gray-700 mb-1">
                    Apport personnel :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="personalContribution"
                      name="personalContribution"
                      value={financing.personalContribution}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="totalAmountDue" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant total dû :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="totalAmountDue"
                      name="totalAmountDue"
                      value={financing.totalAmountDue}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du vendeur :
                  </label>
                  <input
                    type="text"
                    id="sellerName"
                    name="sellerName"
                    value={financing.sellerName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              
              {/* Notice about financing */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Ces informations seront ajoutées dans la section &quot;Information complémentaire&quot; et apparaîtront dans le PDF du devis.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  };
  
  export default AddFinancingModal;