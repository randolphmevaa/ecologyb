import { CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";

// Define TypeScript interface for incentives data
interface IncentivesData {
    primeCEE: string;
    remiseExceptionnelle: string;
    primeMPR: string;
    montantPriseEnChargeRAC: string;
    activiteMaPrimeRenov: boolean;
    acompte: string;
  }
  
  // Add Incentives Modal Component
  interface AddIncentivesModalProps {
    onClose: () => void;
    onSave: (incentives: IncentivesData) => void;
    currentIncentives: IncentivesData;
  }
  
const AddIncentivesModal: React.FC<AddIncentivesModalProps> = ({ onClose, onSave, currentIncentives }) => {
    const [incentives, setIncentives] = useState<IncentivesData>(currentIncentives);
  
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(incentives);
      onClose();
    };
  
    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setIncentives({
        ...incentives,
        [name]: type === 'checkbox' ? checked : value
      });
    };
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl w-full max-w-2xl m-4 overflow-hidden shadow-2xl"
        >
          {/* Modal header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Ajouter ou modifier une prime
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
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="primeCEE" className="block text-sm font-medium text-gray-700 mb-1">
                    Prime C.E.E
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="primeCEE"
                      name="primeCEE"
                      value={incentives.primeCEE}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="0,00"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="remiseExceptionnelle" className="block text-sm font-medium text-gray-700 mb-1">
                    Remise exceptionnelle
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="remiseExceptionnelle"
                      name="remiseExceptionnelle"
                      value={incentives.remiseExceptionnelle}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="0,00"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="primeMPR" className="block text-sm font-medium text-gray-700 mb-1">
                    Prime MPR déduite
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="primeMPR"
                      name="primeMPR"
                      value={incentives.primeMPR}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="0,00"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="montantPriseEnChargeRAC" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant de prise en charge du RAC
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="montantPriseEnChargeRAC"
                      name="montantPriseEnChargeRAC"
                      value={incentives.montantPriseEnChargeRAC}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="0,00"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="acompte" className="block text-sm font-medium text-gray-700 mb-1">
                    Acompte
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="acompte"
                      name="acompte"
                      value={incentives.acompte}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="0,00"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-6">
                  <input 
                    type="checkbox" 
                    id="activiteMaPrimeRenov" 
                    name="activiteMaPrimeRenov"
                    checked={incentives.activiteMaPrimeRenov}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="activiteMaPrimeRenov" className="ml-2 text-sm text-gray-700">
                    Activité MaPrimeRénov
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
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

export default AddIncentivesModal;