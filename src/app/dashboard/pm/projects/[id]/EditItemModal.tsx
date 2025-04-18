import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { 
  XMarkIcon, 
  ShoppingCartIcon, 
  WrenchScrewdriverIcon,
  LinkIcon,
  // UserGroupIcon,
  DocumentCheckIcon,
  // TrashIcon
} from "@heroicons/react/24/outline";

// Define types for the table items
interface BaseTableItem {
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
}

interface Product extends BaseTableItem {
  description?: string;
  subcontractor?: string;
}

interface Service extends BaseTableItem {
  description?: string;
}

interface Operation extends BaseTableItem {
  productId?: string;
  subcontractor?: string;
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

type TableItem = Product | Service | Operation;

// Define props interface for the component
interface EditItemModalProps {
  onClose: () => void;
  onSave: (item: TableItem) => void;
  item: TableItem;
}

// Mock data for dropdowns
const housingTypes = ["Maison", "Appartement"];
const pumpUsages = ["Chauffage", "Chauffage et eau sanitaire"];
const boilerTypes = ["Charbon", "Fioul", "Gaz", "Bois", "Électrique", "Autre"];
const unitOptions = ["Pièce(s)", "m²", "m³", "mètre(s)", "kg", "heure(s)", "kwh", "ml"];
const operationCodes = [
  { id: 'BAR-TH-101', name: 'BAR-TH-101 - Chaudière individuelle à haute performance énergétique' },
  { id: 'BAR-TH-104', name: 'BAR-TH-104 - Pompe à chaleur de type air/eau ou eau/eau' },
  { id: 'BAR-TH-106', name: 'BAR-TH-106 - Chaudière individuelle à condensation' },
  { id: 'BAR-TH-112-Granulés', name: 'BAR-TH-112-Granulés - Appareil indépendant de chauffage au bois' },
  { id: 'BAR-TH-113', name: 'BAR-TH-113 - Chaudière biomasse individuelle' },
  { id: 'BAR-TH-137', name: 'BAR-TH-137 - Raccordement d\'un bâtiment résidentiel à un réseau de chaleur' },
  { id: 'BAR-TH-143', name: 'BAR-TH-143 - Système solaire combiné (SSC)' },
  { id: 'BAR-TH-159', name: 'BAR-TH-159 - Pompe à chaleur hybride individuelle' },
  { id: 'BAR-TH-171', name: 'BAR-TH-171 - Isolation thermique des réseaux hydrauliques de chauffage' }
];
const subcontractors = [
  { id: 'SC1', name: 'EcoChauffage SARL' },
  { id: 'SC2', name: 'ThermiPro' },
  { id: 'SC3', name: 'EnergySolution' },
  { id: 'SC4', name: 'SASHAYNO' }
];
const products = [
  { id: 'P1', name: 'Daikin 14KW MONO Altherma 3 HMT - BI BLOC' },
  { id: 'P2', name: 'Mitsubishi Ecodan Hydrobox 11kW' },
  { id: 'P3', name: 'Atlantic Alfea Excellia 16kW' },
  { id: 'P4', name: 'THERMOR Aeromax 5 - 200L' },
  { id: 'P5', name: 'ATLANTIC Calypso VM 200L' }
];

// Add TypeScript interface for Toggle props
interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  label: string;
}

