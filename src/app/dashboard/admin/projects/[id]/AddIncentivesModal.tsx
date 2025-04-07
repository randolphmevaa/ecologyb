import { CurrencyDollarIcon, XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { IncentivesData } from "./types";

// Product and Service types
interface Product {
  id: string;
  reference: string;
  position: number;
  name: string;
  quantity: number;
  unitPriceHT: number;
  unitPriceTTC: number;
  tva: number;
  totalHT: number;
  totalTTC: number;
  description?: string;
  subcontractor?: string;
}

interface Operation {
  id: string;
  reference: string;
  position: number;
  name: string;
  productId?: string;
  subcontractor?: string;
  quantity: number;
  unitPriceHT: number;
  unitPriceTTC: number;
  tva: number;
  totalHT: number;
  totalTTC: number;
  dpeBeforeWork?: string;
  dpeAfterWork?: string;
  livingArea?: number;
  heatedArea?: number;
  oldBoilerType?: string;
  oldBoilerBrand?: string;
  oldBoilerModel?: string;
  hasReceiveDimensionPaper?: boolean;
  housingType?: string;
  pumpUsage?: string;
  regulatorBrand?: string;
  regulatorReference?: string;
  coupDePouceOperation?: boolean;
}

interface Service {
  id: string;
  reference: string;
  position: number;
  name: string;
  quantity: number;
  unitPriceHT: number;
  unitPriceTTC: number;
  tva: number;
  totalHT: number;
  totalTTC: number;
  description?: string;
}

type TableItem = Product | Service | Operation;

// Add Incentives Modal Component
interface AddIncentivesModalProps {
  onClose: () => void;
  onSave: (incentives: IncentivesData) => void;
  currentIncentives: IncentivesData;
  tableItems?: TableItem[]; // This should match your TableItem type
}

const AddIncentivesModal: React.FC<AddIncentivesModalProps> = ({ 
  onClose, 
  onSave, 
  currentIncentives,
  tableItems = []
}) => {
  // 1) Filter only the references you want.
  const operations = tableItems.filter(item => 
    item.reference && ["BAR-TH-171", "BAR-TH-104", "BAR-TH-113", "BAR-TH-143"].includes(item.reference)
  );

  // 2) Initialize the local state with any existing incentives
  const [incentives, setIncentives] = useState<IncentivesData>(() => {
    // Initial state calculation
    const initialState = { ...currentIncentives };
    
    // Pre-populate operation-specific fields
    operations.forEach((op) => {
      const ceeKey = `primeCEE_${op.reference}`;
      const mprKey = `primeMPR_${op.reference}`;
      
      // Only set if not already in currentIncentives
      if (!initialState[ceeKey]) {
        initialState[ceeKey] = currentIncentives.primeCEE || "0";
      }
      if (!initialState[mprKey]) {
        initialState[mprKey] = currentIncentives.primeMPR || "0";
      }
    });
    
    return initialState;
  });

  // Handle regular input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setIncentives(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setIncentives(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle toggle for maPrimeRenov
  const handleToggleChange = () => {
    setIncentives(prev => ({
      ...prev,
      activiteMaPrimeRenov: !prev.activiteMaPrimeRenov
    }));
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(incentives);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl w-full max-w-3xl m-4 overflow-hidden shadow-2xl"
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
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* If we have operations in the table, show them */}
            {operations.length > 0 ? (
              operations.map((op, index) => (
                <div key={op.id || index} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Primes pour l&apos;opération {op.reference}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Prime MPR / MaPrimeRenov */}
                    <div>
                      <label
                        htmlFor={`primeMPR_${op.reference}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Prime ma prime renov {op.reference}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id={`primeMPR_${op.reference}`}
                          name={`primeMPR_${op.reference}`}
                          value={incentives[`primeMPR_${op.reference}`] as string || "0"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="0,00"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>

                    {/* Remise exceptionnelle (same for all ops in this example) */}
                    <div>
                      <label
                        htmlFor="remiseExceptionnelle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                    
                    {/* Prime C.E.E */}
                    <div>
                      <label
                        htmlFor={`primeCEE_${op.reference}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Prime C.E.E {op.reference}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id={`primeCEE_${op.reference}`}
                          name={`primeCEE_${op.reference}`}
                          value={incentives[`primeCEE_${op.reference}`] as string || "0"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="0,00"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              // Default incentives layout if no operations match your filter
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="primeCEE"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="remiseExceptionnelle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="primeCEE_second"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Prime C.E.E
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="primeCEE_second"
                        name="primeCEE_second"
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
                </div>
              </div>
            )}

            {/* Second row with 2 inputs */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="primeMPR"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Prime MPR
                  </label>
                  <select
                    id="primeMPR"
                    name="primeMPR"
                    value={incentives.primeMPR}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="Prime MPR deduite">Prime MPR deduite</option>
                    <option value="Prime MPR non deduite">Prime MPR non deduite</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="montantPriseEnChargeRAC"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
              </div>
            </div>

            {/* Third row with toggle and acompte */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Toggle activiteMaPrimeRenov */}
                <div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`${
                        incentives.activiteMaPrimeRenov ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      role="switch"
                      aria-checked={incentives.activiteMaPrimeRenov}
                      onClick={handleToggleChange}
                    >
                      <span className="sr-only">Activé maPrimeRenov</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          incentives.activiteMaPrimeRenov ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Activé maPrimeRenov
                    </span>
                  </div>
                </div>

                {/* Acompte */}
                <div>
                  <label
                    htmlFor="acompte"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
              </div>
            </div>

            {/* Warning message */}
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800">
              <div className="flex items-center gap-2">
                <ExclamationCircleIcon className="h-6 w-6 text-amber-600" />
                <p>
                  Les primes affichées sont estimatives et peuvent varier selon les conditions d&apos;éligibilité et les critères des fournisseurs.
                </p>
              </div>
            </div>

            {/* Buttons */}
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