// Toggle component for reuse
const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label }) => (
  <div className="flex items-center gap-3">
    <button 
      type="button"
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

// EditItemModal component
const EditItemModal: React.FC<EditItemModalProps> = ({ onClose, onSave, item }) => {
  // Determine item type and special cases
  let itemType = "product";
  let isWasteService = false;
  
  if (item.id.startsWith("prod-")) {
    itemType = "product";
  } else if (item.id.startsWith("serv-")) {
    itemType = "service";
    // Check if this is the "mention déchets" service
    if (item.reference === 'MENTION DÉCHETS') {
      isWasteService = true;
    }
  } else {
    itemType = "operation";
  }

  // Create a state for the edited item
  const [editedItem, setEditedItem] = useState<TableItem>({ ...item });
  const [showDescription, setShowDescription] = useState(true);
  const [coupDePouceOperation, setCoupDePouceOperation] = useState(
    itemType === "operation" && (item as Operation).coupDePouceOperation || false
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setEditedItem({ ...editedItem, [name]: newValue });
  };

  // Update derived values when quantity or price changes
  useEffect(() => {
    const quantity = editedItem.quantity || 1;
    const unitPriceTTC = editedItem.unitPriceTTC || 0;
    const tva = editedItem.tva || (itemType === "product" ? 20 : 10);
    
    const unitPriceHT = unitPriceTTC / (1 + tva / 100);
    const totalHT = unitPriceHT * quantity;
    const totalTTC = unitPriceTTC * quantity;
    
    setEditedItem({
      ...editedItem,
      unitPriceHT: parseFloat(unitPriceHT.toFixed(2)),
      totalHT: parseFloat(totalHT.toFixed(2)),
      totalTTC: parseFloat(totalTTC.toFixed(2))
    });
  }, [editedItem.quantity, editedItem.unitPriceTTC, editedItem.tva, itemType]);

  // Toggle the coup de pouce flag for operations
  const handleToggleCoupDePouce = () => {
    setCoupDePouceOperation(!coupDePouceOperation);
    setEditedItem({
      ...editedItem,
      coupDePouceOperation: !coupDePouceOperation
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(editedItem);
    onClose();
  };

  // Helper function to clean HTML formatting from text
  const cleanText = (text: string | undefined): string => {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/<\/?span[^>]*>/g, '')
      .replace(/<br\/?>|<\/br>/g, '\n')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
  };

  // Get the appropriate icon and title based on item type
  const getTypeInfo = () => {
    if (isWasteService) {
      return { 
        icon: <DocumentCheckIcon className="h-6 w-6 text-white" />,
        title: "Modifier prestation Obligation \"mention déchets\" applicable"
      };
    }
    
    switch (itemType) {
      case "product":
        return { 
          icon: <ShoppingCartIcon className="h-6 w-6 text-white" />,
          title: "Modifier le produit"
        };
      case "service":
        return { 
          icon: <WrenchScrewdriverIcon className="h-6 w-6 text-white" />,
          title: "Modifier la prestation"
        };
      case "operation":
        return { 
          icon: <LinkIcon className="h-6 w-6 text-white" />,
          title: "Modifier l'opération"
        };
      default:
        return { 
          icon: <ShoppingCartIcon className="h-6 w-6 text-white" />,
          title: "Modifier l'élément"
        };
    }
  };

  const { icon, title } = getTypeInfo();

  // Render different form content based on the item type
  const renderFormContent = () => {
    // Common fields for all types (reference, position, quantity, prices)
    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
              Référence
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={editedItem.reference}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="number"
              id="position"
              name="position"
              value={editedItem.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={editedItem.quantity}
              onChange={handleChange}
              min="1"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="unitPriceTTC" className="block text-sm font-medium text-gray-700 mb-1">
              Prix Unitaire TTC
            </label>
            <input
              type="number"
              id="unitPriceTTC"
              name="unitPriceTTC"
              value={editedItem.unitPriceTTC}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label htmlFor="unitPriceHT" className="block text-sm font-medium text-gray-700 mb-1">
              Prix Unitaire HT
            </label>
            <input
              type="number"
              id="unitPriceHT"
              value={editedItem.unitPriceHT}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50"
            />
          </div>
          
          <div>
            <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
              TVA
            </label>
            <select
              id="tva"
              name="tva"
              value={editedItem.tva}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="5.5">5,5%</option>
              <option value="10">10%</option>
              <option value="20">20%</option>
            </select>
          </div>
        </div>
      </>
    );

    // For waste service - simplified form
    if (isWasteService) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Référence
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={editedItem.reference}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="number"
                id="position"
                name="position"
                value={editedItem.position}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={editedItem.quantity}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="unitPriceTTC" className="block text-sm font-medium text-gray-700 mb-1">
                Prix Unitaire TTC
              </label>
              <input
                type="number"
                id="unitPriceTTC"
                name="unitPriceTTC"
                value={editedItem.unitPriceTTC}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionner unité
              </label>
              <select
                id="unit"
                name="unit"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
                TVA
              </label>
              <select
                id="tva"
                name="tva"
                value={editedItem.tva}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="5.5">5,5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Désignation
            </label>
            <textarea
              id="name"
              name="name"
              value={cleanText(editedItem.name)}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </>
      );
    }

    // For regular service
    if (itemType === "service") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Référence
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={editedItem.reference}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="number"
                id="position"
                name="position"
                value={editedItem.position}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={editedItem.quantity}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="unitPriceTTC" className="block text-sm font-medium text-gray-700 mb-1">
                Prix Unitaire TTC
              </label>
              <input
                type="number"
                id="unitPriceTTC"
                name="unitPriceTTC"
                value={editedItem.unitPriceTTC}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionner unité
              </label>
              <select
                id="unit"
                name="unit"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
                TVA
              </label>
              <select
                id="tva"
                name="tva"
                value={editedItem.tva}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="5.5">5,5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="showDescription" 
                checked={showDescription}
                onChange={() => setShowDescription(!showDescription)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="showDescription" className="ml-2 text-sm text-gray-700">
                Afficher la désignation
              </label>
            </div>
          </div>
          
          {showDescription && (
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Désignation
              </label>
              <textarea
                id="name"
                name="name"
                value={cleanText(editedItem.name)}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}
        </>
      );
    }

    // For product
    if (itemType === "product") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Référence
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={editedItem.reference}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="number"
                id="position"
                name="position"
                value={editedItem.position}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={editedItem.quantity}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="unitPriceTTC" className="block text-sm font-medium text-gray-700 mb-1">
                Prix Unitaire TTC
              </label>
              <input
                type="number"
                id="unitPriceTTC"
                name="unitPriceTTC"
                value={editedItem.unitPriceTTC}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="unitPriceHT" className="block text-sm font-medium text-gray-700 mb-1">
                Prix Unitaire HT
              </label>
              <input
                type="number"
                id="unitPriceHT"
                value={editedItem.unitPriceHT}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50"
              />
            </div>
            
            <div>
              <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
                TVA
              </label>
              <select
                id="tva"
                name="tva"
                value={editedItem.tva}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="5.5">5,5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="subcontractor" className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionnez un sous-traitant
            </label>
            <select
              id="subcontractor"
              name="subcontractor"
              value={(editedItem as Product).subcontractor || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">-- Sélectionnez un sous-traitant --</option>
              {subcontractors.map(sc => (
                <option key={sc.id} value={sc.id}>{sc.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="showDescription" 
                checked={showDescription}
                onChange={() => setShowDescription(!showDescription)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="showDescription" className="ml-2 text-sm text-gray-700">
                Afficher la désignation
              </label>
            </div>
          </div>
          
          {showDescription && (
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Désignation
              </label>
              <textarea
                id="name"
                name="name"
                value={cleanText(editedItem.name)}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}
        </>
      );
    }

    // For operation
    if (itemType === "operation") {
      const operation = editedItem as Operation;
      
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Opération
              </label>
              <select
                id="reference"
                name="reference"
                value={operation.reference || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- Sélectionnez une opération --</option>
                {operationCodes.map(op => (
                  <option key={op.id} value={op.id}>{op.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="number"
                id="position"
                name="position"
                value={editedItem.position}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={editedItem.quantity}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="unitPriceTTC" className="block text-sm font-medium text-gray-700 mb-1">
                Prix Unitaire TTC
              </label>
              <input
                type="number"
                id="unitPriceTTC"
                name="unitPriceTTC"
                value={editedItem.unitPriceTTC}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="unitPriceHT" className="block text-sm font-medium text-gray-700 mb-1">
                Prix Unitaire HT
              </label>
              <input
                type="number"
                id="unitPriceHT"
                value={editedItem.unitPriceHT}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50"
              />
            </div>
            
            <div>
              <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
                TVA
              </label>
              <select
                id="tva"
                name="tva"
                value={editedItem.tva}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="5.5">5,5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6 space-y-4">
            {/* Toggle for Coup de pouce */}
            <Toggle 
              enabled={coupDePouceOperation}
              onChange={handleToggleCoupDePouce}
              label="Opération coup de pouce"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                Produit
              </label>
              <select
                id="productId"
                name="productId"
                value={operation.productId || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- Sélectionnez un produit --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subcontractor" className="block text-sm font-medium text-gray-700 mb-1">
                Sous-traitant
              </label>
              <select
                id="subcontractor"
                name="subcontractor"
                value={operation.subcontractor || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- Sélectionnez un sous-traitant --</option>
                {subcontractors.map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="livingArea" className="block text-sm font-medium text-gray-700 mb-1">
                Surface habitable*
              </label>
              <input
                type="number"
                id="livingArea"
                name="livingArea"
                value={operation.livingArea || ''}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="heatedArea" className="block text-sm font-medium text-gray-700 mb-1">
                Surface chauffée*
              </label>
              <input
                type="number"
                id="heatedArea"
                name="heatedArea"
                value={operation.heatedArea || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="oldBoilerType" className="block text-sm font-medium text-gray-700 mb-1">
                Type énergie de la chaudière à remplacer*
              </label>
              <select
                id="oldBoilerType"
                name="oldBoilerType"
                value={operation.oldBoilerType || ''}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- Sélectionnez --</option>
                {boilerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="oldBoilerBrand" className="block text-sm font-medium text-gray-700 mb-1">
                Marque chaudière à remplacer
              </label>
              <input
                type="text"
                id="oldBoilerBrand"
                name="oldBoilerBrand"
                value={operation.oldBoilerBrand || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="oldBoilerModel" className="block text-sm font-medium text-gray-700 mb-1">
                Modèle chaudière à remplacer
              </label>
              <input
                type="text"
                id="oldBoilerModel"
                name="oldBoilerModel"
                value={operation.oldBoilerModel || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="housingType" className="block text-sm font-medium text-gray-700 mb-1">
                Type de logement
              </label>
              <select
                id="housingType"
                name="housingType"
                value={operation.housingType || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- Sélectionnez --</option>
                {housingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="pumpUsage" className="block text-sm font-medium text-gray-700 mb-1">
                Usage couvert par la PAC
              </label>
              <select
                id="pumpUsage"
                name="pumpUsage"
                value={operation.pumpUsage || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- Sélectionnez --</option>
                {pumpUsages.map(usage => (
                  <option key={usage} value={usage}>{usage}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="regulatorBrand" className="block text-sm font-medium text-gray-700 mb-1">
                Marque du régulateur
              </label>
              <input
                type="text"
                id="regulatorBrand"
                name="regulatorBrand"
                value={operation.regulatorBrand || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="regulatorReference" className="block text-sm font-medium text-gray-700 mb-1">
                Référence du régulateur
              </label>
              <input
                type="text"
                id="regulatorReference"
                name="regulatorReference"
                value={operation.regulatorReference || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </>
      );
    }

    // Default fallback (should not happen)
    return (
      <>
        {commonFields}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="name"
            name="name"
            value={editedItem.name}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </>
    );
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
                {icon}
              </div>
              <h2 className="text-xl font-bold text-white">
                {title}
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
            {renderFormContent()}
            
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

export default EditItemModal;