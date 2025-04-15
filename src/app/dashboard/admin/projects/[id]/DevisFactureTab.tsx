import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddDocumentModal from './AddDocumentModal';
import DocumentsList from './DocumentsList';
import AddIncentivesModal from './AddIncentivesModal';
import EditItemModal from './EditItemModal';
import {
  DocumentIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CalendarIcon,
  EyeIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CurrencyEuroIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PrinterIcon,
  EllipsisHorizontalIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  UserIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  LinkIcon,
  // UsersIcon,
  FolderPlusIcon,
  CurrencyDollarIcon,
  TrashIcon,
  ChevronUpIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import PDFGenerator from "./PDFGenerator";
import AddFinancingModal from "./AddFinancingModal";
import { DPMairieData, IncentivesData } from './types';
import AddDPMairieModal from './AddDPMairieModal';

// These imports would be added to the existing imports in the DevisEditor component
import AddIndivisionModal, { IndivisionData } from './AddIndivisionModal';
import IndivisionInfoDisplay from './IndivisionInfoDisplay';

interface DevisFactureTabProps {
  contactId: string;
}

// Define TypeScript interface for DP Mairie data
// interface DPMairieData {
//   mandataire: string;
//   transmissionVoieElectronique: boolean;
//   terrainLotissement: string; // "oui" | "non" | "je ne sais pas"
//   certificatUrbanisme: string; // "oui" | "non" | "je ne sais pas"
//   zoneAmenagementConcertee: string; // "oui" | "non" | "je ne sais pas"
//   remembrementUrbain: string; // "oui" | "non" | "je ne sais pas"
//   projetUrbainPartenarial: string; // "oui" | "non" | "je ne sais pas"
//   operationInteretNational: string; // "oui" | "non" | "je ne sais pas"
//   precisionsTerrainConcerne: string;
//   immeubleClasseMonumentsHistoriques: boolean;
//   projetConcerne: string; // "résidence principale" | "résidence secondaire"
//   perimetresProtection: {
//     sitePatrimonialRemarquable: boolean;
//     abordsMonumentHistorique: boolean;
//     siteClasse: boolean;
//   };
//   parcellesCadastralesSupplementaires: {
//     parcelle1: string;
//     parcelle2: string;
//     parcelle3: string;
//   };
//   puissanceElectrique: number;
//   puissanceCrete: number;
//   destinationEnergie: string;
//   modeUtilisationLogements: string;
//   titreProjet: string;
//   autresPrecisions: string;
//   superficiePanneauxSol: number;
//   surfacePlancherExistante: number;
//   surfacePlancherSupprimee: number;
//   surfacePlancherCreee: number;
//   travauxConstructionExistante: string;
//   descriptionProjet: string;
//   // DAACT fields
//   numeroDeclarationPrealable: string;
//   dateAchevementChantier: string;
//   totaliteTravaux: boolean;
//   surfacePlancherCreeeDaact: number;
//   dateEnvoiDaact: string;
// }

// type ActionMenuProps = {
//   onAction: (action: string, productCode?: string) => void;
//   onShowDealModal: () => void;
//   tableItems?: TableItem[];
//   hasAgent: boolean;
//   hasSubcontractor: boolean;
//   hasInformation: boolean;
//   hasFunding: boolean;
//   hasMairie: boolean;
//   hasDeal: boolean;
//   hasDivision: boolean;
// };


// Document types and statuses
type DocumentType = "devis" | "facture";
type DocumentStatus = "brouillon" | "envoyé" | "signé" | "payé" | "refusé" | "expiré";
type SignatureStatus = "non_demandé" | "en_attente" | "signé" | "refusé";

interface Document {
  id: string;
  type: DocumentType;
  reference: string;
  clientId: string;
  clientName: string;
  dateCreation: string;
  dateExpiration?: string;
  dateDue?: string;
  montant: string;
  status: DocumentStatus;
  signatureStatus: SignatureStatus;
  signatureDate?: string;
  fileUrl: string;
  customName?: string;
}

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

// Add this interface to your existing interfaces
interface QuoteDocument {
  id: string;
  name: string;
  size: string;
  tag: string;
  date: string;
}

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

// TypeScript interfaces for component props
interface AddProductModalProps {
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

interface AddServiceModalProps {
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}

// Extended interfaces for state management
interface ProductState {
  reference: string;
  position: number;
  name: string;
  quantity: number;
  unitPriceHT: number;
  unitPriceTTC: number;
  tva: number;
  totalHT: number;
  totalTTC: number;
  description: string;
  showDescription: boolean;
  subcontractor: string;
  brand?: string;
  serviceData?: {
    reference: string;
    description: string;
    price: number;
    tva: number;
  };
}

interface ServiceState {
  reference: string;
  position: number;
  name: string;
  quantity: number;
  unitPriceHT: number;
  unitPriceTTC: number;
  tva: number;
  totalHT: number;
  totalTTC: number;
  description: string;
  showDescription: boolean;
}

// Define the Service interface if it's not already defined
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

// Define the ServiceState interface
interface ServiceState {
  reference: string;
  position: number;
  name: string;
  quantity: number;
  unitPriceHT: number;
  unitPriceTTC: number;
  tva: number;
  totalHT: number;
  totalTTC: number;
  description: string;
  showDescription: boolean;
}

// Define the props interface for the component
interface AddServiceModalProps {
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}

// Define types for SizingNoteModal props
interface SizingNoteModalProps {
  onClose: () => void;
  onSave: (sizingNote: SizingNote) => void;
  productCode: string;
  productDetails?: {
    name?: string;
    brand?: string;
    reference?: string;
  };
  existingNote?: SizingNote | null;
}

// Define type for sizing note data
interface SizingNote {
  id?: string;
  productType: string;
  productBrand: string;
  productReference: string;
  volume: string;
  heatLoss: string;
  dimensioning: string;
  coverage: number;
  constructionCoef?: number;
  buildingType: string;
  radiatorType: string;
  waterTemperature: string;
  heatedArea: string;
  ceilingHeight: string;
  baseTemperature: number;
  desiredTemperature: number;
  altitude: number;
}

// Define TypeScript interfaces first
interface Subcontractor {
  id: string;
  name: string;
  address: string;
  director: string;
  siret: string;
  insurance: string;
  qualifications: string[];
}

interface AddSubcontractorModalProps {
  onClose: () => void;
  onSave: (subcontractor: Subcontractor) => void;
  existingSubcontractor?: Subcontractor | null;
}

interface SubcontractorFormState {
  name: string;
  address: string;
  director: string;
  siret: string;
  insurance: string;
  qualifications: string[];
}

// Define TypeScript interfaces first
interface Mandataire {
  id: string;
  name: string;
  company: string;
  siret: string;
  email: string;
  phone: string;
  address: string;
}

interface AddMandataireModalProps {
  onClose: () => void;
  onSave: (mandataire: Mandataire) => void;
  existingMandataire?: Mandataire | null;
}

// Sample mandataires data
const mandataires: Mandataire[] = [
  {
    id: "M1",
    name: "Jean Dupont",
    company: "EcoRenovation SAS",
    siret: "12345678900001",
    email: "jean.dupont@ecorenovation.fr",
    phone: "01 23 45 67 89",
    address: "15 rue de la République, 75001 Paris"
  },
  {
    id: "M2",
    name: "Sophie Martin",
    company: "PrimeHabitat SARL",
    siret: "98765432100001",
    email: "s.martin@primehabitat.fr",
    phone: "01 98 76 54 32",
    address: "25 avenue des Champs-Élysées, 75008 Paris"
  },
  {
    id: "M3",
    name: "Pierre Leblanc",
    company: "RenovPrime",
    siret: "56789123400001",
    email: "p.leblanc@renovprime.fr",
    phone: "01 56 78 91 23",
    address: "8 boulevard Haussmann, 75009 Paris"
  },
  {
    id: "M4",
    name: "Marie Dubois",
    company: "PrimeEco Consulting",
    siret: "45612378900001",
    email: "m.dubois@primeecoconsulting.fr",
    phone: "01 45 61 23 78",
    address: "42 rue de Rivoli, 75004 Paris"
  }
];

// Add Information Modal Component
interface AddInformationModalProps {
  onClose: () => void;
  onSave: (info: string) => void;
  currentInfo: string;
}

const AddInformationModal: React.FC<AddInformationModalProps> = ({ onClose, onSave, currentInfo }) => {
  const [information, setInformation] = useState<string>(currentInfo);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(information);
    onClose();
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
                <InformationCircleIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Ajouter une information
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
            <div className="mb-6">
              <label htmlFor="information" className="block text-lg font-semibold text-gray-800 mb-3">
                Information complémentaire
              </label>
              <textarea
                id="information"
                value={information}
                onChange={(e) => setInformation(e.target.value)}
                rows={8}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ajoutez des informations supplémentaires concernant ce devis..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Ces informations seront ajoutées au devis dans la section &quot;Information complémentaire&quot;.
              </p>
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

// Add Mandataire Modal Component
const AddMandataireModal: React.FC<AddMandataireModalProps> = ({ onClose, onSave, existingMandataire }) => {
  // 1) Determine if we are editing
  const isEditMode = !!existingMandataire;

  // 2) Title changes if we’re in edit mode
  const modalTitle = isEditMode ? "Modifier un mandataire" : "Ajouter un mandataire";

  // 3) If editing, pre-select the existing mandataire ID
  const [selectedMandataire, setSelectedMandataire] = useState<string>(
    existingMandataire ? existingMandataire.id : ""
  );
  // const [selectedMandataire, setSelectedMandataire] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredMandataires, setFilteredMandataires] = useState<Mandataire[]>(mandataires);

  // Filter as user types
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredMandataires(mandataires);
    } else {
      const filtered = mandataires.filter(
        m => m.name.toLowerCase().includes(term.toLowerCase()) || 
             m.company.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMandataires(filtered);
    }
  };

  const handleSelectMandataire = (id: string) => {
    setSelectedMandataire(id);
  };

  // 4) On submit, if we have a selectedMandataire, pass that to onSave
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMandataire) {
      alert("Veuillez sélectionner un mandataire");
      return;
    }
    const mandataire = mandataires.find(m => m.id === selectedMandataire);
    if (mandataire) {
      onSave(mandataire);
      onClose();
    }
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
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              {/* Dynamically show the modal title */}
              <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
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
              {/* Warning */}
              <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800">
                <div className="flex items-center gap-2">
                  <ExclamationCircleIcon className="h-6 w-6 text-amber-600" />
                  <h3 className="font-bold">ATTENTION :</h3>
                </div>
                <p className="mt-1">
                  En l&apos;absence de la civilité et du numéro de dossier MPR dans la fiche client, 
                  les documents MAPRIMERENOV ne seront pas générés.
                </p>
              </div>
              
              {/* Search and select */}
              <div className="mb-4">
                <label
                  htmlFor="searchMandataire"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rechercher un mandataire
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="searchMandataire"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Rechercher par nom ou entreprise..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionnez un mandataire
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {filteredMandataires.length === 0 ? (
                    <p className="text-gray-500 text-sm italic p-2">
                      Aucun mandataire ne correspond à votre recherche.
                    </p>
                  ) : (
                    filteredMandataires.map(mandataire => (
                      <div 
                        key={mandataire.id}
                        onClick={() => handleSelectMandataire(mandataire.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedMandataire === mandataire.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{mandataire.name}</h4>
                            <p className="text-sm text-gray-600">{mandataire.company}</p>
                          </div>
                          {selectedMandataire === mandataire.id && (
                            <CheckIcon className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          SIRET: {mandataire.siret}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Display selected mandataire details */}
              {selectedMandataire && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Détails du mandataire sélectionné
                  </h4>
                  {(() => {
                    const mandataire = mandataires.find(m => m.id === selectedMandataire);
                    if (!mandataire) return null;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-1">{mandataire.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Téléphone:</span>
                          <span className="ml-1">{mandataire.phone}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Adresse:</span>
                          <span className="ml-1">{mandataire.address}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
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

// Define sample services data - this should be imported or passed as props in a real app
const serviceOptions: {
  id: string;
  name: string;
  reference: string;
  price: number;
  tva: number;
  description: string;
}[] = [
  { 
    id: 'S1', 
    name: 'Installation PAC', 
    reference: 'FORFAIT POSE PAC', 
    price: 2500, 
    tva: 10, 
    description: '- Pose et installation complète d\'une pompe à chaleur air/eau\n- Forfait déplacement et mise en service comprise\n- Installation d\'un ballon tampon 25L: Bouteilles de mélange et de décantation, pour installations de chauffage corps acier, jaquette skaï, Isolation 35 mm réversibles droite ou gauche de la chaudière pose murale livrée avec 4 bouchons pour circuits inutilisés\n- Raccordement aux réseaux hydrauliques et électriques\n- Mise en service et réglages optimaux du système'
  },
  { 
    id: 'S2', 
    name: 'Mise en service', 
    reference: 'MES-PAC', 
    price: 500, 
    tva: 10, 
    description: '- Mise en service du système avec tests et réglages optimaux\n- Vérification de la pression et des températures\n- Paramétrage de la régulation selon les besoins du client\n- Formation à l\'utilisation et aux réglages\n- Démonstration des fonctions principales et des programmes\n- Remise du carnet d\'utilisation et d\'entretien'
  },
  { 
    id: 'S3', 
    name: 'Dépose ancienne chaudière', 
    reference: 'DEP-CHAUD', 
    price: 800, 
    tva: 10, 
    description: '- Retrait et évacuation de l\'ancienne chaudière selon normes environnementales\n- Débranchement de tous les raccords (électriques, hydrauliques, évacuation)\n- Vidange du circuit de chauffage\n- Nettoyage de l\'emplacement de l\'ancienne chaudière\n- Transport et traitement des déchets dans un centre agréé\n- Certificat de recyclage remis au client'
  },
  { 
    id: 'S4', 
    name: 'Pose Chauffe-Eau Thermodynamique', 
    reference: 'FORFAIT POSE CHAUFFE-EAU THERMODYNAMIQUE', 
    price: 850, 
    tva: 10, 
    description: '- Pose et installation complète d\'un chauffe-eau thermodynamique\n- Forfait déplacement et mise en service comprise\n- Raccordement aux réseaux hydrauliques et électriques\n- Évacuation de l\'ancien équipement selon les normes en vigueur\n- Test et mise en service\n- Formation à l\'utilisation et explication des différents modes\n- Vérification du bon fonctionnement et réglages optimaux'
  },
  { 
    id: 'S5', 
    name: 'Adaptation Électrique', 
    reference: 'ADAPT-ELEC', 
    price: 350, 
    tva: 10, 
    description: '- Adaptation du tableau électrique pour nouvel équipement\n- Pose et raccordement d\'un disjoncteur différentiel dédié 30mA\n- Tirage d\'une ligne électrique adaptée à la puissance de l\'équipement\n- Mise à la terre conforme aux normes NF C 15-100\n- Test de sécurité électrique\n- Vérification des connexions et de la résistance des circuits'
  },
  { 
    id: 'S6', 
    name: 'Adaptation Réseau Hydraulique', 
    reference: 'ADAPT-HYDR', 
    price: 650, 
    tva: 10, 
    description: '- Modification du réseau hydraulique pour installation optimale\n- Pose de vannes d\'isolement et de purge\n- Installation d\'un groupe de sécurité\n- Raccordement à l\'évacuation des condensats\n- Pose de flexibles anti-vibrations\n- Test d\'étanchéité du circuit\n- Équilibrage du réseau et réglage des débits'
  }
];

type TableItem = Product | Service | Operation;

// SizingNoteModal component with proper types
const SizingNoteModal: React.FC<SizingNoteModalProps> = ({ onClose, onSave, productCode, productDetails, existingNote }) => {
  // Initialize state for all form fields
  const [formData, setFormData] = useState({
    buildingType: existingNote?.buildingType || "RT 2012",
    radiatorType: existingNote?.radiatorType || "Plancher chauffant",
    waterTemperature: existingNote?.waterTemperature || "Basse Température",
    heatedArea: existingNote?.heatedArea || "",
    ceilingHeight: existingNote?.ceilingHeight || "",
    baseTemperature: existingNote?.baseTemperature || -7,
    desiredTemperature: existingNote?.desiredTemperature || 19,
    altitude: existingNote?.altitude || 152
  });

  // Calculate sizing values based on form data
  const calculateSizingValues = () => {
    // Parse input values
    const heatedArea = parseFloat(formData.heatedArea) || 0;
    const ceilingHeight = parseFloat(formData.ceilingHeight) || 0;
    const desiredTemperature = parseFloat(formData.desiredTemperature.toString()) || 19;
    const baseTemperature = parseFloat(formData.baseTemperature.toString()) || -7;
    
    // Construction coefficient (based on building type)
  let constructionCoef = 1;
  switch (formData.buildingType) {
    case "RT 2020": constructionCoef = 0.6; break;
    case "RT 2012": constructionCoef = 0.6; break; // Changed from 0.8 to 0.6
    case "RT 2005": constructionCoef = 0.8; break; // Changed from 1 to 0.8
    case "RT 2000": constructionCoef = 0.9; break; // Changed from 1.2 to 0.9
    default: constructionCoef = 1;
  }
    
    // Volume calculation
    const volume = heatedArea * ceilingHeight;
    
    // Heat loss calculation
    const heatLoss = (desiredTemperature - baseTemperature) * constructionCoef * volume;
    
    // If there's no product details or the values aren't valid, return empty object
    if (!heatedArea || !ceilingHeight) {
      return null;
    }
    
    // Return calculated values
    return {
      volume: volume.toFixed(2),
      heatLoss: heatLoss.toFixed(2),
      dimensioning: Math.round(heatLoss / 1000).toString(), // Convert to kW
      coverage: 100, // Assuming 100% coverage
      constructionCoef
    };
  };

  // Type for form field changes
  type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calculatedValues = calculateSizingValues();
    if (!calculatedValues) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Prepare sizing note data
    const sizingNote: SizingNote = {
      id: existingNote?.id, // Keep existing ID for updates
      productType: productDetails?.name || "Pompe à chaleur",
      productBrand: productDetails?.brand || "Non spécifié",
      productReference: productDetails?.reference || productCode,
      ...calculatedValues,
      ...formData
    };
    
    onSave(sizingNote);
    onClose();
  };

  // Determine product type based on productCode
  const getProductType = () => {
    if (productCode === "BAR-TH-171") return "Pompe à chaleur";
    if (productCode === "BAR-TH-113") return "Chaudière biomasse";
    if (productCode === "BAR-TH-143") return "Système solaire combiné";
    return "Équipement";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl w-full max-w-6xl m-4 overflow-hidden shadow-2xl"
      >
        {/* Modal header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <DocumentCheckIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Ajouter une note de dimensionnement
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
        
        {/* Modal body - Changed to flex layout to add images on right */}
        <div className="p-6 max-h-[80vh] overflow-y-auto flex flex-row">
          {/* Left column: Form */}
          <div className="flex-1 pr-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Note de dimensionnement pour {getProductType()} ({productCode})
                  </h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="buildingType" className="block text-sm font-medium text-gray-700 mb-1">
                    Sélectionner un type de logement
                  </label>
                  <select
                    id="buildingType"
                    name="buildingType"
                    value={formData.buildingType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="RT 2020">RT 2020 (Construit après le 1er Janvier 2022)</option>
                    <option value="RT 2012">RT 2012 (Construit après le 1er Janvier 2013)</option>
                    <option value="RT 2005">RT 2005 (Construit après le 1er Janvier 2006)</option>
                    <option value="RT 2000">RT 2000 (Construit après le 1er Janvier 2001)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="radiatorType" className="block text-sm font-medium text-gray-700 mb-1">
                    Sélectionner un type de radiateur
                  </label>
                  <select
                    id="radiatorType"
                    name="radiatorType"
                    value={formData.radiatorType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="Fonte">Fonte</option>
                    <option value="Acier">Acier</option>
                    <option value="Plancher chauffant">Plancher chauffant</option>
                    <option value="Alu">Alu</option>
                    <option value="Electrique">Electrique</option>
                    <option value="Aucun">Aucun</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="waterTemperature" className="block text-sm font-medium text-gray-700 mb-1">
                    Sélectionner la température de l&apos;eau
                  </label>
                  <select
                    id="waterTemperature"
                    name="waterTemperature"
                    value={formData.waterTemperature}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="Haute Température">Haute Température</option>
                    <option value="Moyenne Température">Moyenne Température</option>
                    <option value="Basse Température">Basse Température</option>
                    <option value="Ne pas renseigner">Ne pas renseigner</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="heatedArea" className="block text-sm font-medium text-gray-700 mb-1">
                    Surface chauffée (m²)*
                  </label>
                  <input
                    type="number"
                    id="heatedArea"
                    name="heatedArea"
                    value={formData.heatedArea}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label htmlFor="ceilingHeight" className="block text-sm font-medium text-gray-700 mb-1">
                    Hauteur sous plafond (m)*
                  </label>
                  <input
                    type="number"
                    id="ceilingHeight"
                    name="ceilingHeight"
                    value={formData.ceilingHeight}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label htmlFor="baseTemperature" className="block text-sm font-medium text-gray-700 mb-1">
                    Température de base (°C)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="baseTemperature"
                      name="baseTemperature"
                      value={formData.baseTemperature}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Vérifier et modifier, si nécessaire la température en vous référant à la carte
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="desiredTemperature" className="block text-sm font-medium text-gray-700 mb-1">
                    Température ambiante souhaitée (°C)
                  </label>
                  <input
                    type="number"
                    id="desiredTemperature"
                    name="desiredTemperature"
                    value={formData.desiredTemperature}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label htmlFor="altitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Altitude (m)
                  </label>
                  <input
                    type="number"
                    id="altitude"
                    name="altitude"
                    value={formData.altitude}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
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
          
          {/* Right column: Reference images */}
          <div className="w-1/3 flex flex-col space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-2 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Carte des températures de base</h4>
              </div>
              <div className="p-2">
                <img 
                  src="/carte.png" 
                  alt="Carte des températures de base" 
                  className="w-full h-auto rounded" 
                />
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-2 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Tableau de référence</h4>
              </div>
              <div className="p-2">
                <img 
                  src="/tableau.png" 
                  alt="Tableau de référence pour le dimensionnement" 
                  className="w-full h-auto rounded" 
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Document status badge component
const DocumentStatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "brouillon":
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: <PencilIcon className="h-4 w-4 mr-1" />,
          label: "Brouillon"
        };
      case "envoyé":
        return { 
          bgColor: "bg-blue-100", 
          textColor: "text-blue-800",
          icon: <EnvelopeIcon className="h-4 w-4 mr-1" />,
          label: "Envoyé"
        };
      case "signé":
        return { 
          bgColor: "bg-green-100", 
          textColor: "text-green-800",
          icon: <CheckIcon className="h-4 w-4 mr-1" />,
          label: "Signé"
        };
      case "payé":
        return { 
          bgColor: "bg-purple-100", 
          textColor: "text-purple-800",
          icon: <CurrencyEuroIcon className="h-4 w-4 mr-1" />,
          label: "Payé"
        };
      case "refusé":
        return { 
          bgColor: "bg-red-100", 
          textColor: "text-red-800",
          icon: <XMarkIcon className="h-4 w-4 mr-1" />,
          label: "Refusé"
        };
      case "expiré":
        return { 
          bgColor: "bg-amber-100", 
          textColor: "text-amber-800",
          icon: <ClockIcon className="h-4 w-4 mr-1" />,
          label: "Expiré"
        };
      default:
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: null,
          label: status
        };
    }
  };

  const { bgColor, textColor, icon, label } = getStatusInfo();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

// Add Subcontractor Modal component
const AddSubcontractorModal: React.FC<AddSubcontractorModalProps> = ({
  onClose,
  onSave,
  existingSubcontractor,
}) => {
  // Detect if we are editing
  const isEditMode = !!existingSubcontractor; 

  // When editing, load that subcontractor into local state
  const [subcontractorInfo, setSubcontractorInfo] = useState<SubcontractorFormState>({
    name: existingSubcontractor?.name || "",
    address: existingSubcontractor?.address || "",
    director: existingSubcontractor?.director || "",
    siret: existingSubcontractor?.siret || "",
    insurance: existingSubcontractor?.insurance || "",
    qualifications: existingSubcontractor?.qualifications || []
  });

  // We can hide or reuse "addNew" logic if we want
  const [addNew, setAddNew] = useState<boolean>(!isEditMode); 
  // If isEditMode=true, we skip the "select from existing" flow.

  const [selectedSubcontractor, setSelectedSubcontractor] = useState<string>("");
  const [qualification, setQualification] = useState<string>("");
  
  // Searchable dropdown state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter subcontractors based on search query
  const filteredSubcontractors = subcontractors.filter(sc => 
    sc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sc.siret.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Possibly hide the "select an existing subcontractor" step if isEditMode
  // ...

  // Handlers below
  const handleSelectSubcontractor = (selected: string) => {
    // If user picks a known subcontractor
    setSelectedSubcontractor(selected);
    setIsDropdownOpen(false);

    if (selected) {
      const sub = subcontractors.find(sc => sc.id === selected);
      if (sub) {
        setSubcontractorInfo({
          name: sub.name,
          address: sub.address,
          director: sub.director,
          siret: sub.siret,
          insurance: sub.insurance,
          qualifications: [...sub.qualifications]
        });
      }
    } else {
      // Reset the form
      setSubcontractorInfo({
        name: "",
        address: "",
        director: "",
        siret: "",
        insurance: "",
        qualifications: []
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubcontractorInfo(prev => ({ ...prev, [name]: value }));
  };

  // Add / Remove qualifications
  const handleAddQualification = () => {
    if (qualification.trim()) {
      setSubcontractorInfo(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, qualification]
      }));
      setQualification("");
    }
  };

  const handleRemoveQualification = (index: number) => {
    setSubcontractorInfo(prev => {
      const newQuals = [...prev.qualifications];
      newQuals.splice(index, 1);
      return { ...prev, qualifications: newQuals };
    });
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      // We are truly editing the existing subcontractor
      const updatedSubcontractor: Subcontractor = {
        // Keep the existing ID if you have it
        id: existingSubcontractor!.id, 
        ...subcontractorInfo
      };
      onSave(updatedSubcontractor);
      onClose();
      return;
    }

    // Otherwise, the old approach: pick existing or add new
    if (addNew) {
      const newId = `SC${Math.floor(Math.random() * 1000)}`;
      const newSubcontractor: Subcontractor = {
        id: newId,
        ...subcontractorInfo
      };
      onSave(newSubcontractor);
      onClose();
    } else {
      // Using an existing subcontractor from the dropdown
      const chosen = subcontractors.find(sc => sc.id === selectedSubcontractor);
      if (!chosen) {
        alert("Veuillez sélectionner un sous-traitant");
        return;
      }
      onSave(chosen);
      onClose();
    }
  };

  // Title changes if editing
  const modalTitle = isEditMode
    ? "Modifier un sous-traitant"
    : addNew
      ? "Ajouter un nouveau sous-traitant"
      : "Sélectionner un sous-traitant";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl w-full max-w-3xl m-4 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* If we are editing an existing sub, skip the "Add New" checkbox + select. */}
            {!isEditMode && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input 
                    type="checkbox" 
                    id="addNew" 
                    checked={addNew}
                    onChange={() => setAddNew(!addNew)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="addNew" className="ml-2 text-sm text-gray-700">
                    Ajouter un nouveau sous-traitant
                  </label>
                </div>

                {/* If not "addNew", show the dropdown to pick an existing sub */}
                {!addNew && (
                  <div className="mb-4">
                    <label
                      htmlFor="subcontractor"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sélectionnez un sous-traitant
                    </label>
                    
                    {/* Custom searchable dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <div 
                        className="flex items-center justify-between w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {selectedSubcontractor 
                            ? subcontractors.find(sc => sc.id === selectedSubcontractor)?.name || '-- Sélectionnez un sous-traitant --'
                            : '-- Sélectionnez un sous-traitant --'
                          }
                        </div>
                        <svg 
                          className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      
                      {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                          <div className="sticky top-0 bg-white border-b border-gray-300">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                              </div>
                              <input
                                type="text"
                                id="subcontractorSearch"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher par nom ou SIRET..."
                                className="w-full pl-10 py-2.5 px-3 border-0 text-sm focus:ring-0 focus:outline-none"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          
                          <div className="max-h-60 overflow-y-auto">
                            {filteredSubcontractors.length === 0 ? (
                              <div className="p-3 text-gray-500 text-center">Aucun sous-traitant trouvé</div>
                            ) : (
                              <ul>
                                <li 
                                  className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                                  onClick={() => handleSelectSubcontractor("")}
                                >
                                  -- Sélectionnez un sous-traitant --
                                </li>
                                {filteredSubcontractors.map(sc => (
                                  <li 
                                    key={sc.id} 
                                    className={`p-2.5 hover:bg-blue-50 cursor-pointer ${selectedSubcontractor === sc.id ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleSelectSubcontractor(sc.id)}
                                  >
                                    <div className="font-medium">{sc.name}</div>
                                    <div className="text-xs text-gray-500">SIRET: {sc.siret}</div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Now the common form fields, used for either Add or Edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;entreprise*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={subcontractorInfo.name}
                  onChange={handleChange}
                  disabled={!addNew && !isEditMode && !!selectedSubcontractor}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirigeant*
                </label>
                <input
                  type="text"
                  id="director"
                  name="director"
                  value={subcontractorInfo.director}
                  onChange={handleChange}
                  disabled={!addNew && !isEditMode && !!selectedSubcontractor}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse*
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={subcontractorInfo.address}
                onChange={handleChange}
                disabled={!addNew && !isEditMode && !!selectedSubcontractor}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro SIRET*
                </label>
                <input
                  type="text"
                  id="siret"
                  name="siret"
                  value={subcontractorInfo.siret}
                  onChange={handleChange}
                  disabled={!addNew && !isEditMode && !!selectedSubcontractor}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
                  N° Décennale*
                </label>
                <input
                  type="text"
                  id="insurance"
                  name="insurance"
                  value={subcontractorInfo.insurance}
                  onChange={handleChange}
                  disabled={!addNew && !isEditMode && !!selectedSubcontractor}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Qualifications */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications RGE
              </label>
              {/* Only allow adding/removing if "addNew" or "isEditMode" */}
              {(addNew || isEditMode) && (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="Ex: RGE QualiPac..."
                    className="flex-grow border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddQualification}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="space-y-2 mt-2">
                {subcontractorInfo.qualifications.map((qual, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm">{qual}</span>
                    {(addNew || isEditMode) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                {subcontractorInfo.qualifications.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Aucune qualification ajoutée
                  </p>
                )}
              </div>
            </div>

            {/* Footer actions */}
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
                {isEditMode ? "Enregistrer les modifications" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Signature status badge component
const SignatureStatusBadge: React.FC<{ status: SignatureStatus }> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "non_demandé":
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: <XMarkIcon className="h-4 w-4 mr-1" />,
          label: "Non demandé"
        };
      case "en_attente":
        return { 
          bgColor: "bg-amber-100", 
          textColor: "text-amber-800",
          icon: <ClockIcon className="h-4 w-4 mr-1" />,
          label: "En attente"
        };
      case "signé":
        return { 
          bgColor: "bg-green-100", 
          textColor: "text-green-800",
          icon: <CheckIcon className="h-4 w-4 mr-1" />,
          label: "Signé"
        };
      case "refusé":
        return { 
          bgColor: "bg-red-100", 
          textColor: "text-red-800",
          icon: <XMarkIcon className="h-4 w-4 mr-1" />,
          label: "Refusé"
        };
      default:
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: null,
          label: status
        };
    }
  };

  const { bgColor, textColor, icon, label } = getStatusInfo();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

// Deal Selection Modal
const DealSelectionModal: React.FC<{
  onClose: () => void;
  onSelect: (dealId: string) => void;
}> = ({ onClose, onSelect }) => {
  // Deals data - only "Deal vierge" and "Effy" as requested
  const deals = [
    { id: 'CEE', name: 'Deal vierge', ratio: 0.0000 },
    { id: 'EFFY', name: 'EFFY', ratio: 0.0065 }
  ];

  // State for managing the dropdown
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedDeal, setSelectedDeal] = useState<{id: string, name: string, ratio: number} | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter deals based on search term
  const filteredDeals = deals.filter(deal => 
    deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  // Handle deal selection
  const handleDealSelect = (deal: {id: string, name: string, ratio: number}) => {
    setSelectedDeal(deal);
    setSearchTerm(deal.name);
    setIsDropdownOpen(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDeal) {
      onSelect(selectedDeal.id);
    } else if (filteredDeals.length === 1) {
      // If there's only one match and user submits, select that match
      onSelect(filteredDeals[0].id);
    } else {
      // Optional: show a validation message that they need to select a deal
      alert("Veuillez sélectionner un deal de la liste");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl w-full max-w-md m-4 overflow-visible shadow-2xl" // Changed overflow to visible
      >
        {/* Modal header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Sélectionner un deal
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
        
        {/* Modal body with improved dropdown */}
        <div className="p-6 relative">
          <form onSubmit={handleSubmit}>
            <div className="mb-6" ref={dropdownRef}>
              <label htmlFor="dealSearch" className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher ou sélectionner un deal
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="dealSearch"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Rechercher un deal..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <div 
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {isDropdownOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Improved dropdown menu with fixed z-index and positioning */}
              {isDropdownOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 left-0 right-0">
                  {filteredDeals.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto">
                      {filteredDeals.map(deal => (
                        <li 
                          key={deal.id}
                          onClick={() => handleDealSelect(deal)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                              <LinkIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{deal.name}</div>
                              {/* <div className="text-sm text-gray-500">Ratio: {deal.ratio}€/kWh cumac</div> */}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Aucun deal trouvé
                    </div>
                  )}
                </div>
              )}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                disabled={!selectedDeal && filteredDeals.length !== 1}
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// First, let's modify the ActionMenu component to add the Deal selection functionality
const ActionMenu: React.FC<{
  onAction: (action: string, productCode?: string) => void;
  onShowDealModal: () => void;
  tableItems?: TableItem[];

  // NEW
  hasMandataire: boolean;
  hasSubcontractor: boolean;
  hasInformation: boolean;
  hasFinancing: boolean;
  hasMairie: boolean;
  hasDeal: boolean;
  hasDivision: boolean;
}> = ({
  onAction,
  onShowDealModal,
  tableItems = [],
  
  hasMandataire,
  hasSubcontractor,
  hasInformation,
  hasFinancing,
  hasMairie,
  hasDeal,
  // hasDivision
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Example: figure out if your tableItems includes references that matter
  const specificProductCodes = useMemo(() => {
    const specificCodes = ["BAR-TH-171", "BAR-TH-113", "BAR-TH-143"];
    return tableItems
      .filter(item => item.reference && specificCodes.includes(item.reference))
      .map(item => item.reference)
      .filter((value, index, self) => self.indexOf(value) === index);
  }, [tableItems]);

  // Build the base actions, conditionally changing labels
  const baseActions = [
    {
      id: "addSubcontractor",
      label: hasSubcontractor
        ? "Modifier un sous-traitant"
        : "Ajouter un sous-traitant",
      icon: hasSubcontractor
        ? <PencilIcon className="h-5 w-5 text-gray-500" />
        : <UserGroupIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "addAgent",
      label: hasMandataire
        ? "Modifier un mandataire"
        : "Ajouter un mandataire",
      icon: hasMandataire
        ? <PencilIcon className="h-5 w-5 text-gray-500" />
        : <UserIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "addInfo",
      label: hasInformation
        ? "Modifier une information"
        : "Ajouter une information",
      icon: hasInformation
        ? <PencilIcon className="h-5 w-5 text-gray-500" />
        : <InformationCircleIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "addProduct",
      label: "Ajouter un produit",
      icon: <ShoppingCartIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "addService",
      label: "Ajouter une prestation",
      icon: <WrenchScrewdriverIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "addFunding",
      label: hasFinancing
        ? "Modifier un financement"
        : "Ajouter un financement",
      icon: hasFinancing
        ? <PencilIcon className="h-5 w-5 text-gray-500" />
        : <BanknotesIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "addMairie",
      label: hasMairie
        ? "Modifier une DP Mairie"
        : "Ajouter une DP Mairie",
      icon: hasMairie
        ? <PencilIcon className="h-5 w-5 text-gray-500" />
        : <BuildingLibraryIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "assignToDeal",
      label: hasDeal
        ? "Modifier le deal"
        : "Affecter à un deal",
      icon: hasDeal
        ? <PencilIcon className="h-5 w-5 text-gray-500" />
        : <LinkIcon className="h-5 w-5 text-gray-500" />
    },
    // {
    //   id: "addDivision",
    //   label: hasDivision
    //     ? "Modifier une indivision"
    //     : "Ajouter une indivision",
    //   icon: hasDivision
    //     ? <PencilIcon className="h-5 w-5 text-gray-500" />
    //     : <UsersIcon className="h-5 w-5 text-gray-500" />
    // },
    {
      id: "addDocument",
      label: "Ajouter un document au devis",
      icon: <FolderPlusIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "modifyPrime",
      label: "Modifier une prime",
      icon: <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "addOperation",
      label: "Ajouter une opération",
      icon: <PlusIcon className="h-5 w-5 text-gray-500" />
    },
    {
      id: "deleteQuote",
      label: "Supprimer le devis",
      icon: <TrashIcon className="h-5 w-5 text-red-500" />
    }
  ];
  

  // Insert sizing note actions if relevant
  const actions = useMemo(() => {
    let allActions = [...baseActions];
    if (specificProductCodes.length > 0) {
      const deleteQuoteIndex = allActions.findIndex(action => action.id === "deleteQuote");
      const sizingNoteActions = specificProductCodes.map(code => ({
        id: `sizingNote_${code}`,
        label: `Note de dimensionnement ${code}`,
        icon: <DocumentCheckIcon className="h-5 w-5 text-gray-500" />
      }));
      
      allActions = [
        ...allActions.slice(0, deleteQuoteIndex),
        ...sizingNoteActions,
        ...allActions.slice(deleteQuoteIndex)
      ];
    }
    return allActions;
  }, [baseActions, specificProductCodes]);

  const handleActionClick = (actionId: string) => {
    if (actionId === "assignToDeal") {
      setIsOpen(false);
      onShowDealModal();
    } else if (actionId.startsWith("sizingNote_")) {
      const productCode = actionId.replace("sizingNote_", "");
      onAction(actionId, productCode);
      setIsOpen(false);
    } else {
      onAction(actionId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span>Actions</span>
        <EllipsisHorizontalIcon className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200"
            >
              <div className="py-1">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                      action.id === "deleteQuote" 
                        ? "text-red-600 hover:bg-red-50" 
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


// Enhanced subcontractor data
const subcontractors = [
  { 
    id: 'SC1', 
    name: 'EcoChauffage SARL',
    address: '15 RUE DES ARTISANS 75011 PARIS',
    director: 'MARTIN DUBOIS',
    siret: '78945612300014',
    insurance: 'D78945X',
    qualifications: ['RGE QualiPac: QPAC/12345 (Valide du 15/02/2023 au 15/02/2024)', 'RGE QualiSol: QS/12345 (Valide du 10/03/2023 au 10/03/2024)']
  },
  { 
    id: 'SC2', 
    name: 'ThermiPro',
    address: '8 AVENUE DU GÉNÉRAL LECLERC 92100 BOULOGNE-BILLANCOURT',
    director: 'SOPHIE LAURENT',
    siret: '65478932100025',
    insurance: 'T65478Y',
    qualifications: ['RGE QualiPac: QPAC/78945 (Valide du 05/01/2023 au 05/01/2024)', 'RGE QualiPV: QPV/78945 (Valide du 20/06/2023 au 20/06/2024)'] 
  },
  { 
    id: 'SC3', 
    name: 'EnergySolution',
    address: '25 RUE DE LA RÉPUBLIQUE 69001 LYON',
    director: 'PIERRE DUPONT',
    siret: '12345678900036',
    insurance: 'E12345Z',
    qualifications: ['RGE QualiPac: QPAC/45678 (Valide du 12/04/2023 au 12/04/2024)', 'RGE QualiBois: QB/45678 (Valide du 03/05/2023 au 03/05/2024)', 'RGE QualiSol: QS/45678 (Valide du 15/07/2023 au 15/07/2024)'] 
  },
  { 
    id: 'SC4', 
    name: 'SASHAYNO',
    address: '2 RUE DU NOUVEAU BERCY 94220 CHARENTON LE PONT',
    director: 'DAHAN BARUK',
    siret: '82255743500051',
    insurance: 'SA82255Z',
    qualifications: ['RGE QualiSol: QS/65582 (Valide du 07/01/2023 au 07/01/2024)', 'RGE QualiPac: QPAC/65582 (Valide du 07/01/2023 au 07/01/2024)'] 
  }
];

// Enhanced product data
const products = [
  { 
    id: 'P1', 
    name: 'Daikin 14KW MONO Altherma 3 HMT - BI BLOC', 
    brand: 'Daikin',
    reference: 'ALTHERMA-3-HMT-14KW',
    price: 8500, 
    tva: 5.5, 
    kwhCumac: 615400,
    description: 'Marque : DAIKIN\nRéférence : ALTHERMA 3 HMT-14KW\n- Puissance calorifique: +7 °C / +35 °C: 14 KW\n- COP +7 °C / +55 °C: 2.60\n- Gaz frigorigène: R410A\n- Classe énergétique (chauffage +55°C): A++\n- RENDEMENT ENERGETIQUE Eta wh: 127%\n- Température de fonctionnement C°: -25 à 35\n- Pression acoustique intérieure (dB): 42\n- Pression acoustique extérieure (dB): 49\n- Dimensions unité intérieure (HxLxP): 840x440x390 mm\n- Dimensions unité extérieure (HxLxP): 1440x1160x380 mm\n- Poids unité intérieure: 38 kg\n- Poids unité extérieure: 102 kg',
    serviceDescription: '- Pose et installation complète d\'une pompe à chaleur air/eau\n- Forfait déplacement et mise en service comprise\n- Installation d\'un ballon tampon 25L: Bouteilles de mélange et de décantation, pour installations de chauffage corps acier, jaquette skaï, Isolation 35 mm réversibles droite ou gauche de la chaudière pose murale livrée avec 4 bouchons pour circuits inutilisés',
    serviceReference: 'FORFAIT POSE PAC',
    servicePrice: 2750,
    serviceTva: 10,
    temperatureType: 'Basse Température'
  },
  { 
    id: 'P2', 
    name: 'Mitsubishi Ecodan Hydrobox 11kW', 
    brand: 'Mitsubishi',
    reference: 'ECODAN-HB-11KW',
    price: 7200, 
    tva: 5.5, 
    kwhCumac: 555320,
    description: 'Marque : MITSUBISHI\nRéférence : ECODAN HYDROBOX 11KW\n- Puissance calorifique: +7 °C / +35 °C: 11 KW\n- COP +7 °C / +35 °C: 4.52\n- Gaz frigorigène: R32\n- Classe énergétique (chauffage +35°C): A+++\n- RENDEMENT ENERGETIQUE Eta wh: 132%\n- Température de fonctionnement C°: -20 à 40\n- Pression acoustique intérieure (dB): 38\n- Pression acoustique extérieure (dB): 45\n- Dimensions unité intérieure (HxLxP): 800x530x360 mm\n- Dimensions unité extérieure (HxLxP): 1020x1050x330 mm\n- Poids unité intérieure: 42 kg\n- Poids unité extérieure: 94 kg',
    serviceDescription: '- Pose et installation complète d\'une pompe à chaleur air/eau\n- Forfait déplacement et mise en service comprise\n- Installation d\'un ballon tampon 25L: Bouteilles de mélange et de décantation, pour installations de chauffage corps acier, jaquette skaï, Isolation 35 mm',
    serviceReference: 'FORFAIT POSE PAC',
    servicePrice: 2500,
    serviceTva: 10,
    temperatureType: 'Basse Température'
  },
  { 
    id: 'P3', 
    name: 'Atlantic Alfea Excellia 16kW', 
    brand: 'Atlantic',
    reference: 'ALFEA-EXC-16KW',
    price: 9300, 
    tva: 5.5, 
    kwhCumac: 628730,
    description: 'Marque : ATLANTIC\nRéférence : ALFEA EXCELLIA 16KW\n- Puissance calorifique: +7 °C / +35 °C: 16 KW\n- COP +7 °C / +35 °C: 4.55\n- Gaz frigorigène: R410A\n- Classe énergétique (chauffage +35°C): A+++\n- RENDEMENT ENERGETIQUE Eta wh: 135%\n- Température de fonctionnement C°: -20 à 35\n- Pression acoustique intérieure (dB): 39\n- Pression acoustique extérieure (dB): 48\n- Dimensions unité intérieure (HxLxP): 847x448x482 mm\n- Dimensions unité extérieure (HxLxP): 1428x1080x480 mm\n- Poids unité intérieure: 53 kg\n- Poids unité extérieure: 128 kg',
    serviceDescription: '- Pose et installation complète d\'une pompe à chaleur air/eau\n- Forfait déplacement et mise en service comprise\n- Installation d\'un ballon tampon 25L: Bouteilles de mélange et de décantation, pour installations de chauffage corps acier, jaquette skaï, Isolation 35 mm réversibles droite ou gauche de la chaudière pose murale livrée avec 4 bouchons pour circuits inutilisés',
    serviceReference: 'FORFAIT POSE PAC',
    servicePrice: 2800,
    serviceTva: 10,
    temperatureType: 'Moyenne Température'
  },
  { 
    id: 'P4', 
    name: 'THERMOR Aeromax 5 - 200L', 
    brand: 'THERMOR',
    reference: 'AEROMAX-5-200L',
    price: 3200, 
    tva: 5.5, 
    kwhCumac: 164800,
    description: 'Marque : THERMOR\nRéférence : AEROMAX 5 - 200L\n- Capacité : 200L\n- Profil de soutirage : L\n- COP à 7°C : 3,38 (Selon la norme EN 16147)\n- RENDEMENT ENERGETIQUE Eta wh : 133%\n- Puissance de la résistance (W) : 2450\n- Température de fonctionnement C° : -5 à 43\n- Pression acoustique (dB) : 50\n- Hauteur : 1693 mm\n- Poids à vide : 82 kg',
    serviceDescription: '- Pose et installation complète d\'un chauffe-eau thermodynamique\n- Forfait déplacement et mise en service comprise\n- Raccordement aux réseaux hydrauliques et électriques\n- Évacuation de l\'ancien équipement selon les normes en vigueur',
    serviceReference: 'FORFAIT POSE CHAUFFE-EAU THERMODYNAMIQUE',
    servicePrice: 850,
    serviceTva: 10,
    temperatureType: 'Haute Température'
  },
  { 
    id: 'P5', 
    name: 'ATLANTIC Calypso VM 200L', 
    brand: 'ATLANTIC',
    reference: 'CALYPSO-VM-200L',
    price: 3450, 
    tva: 5.5, 
    kwhCumac: 172500,
    description: 'Marque : ATLANTIC\nRéférence : CALYPSO VM 200L\n- Capacité : 200L\n- Profil de soutirage : L\n- COP à 7°C : 3,35 (Selon la norme EN 16147)\n- RENDEMENT ENERGETIQUE Eta wh : 135%\n- Puissance de la résistance (W) : 2400\n- Température de fonctionnement C° : -5 à 43\n- Pression acoustique (dB) : 46\n- Hauteur : 1617 mm\n- Diamètre : 620 mm\n- Poids à vide : 80 kg',
    serviceDescription: '- Pose et installation complète d\'un chauffe-eau thermodynamique\n- Forfait déplacement et mise en service comprise\n- Raccordement aux réseaux hydrauliques et électriques\n- Évacuation de l\'ancien équipement selon les normes en vigueur',
    serviceReference: 'FORFAIT POSE CHAUFFE-EAU THERMODYNAMIQUE',
    servicePrice: 850,
    serviceTva: 10,
    temperatureType: 'Haute Température'
  }
];

// Updated AddOperationModal with searchable dropdowns for products and subcontractors
const AddOperationModal: React.FC<{
  onClose: () => void;
  onSave: (operation: Partial<Operation>) => void;
  hasDeal: boolean;
  dealId?: string;
}> = ({ onClose, onSave, hasDeal }) => {
  const [step, setStep] = useState<'selectOperation' | 'fillDetails'>('selectOperation');
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  
  // Add state for product dropdown
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const productDropdownRef = useRef<HTMLDivElement>(null);
  
  // Add state for subcontractor dropdown
  const [subcontractorSearchQuery, setSubcontractorSearchQuery] = useState<string>('');
  const [isSubcontractorDropdownOpen, setIsSubcontractorDropdownOpen] = useState<boolean>(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<string>('');
  const subcontractorDropdownRef = useRef<HTMLDivElement>(null);
  
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [operation, setOperation] = useState<Partial<Operation>>({
    reference: '',
    name: '',
    quantity: 1,
    unitPriceHT: 0,
    unitPriceTTC: 0,
    tva: 5.5,
    totalHT: 0,
    totalTTC: 0,
    coupDePouceOperation: false,
    hasReceiveDimensionPaper: false
  });

  // Sample operation codes with their specific data
  const operationCodes = [
    { id: 'BAR-TH-101', name: 'BAR-TH-101', kwh: 510530, price: 6800, description: 'Chaudière individuelle à haute performance énergétique' },
    { id: 'BAR-TH-104', name: 'BAR-TH-104', kwh: 628730, price: 8200, description: 'Pompe à chaleur de type air/eau ou eau/eau' },
    { id: 'BAR-TH-106', name: 'BAR-TH-106', kwh: 435200, price: 5500, description: 'Chaudière individuelle à condensation' },
    { id: 'BAR-TH-112-Granulés', name: 'BAR-TH-112-Granulés', kwh: 950440, price: 12000, description: 'Appareil indépendant de chauffage au bois' },
    { id: 'BAR-TH-113', name: 'BAR-TH-113', kwh: 890210, price: 14000, description: 'Chaudière biomasse individuelle' },
    { id: 'BAR-TH-137', name: 'BAR-TH-137', kwh: 328400, price: 7500, description: 'Raccordement dun bâtiment résidentiel à un réseau de chaleur' },
    { id: 'BAR-TH-143', name: 'BAR-TH-143', kwh: 755300, price: 11500, description: 'Système solaire combiné (SSC)' },
    { id: 'BAR-TH-159', name: 'BAR-TH-159', kwh: 390800, price: 4900, description: 'Pompe à chaleur hybride individuelle' },
    { id: 'BAR-TH-171', name: 'BAR-TH-171', kwh: 615400, price: 9500, description: 'Isolation thermique des réseaux hydrauliques de chauffage' }
  ];

  // Boiler types
  const boilerTypes = ["Charbon", "Fioul", "Gaz", "Bois", "Électrique", "Autre"];
  
  // Housing types
  const housingTypes = ["Maison", "Appartement"];
  
  // Pump usage types
  const pumpUsages = ["Chauffage", "Chauffage et eau sanitaire"];

  // Dimensioning note options
  const dimensioningOptions = ["Oui", "Non", "Non applicable"];

  // Filter operations based on search term
  const filteredOperations = useMemo(() => {
    return operationCodes.filter(op => 
      op.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
      product.reference.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(productSearchQuery.toLowerCase()))
    );
  }, [productSearchQuery]);

  // Filter subcontractors based on search query
  const filteredSubcontractors = useMemo(() => {
    return subcontractors.filter(sc => 
      sc.name.toLowerCase().includes(subcontractorSearchQuery.toLowerCase()) ||
      sc.siret.toLowerCase().includes(subcontractorSearchQuery.toLowerCase()) ||
      sc.director.toLowerCase().includes(subcontractorSearchQuery.toLowerCase())
    );
  }, [subcontractorSearchQuery]);

  // Handle operation selection with price prefill
  const handleSelectOperation = (opCode: string) => {
    setSelectedOperation(opCode);
    const selectedOp = operationCodes.find(op => op.id === opCode);
    if (selectedOp) {
      setOperation({
        ...operation,
        reference: selectedOp.id,
        name: selectedOp.name,
        unitPriceTTC: selectedOp.price
      });
    }
    setStep('fillDetails');
    setShowDropdown(false);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Handle product selection with price update
  const handleProductSelect = (selectedId: string) => {
    setSelectedProductId(selectedId);
    setIsProductDropdownOpen(false);
    
    if (!selectedId) {
      setOperation({
        ...operation,
        productId: undefined
      });
      return;
    }
    
    const selectedProduct = products.find(p => p.id === selectedId);
    if (selectedProduct) {
      setOperation({
        ...operation,
        productId: selectedId,
        unitPriceTTC: selectedProduct.price
      });
    }
  };

  // Handle subcontractor selection
  const handleSubcontractorSelect = (selectedId: string) => {
    setSelectedSubcontractor(selectedId);
    setIsSubcontractorDropdownOpen(false);
    
    setOperation({
      ...operation,
      subcontractor: selectedId || undefined
    });
  };

  // Handle dimensioning note selection
  const handleDimensioningSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOperation({
      ...operation,
      hasReceiveDimensionPaper: value === "Oui"
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setOperation({ ...operation, [name]: newValue });
  };

  // Toggle handler for "Afficher la description du produit"
  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // Toggle handler for "Opération coup de pouce"
  const handleToggleCoupDePouce = () => {
    setOperation({
      ...operation,
      coupDePouceOperation: !operation.coupDePouceOperation
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!operation.livingArea) {
      alert('La surface habitable est obligatoire');
      return;
    }
    
    onSave({
      ...operation,
      subcontractor: selectedSubcontractor || undefined
    });
    onClose();
  };

  // Close dropdowns when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setIsProductDropdownOpen(false);
      }
      if (subcontractorDropdownRef.current && !subcontractorDropdownRef.current.contains(event.target as Node)) {
        setIsSubcontractorDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle switch component
  const Toggle: React.FC<{
    enabled: boolean;
    onChange: () => void;
    label: string;
  }> = ({ enabled, onChange, label }) => {
    return (
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
  };

  if (!hasDeal && step === 'selectOperation') {
    // If there's no deal, show an error message
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl w-full max-w-md m-4 overflow-hidden shadow-2xl"
        >
          <div className="relative bg-gradient-to-r from-amber-600 to-amber-400 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Aucun deal affecté
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
          
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Vous devez d&apos;abord affecter un deal à ce devis avant de pouvoir ajouter une opération.
            </p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg transition hover:bg-blue-700"
              >
                Compris
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {step === 'selectOperation' ? 'Sélectionner une opération' : 'Détails de l\'opération'}
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
          {step === 'selectOperation' ? (
            <div>
              <div className="mb-6">
                <label htmlFor="searchOperation" className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher ou sélectionner une opération
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="searchOperation"
                        placeholder="Rechercher par code ou description..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-3"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 overflow-auto max-h-72">
                      {filteredOperations.length > 0 ? (
                        filteredOperations.map((op) => (
                          <div
                            key={op.id}
                            onClick={() => handleSelectOperation(op.id)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium text-blue-600">{op.id}</div>
                                <div className="text-sm text-gray-500">{op.description}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          Aucune opération trouvée
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Opérations populaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {operationCodes.slice(0, 4).map((op) => (
                    <div 
                      key={op.id}
                      onClick={() => handleSelectOperation(op.id)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-blue-600">{op.id}</h3>
                          <p className="text-gray-500 text-sm mt-1">{op.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedOperation}
                  </h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Product Dropdown */}
                <div>
                  <label htmlFor="selectProduct" className="block text-sm font-medium text-gray-700 mb-1">
                    Produit
                  </label>
                  <div className="relative" ref={productDropdownRef}>
                    <div 
                      className="flex items-center justify-between w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                      onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                    >
                      <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {selectedProductId 
                          ? products.find(p => p.id === selectedProductId)?.name || '-- Sélectionnez un produit --'
                          : '-- Sélectionnez un produit --'
                        }
                      </div>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${isProductDropdownOpen ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    
                    {isProductDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        <div className="sticky top-0 bg-white border-b border-gray-300">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                              </svg>
                            </div>
                            <input
                              type="text"
                              id="productSearch"
                              value={productSearchQuery}
                              onChange={(e) => setProductSearchQuery(e.target.value)}
                              placeholder="Rechercher par nom ou référence..."
                              className="w-full pl-10 py-2.5 px-3 border-0 text-sm focus:ring-0 focus:outline-none"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto">
                          {filteredProducts.length === 0 ? (
                            <div className="p-3 text-gray-500 text-center">Aucun produit trouvé</div>
                          ) : (
                            <ul>
                              <li 
                                className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                                onClick={() => handleProductSelect('')}
                              >
                                -- Sélectionnez un produit --
                              </li>
                              {filteredProducts.map(product => (
                                <li 
                                  key={product.id} 
                                  className={`p-2.5 hover:bg-blue-50 cursor-pointer ${selectedProductId === product.id ? 'bg-blue-100' : ''}`}
                                  onClick={() => handleProductSelect(product.id)}
                                >
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-xs text-gray-500">
                                    <span>Réf: {product.reference}</span>
                                    {product.brand && <span className="ml-2">Marque: {product.brand}</span>}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Subcontractor Dropdown */}
                <div>
                  <label htmlFor="selectSubcontractor" className="block text-sm font-medium text-gray-700 mb-1">
                    Sélectionnez un sous-traitant
                  </label>
                  <div className="relative" ref={subcontractorDropdownRef}>
                    <div 
                      className="flex items-center justify-between w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                      onClick={() => setIsSubcontractorDropdownOpen(!isSubcontractorDropdownOpen)}
                    >
                      <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {selectedSubcontractor 
                          ? subcontractors.find(s => s.id === selectedSubcontractor)?.name || '-- Sélectionnez un sous-traitant --'
                          : '-- Sélectionnez un sous-traitant --'
                        }
                      </div>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${isSubcontractorDropdownOpen ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    
                    {isSubcontractorDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        <div className="sticky top-0 bg-white border-b border-gray-300">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                              </svg>
                            </div>
                            <input
                              type="text"
                              id="subcontractorSearch"
                              value={subcontractorSearchQuery}
                              onChange={(e) => setSubcontractorSearchQuery(e.target.value)}
                              placeholder="Rechercher par nom ou SIRET..."
                              className="w-full pl-10 py-2.5 px-3 border-0 text-sm focus:ring-0 focus:outline-none"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto">
                          {filteredSubcontractors.length === 0 ? (
                            <div className="p-3 text-gray-500 text-center">Aucun sous-traitant trouvé</div>
                          ) : (
                            <ul>
                              <li 
                                className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                                onClick={() => handleSubcontractorSelect('')}
                              >
                                -- Sélectionnez un sous-traitant --
                              </li>
                              {filteredSubcontractors.map(subcontractor => (
                                <li 
                                  key={subcontractor.id} 
                                  className={`p-2.5 hover:bg-blue-50 cursor-pointer ${selectedSubcontractor === subcontractor.id ? 'bg-blue-100' : ''}`}
                                  onClick={() => handleSubcontractorSelect(subcontractor.id)}
                                >
                                  <div className="font-medium">{subcontractor.name}</div>
                                  <div className="text-xs text-gray-500">
                                    <span>SIRET: {subcontractor.siret}</span>
                                    <span className="ml-2">Dir: {subcontractor.director}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6 space-y-4">
                {/* Toggle for Description */}
                <Toggle 
                  enabled={showDescription}
                  onChange={handleToggleDescription}
                  label="Afficher la description du produit"
                />
                
                {/* Toggle for Coup de pouce */}
                <Toggle 
                  enabled={operation.coupDePouceOperation || false}
                  onChange={handleToggleCoupDePouce}
                  label="Opération coup de pouce"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Prix du produit TTC
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="unitPriceTTC"
                    value={operation.unitPriceTTC}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label htmlFor="dimensioningNote" className="block text-sm font-medium text-gray-700 mb-1">
                    Note de dimensionnement remise au bénéficiaire
                  </label>
                  <select
                    id="dimensioningNote"
                    name="dimensioningNote"
                    onChange={handleDimensioningSelect}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    {dimensioningOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
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
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Fixed AddProductModal component with searchable subcontractor dropdown
const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSave }) => {
  const [product, setProduct] = useState<ProductState>({
    reference: '',
    position: 1,
    name: '',
    quantity: 1,
    unitPriceHT: 0,
    unitPriceTTC: 0,
    tva: 20,
    totalHT: 0,
    totalTTC: 0,
    description: '',
    showDescription: true,
    subcontractor: ''
  });
  
  // Add state for product dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Add state for subcontractor dropdown
  const [subcontractorSearchQuery, setSubcontractorSearchQuery] = useState('');
  const [isSubcontractorDropdownOpen, setIsSubcontractorDropdownOpen] = useState(false);
  const [selectedSubcontractorId, setSelectedSubcontractorId] = useState('');
  const subcontractorDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (subcontractorDropdownRef.current && !subcontractorDropdownRef.current.contains(event.target as Node)) {
        setIsSubcontractorDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setProduct({ ...product, [name]: newValue });
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter subcontractors based on search query
  const filteredSubcontractors = subcontractors.filter(subcontractor => 
    subcontractor.name.toLowerCase().includes(subcontractorSearchQuery.toLowerCase()) || 
    subcontractor.siret.toLowerCase().includes(subcontractorSearchQuery.toLowerCase())
  );

  const handleSelectProduct = (selectedId: string) => {
    if (!selectedId) return;
    
    setSelectedProductId(selectedId);
    setIsDropdownOpen(false);
    
    const selectedProduct = products.find(p => p.id === selectedId);
    if (selectedProduct) {
      // Filter out the Marque and Référence lines from the description
      const filteredDescription = selectedProduct.description
        .split('\n')
        .filter(line => !line.startsWith('Marque :') && !line.startsWith('Référence :') && !line.startsWith('- Type de température:'))
        .join('\n');
  
      // Create a temperature line with proper formatting
      const temperatureLine = `- Type de température: <span style="font-weight: bold">${selectedProduct.temperatureType}</span>`;
      
      // Add the formatted temperature line to the description
      const newDescription = filteredDescription.startsWith('-') 
        ? temperatureLine + '\n' + filteredDescription
        : temperatureLine + '\n' + filteredDescription;
  
      setProduct({
        ...product,
        reference: selectedProduct.reference,
        name: selectedProduct.name,
        unitPriceTTC: selectedProduct.price,
        tva: selectedProduct.tva,
        description: newDescription,
        showDescription: true,
        brand: selectedProduct.brand,
        serviceData: {
          reference: selectedProduct.serviceReference,
          description: selectedProduct.serviceDescription,
          price: selectedProduct.servicePrice,
          tva: selectedProduct.serviceTva
        }
      });
    }
  };

  // Add handler for selecting a subcontractor
  const handleSelectSubcontractor = (selectedId: string) => {
    if (!selectedId) {
      setSelectedSubcontractorId('');
      setProduct({ ...product, subcontractor: '' });
    } else {
      setSelectedSubcontractorId(selectedId);
      setProduct({ ...product, subcontractor: selectedId });
    }
    setIsSubcontractorDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate HT from TTC
    const ht = (product.unitPriceTTC || 0) / (1 + (product.tva || 0) / 100);
    
    // Keep only the technical specifications in the description
    const descriptionLines = (product.description || '').split('\n');
    
    // Format with only the description details without special handling for brand and reference
    const formattedDescription = descriptionLines.map(line => {
      // Add bold to any key value pairs with colons
      return line.replace(/(.+)\s*:\s*(.+)/g, '$1: <span style="font-weight: bold">$2</span>');
    }).join('<br/>');
    
    // Get subcontractor info for formatted display
    let subcontractorInfo = '';
    if (product.subcontractor) {
      const sc = subcontractors.find(s => s.id === product.subcontractor);
      if (sc) {
        subcontractorInfo = `<br/><br/><span style="font-weight: bold">Travaux sous-traités auprès de : ${sc.name} ${sc.address}</span><br/>Dirigeant : <span style="font-weight: bold">${sc.director}</span><br/>SIRET : <span style="font-weight: bold">${sc.siret}</span><br/>- ${sc.qualifications.join(' - ')}`;
      }
    }
    
    // Create formatted product name with full details but excluding brand and reference lines
    const richProductName = `<span style="font-weight: bold">${product.name}</span><br/>${formattedDescription}${subcontractorInfo}`;
    
    // Create the product with rich formatting
    const newProduct: Partial<Product> = {
      id: `prod-${Date.now()}`,
      reference: product.reference,
      position: product.position,
      name: richProductName,
      quantity: product.quantity,
      unitPriceHT: parseFloat(ht.toFixed(2)),
      unitPriceTTC: product.unitPriceTTC,
      tva: product.tva,
      totalHT: parseFloat((ht * product.quantity).toFixed(2)),
      totalTTC: parseFloat((product.unitPriceTTC * product.quantity).toFixed(2)),
      subcontractor: product.subcontractor
    };
    
    // Create a wrapper function to handle all product and service additions
    const addAllItems = () => {
      // First add the product
      onSave(newProduct);
      
      // If we have service data, also create and add the service
      if (product.serviceData) {
        const serviceHT = (product.serviceData.price || 0) / (1 + (product.serviceData.tva || 0) / 100);
        
        // Format service description with bold title
        const formattedServiceDesc = `<span style="font-weight: bold">${product.serviceData.reference}</span><br/>${product.serviceData.description.split('\n').join('<br/>')}`;
        
        const service: Partial<Service> = {
          id: `serv-${Date.now()}`,
          reference: product.serviceData.reference,
          position: product.position + 1,
          name: formattedServiceDesc,
          quantity: product.quantity, // Same quantity as the product
          unitPriceHT: parseFloat(serviceHT.toFixed(2)),
          unitPriceTTC: product.serviceData.price,
          tva: product.serviceData.tva,
          totalHT: parseFloat((serviceHT * product.quantity).toFixed(2)),
          totalTTC: parseFloat((product.serviceData.price * product.quantity).toFixed(2)),
        };
        
        // Add automatic waste management service
        const wasteService: Partial<Service> = {
          id: `waste-${Date.now()}`,
          reference: 'MENTION DÉCHETS',
          position: product.position + 2,
          name: '<span style="font-weight: bold">Obligation "mention déchets" applicable</span><br/>Gestion, évacuation et traitements des déchets de chantier comprenant la main d\'œuvre liée à la dépose et au tri, le transport des déchets de chantier vers un ou plusieurs points de collecte et les coûts de traitement. NB : Les coûts et frais prévus au présent devis sont des estimations susceptibles d\'être revues en fonction de la quantité réelle et de la nature des déchets constatés en fin de chantier. Installation de collecte envisagée : SIREDOM 40 Avenue Paul Langevin, 91130 Ris-Orangis',
          quantity: 1,
          unitPriceHT: 0,
          unitPriceTTC: 0,
          tva: 0,
          totalHT: 0,
          totalTTC: 0
        };
        
        // Add the service and waste service items
        onSave(service);
        onSave(wasteService);
      }
    };
    
    // Call the wrapper function to add all items
    addAllItems();
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
                <ShoppingCartIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Ajouter un produit
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="selectProduct" className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionner un produit (optionnel)
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="flex items-center justify-between w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {selectedProductId 
                        ? products.find(p => p.id === selectedProductId)?.name || '-- Sélectionnez un produit --'
                        : '-- Sélectionnez un produit --'
                      }
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                      <div className="sticky top-0 bg-white border-b border-gray-300">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="productSearch"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher par nom ou référence..."
                            className="w-full pl-10 py-2.5 px-3 border-0 text-sm focus:ring-0 focus:outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {filteredProducts.length === 0 ? (
                          <div className="p-3 text-gray-500 text-center">Aucun produit trouvé</div>
                        ) : (
                          <ul>
                            <li 
                              className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                              onClick={() => {
                                setSelectedProductId('');
                                setIsDropdownOpen(false);
                              }}
                            >
                              -- Sélectionnez un produit --
                            </li>
                            {filteredProducts.map(product => (
                              <li 
                                key={product.id} 
                                className={`p-2.5 hover:bg-blue-50 cursor-pointer ${selectedProductId === product.id ? 'bg-blue-100' : ''}`}
                                onClick={() => handleSelectProduct(product.id)}
                              >
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500">Réf: {product.reference}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="selectSubcontractor" className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionnez un sous-traitant
                </label>
                <div className="relative" ref={subcontractorDropdownRef}>
                  <div 
                    className="flex items-center justify-between w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                    onClick={() => setIsSubcontractorDropdownOpen(!isSubcontractorDropdownOpen)}
                  >
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {selectedSubcontractorId 
                        ? subcontractors.find(s => s.id === selectedSubcontractorId)?.name || '-- Sélectionnez un sous-traitant --'
                        : '-- Sélectionnez un sous-traitant --'
                      }
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform ${isSubcontractorDropdownOpen ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  
                  {isSubcontractorDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                      <div className="sticky top-0 bg-white border-b border-gray-300">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="subcontractorSearch"
                            value={subcontractorSearchQuery}
                            onChange={(e) => setSubcontractorSearchQuery(e.target.value)}
                            placeholder="Rechercher par nom ou SIRET..."
                            className="w-full pl-10 py-2.5 px-3 border-0 text-sm focus:ring-0 focus:outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {filteredSubcontractors.length === 0 ? (
                          <div className="p-3 text-gray-500 text-center">Aucun sous-traitant trouvé</div>
                        ) : (
                          <ul>
                            <li 
                              className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                              onClick={() => handleSelectSubcontractor('')}
                            >
                              -- Sélectionnez un sous-traitant --
                            </li>
                            {filteredSubcontractors.map(subcontractor => (
                              <li 
                                key={subcontractor.id} 
                                className={`p-2.5 hover:bg-blue-50 cursor-pointer ${selectedSubcontractorId === subcontractor.id ? 'bg-blue-100' : ''}`}
                                onClick={() => handleSelectSubcontractor(subcontractor.id)}
                              >
                                <div className="font-medium">{subcontractor.name}</div>
                                <div className="text-xs text-gray-500">
                                  <span>SIRET: {subcontractor.siret}</span>
                                  <span className="ml-2">Dir: {subcontractor.director}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="showDescription" 
                  name="showDescription"
                  checked={product.showDescription}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="showDescription" className="ml-2 text-sm text-gray-700">
                  Afficher la description
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                  Référence du produit*
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={product.reference}
                  onChange={handleChange}
                  required
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
                  value={product.position}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité*
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="unitPriceTTC" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix Unitaire TTC*
                </label>
                <input
                  type="number"
                  id="unitPriceTTC"
                  name="unitPriceTTC"
                  value={product.unitPriceTTC}
                  onChange={handleChange}
                  required
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
                  <option value="pcs">Pièce(s)</option>
                  <option value="m2">m²</option>
                  <option value="m">mètre(s)</option>
                  <option value="kg">kg</option>
                  <option value="h">heure(s)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
                  TVA*
                </label>
                <select
                  id="tva"
                  name="tva"
                  value={product.tva}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="5.5">5,5%</option>
                  <option value="10">10%</option>
                  <option value="20">20%</option>
                </select>
              </div>
            </div>
            
            {product.showDescription && (
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows={8}
                  required
                  placeholder="- Puissance calorifique: 14 KW
- COP: 4.52
- Gaz frigorigène: R32
- Classe énergétique: A+++
- Dimensions unité intérieure: 800x530x360 mm
- Dimensions unité extérieure: 1020x1050x330 mm"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono"
                />
              </div>
            )}
            
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

// Fixed AddServiceModal component
const AddServiceModal: React.FC<AddServiceModalProps> = ({ onClose, onSave }) => {
  const [service, setService] = useState<ServiceState>({
    reference: '',
    position: 1,
    name: '',
    quantity: 1,
    unitPriceHT: 0,
    unitPriceTTC: 0,
    tva: 10,
    totalHT: 0,
    totalTTC: 0,
    description: '',
    showDescription: true
  });

  // Add state for searchable dropdown
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter services based on search query
  const filteredServices = serviceOptions.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setService({ ...service, [name]: newValue });
  };

  const handleSelectService = (selectedId: string) => {
    if (!selectedId) {
      setSelectedServiceId('');
      return;
    }
    
    setSelectedServiceId(selectedId);
    setIsDropdownOpen(false);
    
    const selectedService = serviceOptions.find(s => s.id === selectedId);
    if (selectedService) {
      setService({
        ...service,
        reference: selectedService.reference,
        name: selectedService.name,
        unitPriceTTC: selectedService.price,
        tva: selectedService.tva,
        description: selectedService.description,
        showDescription: true
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate HT from TTC
    const ht = (service.unitPriceTTC || 0) / (1 + (service.tva || 0) / 100);
    
    // Format the description to be HTML with bold title
    const formattedName = `<span style="font-weight: bold">${service.reference}</span><br/>${service.description.split('\n').join('<br/>')}`;
    
    // Create the service with formatted description
    const newService: Partial<Service> = {
      id: `serv-${Date.now()}`,
      reference: service.reference,
      position: service.position,
      name: formattedName,
      quantity: service.quantity,
      unitPriceHT: parseFloat(ht.toFixed(2)),
      unitPriceTTC: service.unitPriceTTC,
      tva: service.tva,
      totalHT: parseFloat((ht * service.quantity).toFixed(2)),
      totalTTC: parseFloat((service.unitPriceTTC * service.quantity).toFixed(2))
    };
    
    onSave(newService);
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
                <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Créer une prestation
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
            <div className="mb-4">
              <label htmlFor="selectService" className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionner une prestation (optionnel)
              </label>
              
              {/* Custom searchable dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center justify-between w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedServiceId 
                      ? serviceOptions.find(s => s.id === selectedServiceId)?.name || '-- Sélectionnez une prestation --'
                      : '-- Sélectionnez une prestation --'
                    }
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <div className="sticky top-0 bg-white border-b border-gray-300">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="serviceSearch"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher par nom ou référence..."
                          className="w-full pl-10 py-2.5 px-3 border-0 text-sm focus:ring-0 focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto">
                      {filteredServices.length === 0 ? (
                        <div className="p-3 text-gray-500 text-center">Aucune prestation trouvée</div>
                      ) : (
                        <ul>
                          <li 
                            className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                            onClick={() => handleSelectService('')}
                          >
                            -- Sélectionnez une prestation --
                          </li>
                          {filteredServices.map(serviceOption => (
                            <li 
                              key={serviceOption.id} 
                              className={`p-2.5 hover:bg-blue-50 cursor-pointer ${selectedServiceId === serviceOption.id ? 'bg-blue-100' : ''}`}
                              onClick={() => handleSelectService(serviceOption.id)}
                            >
                              <div className="font-medium">{serviceOption.name}</div>
                              <div className="text-xs text-gray-500">Réf: {serviceOption.reference}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                  Référence de la prestation*
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={service.reference}
                  onChange={handleChange}
                  required
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
                  value={service.position}
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
                  value={service.quantity}
                  onChange={handleChange}
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
                  value={service.unitPriceTTC}
                  onChange={handleChange}
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
                  <option value="pcs">Pièce(s)</option>
                  <option value="m2">m²</option>
                  <option value="m">mètre(s)</option>
                  <option value="kg">kg</option>
                  <option value="h">heure(s)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tva" className="block text-sm font-medium text-gray-700 mb-1">
                  TVA
                </label>
                <select
                  id="tva"
                  name="tva"
                  value={service.tva}
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
                  name="showDescription"
                  checked={service.showDescription}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="showDescription" className="ml-2 text-sm text-gray-700">
                  Afficher la description
                </label>
              </div>
            </div>
            
            {service.showDescription && (
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Désignation*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={service.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="- Détail 1 de la prestation
- Détail 2 de la prestation
- Détail 3 de la prestation"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono"
                />
              </div>
            )}
            
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

// Updated DevisEditor Component with functional PDF dropdown
const DevisEditor: React.FC<{
  quoteId?: string;
  onClose: () => void;
}> = ({ quoteId, onClose }) => {
  // Generate a quote number in the format "DE76250408-1"
  const [quoteNumber, setQuoteNumber] = useState<string>(() => {
    if (quoteId) return quoteId;
    
    // Get current date and format it as DDMMYYYY
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const dateStr = `${day}${month}${year}`;
    
    // Add a random counter (1-99)
    const counter = Math.floor(Math.random() * 99) + 1;
    
    return `DE${dateStr}-${counter}`;
  });
  const [clientDetails, setClientDetails] = useState({
    street: '13 ROUTE DU POINT GAGNARD',
    postalCode: '13014',
    city: 'MARSEILLE',
    cadastralParcel: '000 / ZA / 0061',
    phoneNumber: '+336122336',
    zone: 'ZONE H3',
    houseType: 'Maison individuelle',
    houseAge: 'de + 15 ans',
    precarity: 'Modeste',
    heatingType: 'Bois',
    dwellingType: 'Maison individuelle',
    clientNumber: '76-750595907'
    // No default subcontractor
  });
  
  const [quoteDate, setQuoteDate] = useState<string>(new Date().toISOString().substring(0, 10));
  // Generate an invoice number in the format "FA10042025-7"
  const [invoiceNumber, setInvoiceNumber] = useState<string>(() => {
    // Get current date and format it as DDMMYYYY
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const dateStr = `${day}${month}${year}`;
    
    // Add a random counter (1-99)
    const counter = Math.floor(Math.random() * 99) + 1;
    
    return `FA${dateStr}-${counter}`;
  });
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [hasDeal, setHasDeal] = useState<boolean>(false);
  const [dealId, setDealId] = useState<string>('');
  const [dealRatio, setDealRatio] = useState<number>(0);
  const [customName ] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  
  const [tableItems, setTableItems] = useState<TableItem[]>([]);
  // Add this with your other state variables
  const [editingSizingNote, setEditingSizingNote] = useState<SizingNote | null>(null);
  
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
  const [showAddOperationModal, setShowAddOperationModal] = useState<boolean>(false);
  const [showDealModal, setShowDealModal] = useState<boolean>(false);
  const [showSizingNoteModal, setShowSizingNoteModal] = useState<boolean>(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string>("");
  const [sizingNotes, setSizingNotes] = useState<SizingNote[]>([]);

  const [showAddSubcontractorModal, setShowAddSubcontractorModal] = useState<boolean>(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<Subcontractor | null>(null);
  const [showAddMandataireModal, setShowAddMandataireModal] = useState<boolean>(false);
  const [selectedMandataire, setSelectedMandataire] = useState<Mandataire | null>(null);
  const [showAddInformationModal, setShowAddInformationModal] = useState<boolean>(false);
  // Add these state variables to the DevisEditor component
  const [showAddDPMairieModal, setShowAddDPMairieModal] = useState<boolean>(false);
  const [dpMairieData, setDpMairieData] = useState<DPMairieData | null>(null);
  const [preVisitDate, setPreVisitDate] = useState<string>('');
  const [paymentDueDate, setPaymentDueDate] = useState<string>('');

  const [showAddFinancingModal, setShowAddFinancingModal] = useState<boolean>(false);
  const [financingData, setFinancingData] = useState<FinancingData | null>(null);
  const [showAddIndivisionModal, setShowAddIndivisionModal] = useState<boolean>(false);
  const [indivisionData, setIndivisionData] = useState<IndivisionData | null>(null);
  // Inside the DevisEditor component, add this state:
  const [showAddDocumentModal, setShowAddDocumentModal] = useState<boolean>(false);
  const [quoteDocuments, setQuoteDocuments] = useState<QuoteDocument[]>([]);
  const [showAddIncentivesModal, setShowAddIncentivesModal] = useState<boolean>(false);
  const [incentivesData, setIncentivesData] = useState<IncentivesData>({
    primeCEE: '',
    remiseExceptionnelle: '',
    primeMPR: '',
    montantPriseEnChargeRAC: '',
    activiteMaPrimeRenov: false,
    acompte: ''
  });
  const [validUntilDate, setValidUntilDate] = useState<string>('');
  const [estimatedWorkDate, setEstimatedWorkDate] = useState<string>('');
  const [commitmentDate, setCommitmentDate] = useState<string>('');
  const [installationDate, setInstallationDate] = useState<string>('');
  const [workCompletionDate, setWorkCompletionDate] = useState<string>('');

  const [editingItem, setEditingItem] = useState<TableItem | null>(null);
  const [showEditItemModal, setShowEditItemModal] = useState<boolean>(false);
  const hasMandataire = Boolean(selectedMandataire);
  const hasSubcontractor = Boolean(selectedSubcontractor);
  const hasInformation = Boolean(additionalInfo && additionalInfo.trim() !== "");
  const hasFinancing = Boolean(financingData);
  const hasMairie = Boolean(dpMairieData);
  const hasDealSet = Boolean(dealId && dealId.trim() !== "");
  const hasDivision = Boolean(indivisionData);

  // New function to handle adding a sizing note
  const handleAddSizingNote = (sizingNote: SizingNote) => {
    if (sizingNote.id) {
      // Update existing note
      setSizingNotes(prev => prev.map(note => 
        note.id === sizingNote.id ? sizingNote : note
      ));
    } else {
      // Add new note
      setSizingNotes(prev => [...prev, { ...sizingNote, id: `sizing-note-${Date.now()}` }]);
    }
  };

  // Deal ratios lookup
  const dealRatios = {
    'EFFY': 0.0065,
    'ENGIE': 0.0058,
    'TOTAL': 0.0060,
    'CEE': 0.0000,
  };

  // Calculate totals including the deal premium if applicable
const totals = useMemo(() => {
  const totalHT = tableItems.reduce((sum, item) => sum + item.totalHT, 0);
  const totalTTC = tableItems.reduce((sum, item) => sum + item.totalTTC, 0);
  
  // Get operations for reference
  const operations = tableItems.filter(item => 
    item.reference && ["BAR-TH-171", "BAR-TH-104", "BAR-TH-113", "BAR-TH-143"].includes(item.reference)
  );
  
  // Calculate Prime CEE from deal or operation-specific inputs
  let primeCEE = 0;
  let dealPrimeCEE = 0;
  
  // First calculate the deal-based CEE if applicable
  if (hasDeal && dealId) {
    // Find operations and calculate their kWh cumac value
    const dealOperations = tableItems.filter(item => item.id?.startsWith('op-'));
    dealOperations.forEach(op => {
      const opRef = op.reference;
      // Find the corresponding product to get kWh cumac
      let kwhCumac = 0;
      if ('productId' in op && op.productId) {
        const product = products.find(p => p.id === op.productId);
        if (product) {
          kwhCumac = product.kwhCumac;
        }
      } else {
        // Fallback to operation code
        if (opRef === 'BAR-TH-101') kwhCumac = 510530;
        else if (opRef === 'BAR-TH-104') kwhCumac = 628730;
        else if (opRef === 'BAR-TH-112-Granulés') kwhCumac = 950440;
        else if (opRef === 'BAR-TH-171') kwhCumac = 615400;
      }
      
      // Calculate prime based on deal
      dealPrimeCEE += kwhCumac * dealRatio;
    });
  }
  
  // Now check for operation-specific CEE values
  let calculatedPrimeCEE = 0;
  
  if (operations.length > 0) {
    operations.forEach(op => {
      const ceeKey = `primeCEE_${op.reference}`;
      if (incentivesData[ceeKey]) {
        const value = parseFloat(incentivesData[ceeKey] as string || '0') || 0;
        calculatedPrimeCEE += value;
      }
    });
    
    // If operation-specific values exist, use them instead of deal calculated value
    if (calculatedPrimeCEE > 0) {
      primeCEE = calculatedPrimeCEE;
    } else {
      // Otherwise use the deal calculated value
      primeCEE = dealPrimeCEE;
    }
  } else {
    // No operation-specific values, use deal calculation
    primeCEE = dealPrimeCEE;
  }
  
  // Calculate MaPrimeRenov dynamically from operation-specific inputs
  let calculatedPrimeRenov = 0;
  
  // If we have specific operations, look for their MPR values
  if (operations.length > 0) {
    operations.forEach(op => {
      const mprKey = `primeMPR_${op.reference}`;
      if (incentivesData[mprKey]) {
        const value = parseFloat(incentivesData[mprKey] as string || '0') || 0;
        calculatedPrimeRenov += value;
      }
    });
    
    // If no operation-specific values were found, use a default of 3000
    if (calculatedPrimeRenov === 0) {
      calculatedPrimeRenov = 3000; // Default when operations exist but no specific values
    }
  }
  
  // Add incentives from the modal - Ensure all values are proper numbers
  const additionalPrimeCEE = parseFloat(incentivesData.primeCEE || '0') || 0;
  const remiseExceptionnelle = parseFloat(incentivesData.remiseExceptionnelle || '0') || 0;
  
  // Determine which MaPrimeRenov amount to use based on selection
  let primeMPR = 0;
  let primeRenovToUse = 0;
  
  if (incentivesData.primeMPR === 'Prime MPR deduite' || (operations.length > 0 && incentivesData.primeMPR !== 'Prime MPR non deduite')) {
    primeRenovToUse = calculatedPrimeRenov; // Use the dynamic calculated value
  } else {
    primeMPR = parseFloat(incentivesData.primeMPR || '0') || 0;
    // Don't use calculatedPrimeRenov when "Prime MPR non deduite" is selected
  }
  
  const acompte = parseFloat(incentivesData.acompte || '0') || 0;
  const racCharge = parseFloat(incentivesData.montantPriseEnChargeRAC || '0') || 0;
  
  // Calculate total discounts - be explicit about adding numbers
  const totalDiscounts = primeCEE + primeRenovToUse + additionalPrimeCEE + 
                        remiseExceptionnelle + primeMPR + acompte + racCharge;
  
  // Ensure totalTTC and totalDiscounts are valid numbers
  const validTotalTTC = !isNaN(totalTTC) ? totalTTC : 0;
  const validTotalDiscounts = !isNaN(totalDiscounts) ? totalDiscounts : 0;
  
  // Calculate remaining amount
  const remaining = validTotalTTC - validTotalDiscounts;
  
  return { 
    totalHT, 
    totalTTC: validTotalTTC, 
    primeCEE: parseFloat(primeCEE.toFixed(2)),
    primeRenov: calculatedPrimeRenov, // Return the calculated value
    additionalPrimeCEE,
    remiseExceptionnelle,
    primeMPR,
    acompte,
    racCharge,
    remaining: remaining
  };
}, [tableItems, hasDeal, dealId, dealRatio, incentivesData, products]);
  
  // Handle deal selection
  const handleDealSelect = (selectedDealId: string) => {
    setDealId(selectedDealId);
    setDealRatio(dealRatios[selectedDealId as keyof typeof dealRatios] || 0);
    setHasDeal(true);
    setShowDealModal(false);
  };
  
  // Enhanced handleAddProduct to ensure products show correctly in the table
  const handleAddProduct = (product: Partial<Product>) => {
    const ht = (product.unitPriceTTC || 0) / (1 + (product.tva || 0) / 100);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      reference: product.reference || '',
      position: tableItems.length + 1,
      name: product.name || 'Nouveau produit',
      quantity: product.quantity || 1,
      unitPriceHT: parseFloat(ht.toFixed(2)),
      unitPriceTTC: product.unitPriceTTC || 0,
      tva: product.tva || 20,
      totalHT: parseFloat((ht * (product.quantity || 1)).toFixed(2)),
      totalTTC: parseFloat(((product.unitPriceTTC || 0) * (product.quantity || 1)).toFixed(2)),
      description: product.description,
      subcontractor: product.subcontractor
    };
    
    // This ensures we add the product to the table
    setTableItems(prevItems => [...prevItems, newProduct]);
    
    // Log to confirm product was added
    console.log('Added product to tableItems:', newProduct);
  };
  
  const handleAddService = (service: Partial<Service>) => {
    const ht = (service.unitPriceTTC || 0) / (1 + (service.tva || 0) / 100);
    const newService: Service = {
      id: `serv-${Date.now()}`,
      reference: service.reference || '',
      position: tableItems.length + 1,
      name: service.name || 'Nouvelle prestation',
      quantity: service.quantity || 1,
      unitPriceHT: parseFloat(ht.toFixed(2)),
      unitPriceTTC: service.unitPriceTTC || 0,
      tva: service.tva || 20,
      totalHT: parseFloat((ht * (service.quantity || 1)).toFixed(2)),
      totalTTC: parseFloat(((service.unitPriceTTC || 0) * (service.quantity || 1)).toFixed(2)),
      description: service.description
    };
    
    setTableItems(prevItems => [...prevItems, newService]);
    console.log('Added service to tableItems:', newService);
  };
  
  const handleAddOperation = (operation: Partial<Operation>) => {
    const ht = (operation.unitPriceTTC || 0) / (1 + (operation.tva || 0) / 100);
    const newOperation: Operation = {
      id: `op-${Date.now()}`,
      reference: operation.reference || '',
      position: tableItems.length + 1,
      name: operation.name || 'Nouvelle opération',
      productId: operation.productId,
      subcontractor: operation.subcontractor,
      quantity: operation.quantity || 1,
      unitPriceHT: parseFloat(ht.toFixed(2)),
      unitPriceTTC: operation.unitPriceTTC || 0,
      tva: operation.tva || 5.5,
      totalHT: parseFloat((ht * (operation.quantity || 1)).toFixed(2)),
      totalTTC: parseFloat(((operation.unitPriceTTC || 0) * (operation.quantity || 1)).toFixed(2)),
      dpeBeforeWork: operation.dpeBeforeWork,
      dpeAfterWork: operation.dpeAfterWork,
      livingArea: operation.livingArea,
      heatedArea: operation.heatedArea,
      oldBoilerType: operation.oldBoilerType,
      oldBoilerBrand: operation.oldBoilerBrand,
      oldBoilerModel: operation.oldBoilerModel,
      hasReceiveDimensionPaper: operation.hasReceiveDimensionPaper,
      housingType: operation.housingType,
      pumpUsage: operation.pumpUsage,
      regulatorBrand: operation.regulatorBrand,
      regulatorReference: operation.regulatorReference,
      coupDePouceOperation: operation.coupDePouceOperation
    };
    
    // Get product details if selected
    let productBrand = '';
    let productReference = '';
    let productDescription = '';
    let kwhCumac = 0;
    let temperatureType = "Basse Température"; // Default value
    
    if (operation.productId) {
      const product = products.find(p => p.id === operation.productId);
      if (product) {
        productBrand = product.brand;
        productReference = product.reference;
        productDescription = product.description;
        kwhCumac = product.kwhCumac;
        if (product.temperatureType) {
          temperatureType = product.temperatureType;
        }
      }
    } else {
      // Fallback values
      productBrand = 'ATLANTIC';
      productReference = 'ATLANTIC ALFEA EXCELLIA HP A.I. 16 KW MONOPHASE REF/526631';
      productDescription = '- Puissance calorifique : +7 °C / +35 °C : 16 KW - COP +7 °C / +55 °C : 2.60 - Gaz frigorigène : R410A - Classe énergétique - chauffage (+55°C) : A++ MODULE INTÉRIEUR - Dimensions (H x L x P) mm : 847x448x482 - Poids à vide / en eau (kg) : 53 / 75 - Niveau Sonore à 5 m de l\'appareil dB(A) : 37 GROUPE EXTÉRIEUR FUJITSU : - Dimensions (H x L x P) mm : 1428x1080x480 - Poids en fonctionnement (kg) : 137 - Niveau Sonore à 5 m de l\'appareil dB(A) : 45';
      
      if (operation.reference === 'BAR-TH-101') kwhCumac = 510530;
      else if (operation.reference === 'BAR-TH-104') kwhCumac = 628730;
      else if (operation.reference === 'BAR-TH-112-Granulés') kwhCumac = 950440;
      else if (operation.reference === 'BAR-TH-171') kwhCumac = 615400;
    }
    
    // Get subcontractor details if selected
    let subContractorInfo = '';
    if (operation.subcontractor) {
      const subcontractor = subcontractors.find(sc => sc.id === operation.subcontractor);
      if (subcontractor) {
        subContractorInfo = `<span style="font-weight: bold">Travaux sous-traités auprès de : ${subcontractor.name} ${subcontractor.address}</span><br/>Dirigeant : <span style="font-weight: bold">${subcontractor.director}</span><br/>SIRET : <span style="font-weight: bold">${subcontractor.siret}</span><br/>N° Décennale : <span style="font-weight: bold">${subcontractor.insurance}</span><br/>- ${subcontractor.qualifications.join(' - ')}`;
      }
    } else {
      // Fallback
      subContractorInfo = '';
    }
    
    // Calculate CEE Prime
    const primeCEE = kwhCumac * dealRatio;
    
    // Create a rich formatted name with HTML styling for bold text instead of markdown
    const formattedName = `<span style="font-weight: bold">${operation.reference}</span> Mise en place d'une pompe à chaleur (PAC) de type air/eau.<br/><br/>Type de température : <span style="font-weight: bold">${temperatureType}</span><br/>Marque : <span style="font-weight: bold">${productBrand}</span><br/>Référence : <span style="font-weight: bold">${productReference}</span><br/>L'efficacité énergétique saisonnière est de : <span style="font-weight: bold">127 %</span> calculée selon le règlement (EU) n°813/2013 de la commission du 2 aout 2013.<br/>La surface chauffée par la PAC est de <span style="font-weight: bold">${operation.heatedArea || 120} m2</span><br/>Surface habitable : <span style="font-weight: bold">${operation.livingArea || 120} m2</span><br/>Type de logement : <span style="font-weight: bold">${operation.housingType || "Maison individuelle"}</span><br/>Classe du régulateur :<br/>Usage couvert par la PAC : <span style="font-weight: bold">${operation.pumpUsage || "Chauffage seul"}</span><br/>Dépose et remplacement d'une chaudière au <span style="font-weight: bold">${operation.oldBoilerType || "Gaz"}</span><br/><br/>Kwh Cumac : <span style="font-weight: bold">${kwhCumac}</span><br/>Prime ${dealId} : <span style="font-weight: bold">${primeCEE.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span><br/><br/>
Description : <span style="font-weight: bold">${productDescription}</span><br/><br/>
${subContractorInfo}`;
    
    const richOperation = {
      ...newOperation,
      name: formattedName
    };
    
    // Add installation service with proper title
    const installationService: Service = {
      id: `serv-install-${Date.now()}`,
      reference: 'FORFAIT POSE PAC',
      position: tableItems.length + 2,
      name: '<span style="font-weight: bold">FORFAIT POSE POMPE A CHALEUR ET FOURNITURE D\'UN BALLON TAMPON</span><br/>- Pose et installation complète d\'une pompe à chaleur air/eau<br/>- Forfait déplacement et mise en service comprise.<br/>- Installation d\'un ballon tampon 25L : Bouteilles de mélange et de décantation, pour installations de chauffage corps acier, jaquette skaï, Isolation 35 mm réversibles droite ou gauche de la chaudière pose murale livrée avec 4 bouchons pour circuits inutilisés.',
      quantity: 1,
      unitPriceHT: 2500,
      unitPriceTTC: 2750,
      tva: 10,
      totalHT: 2500,
      totalTTC: 2750
    };
    
    // Add waste management service with proper title but no values
    const wasteService: Service = {
      id: `serv-waste-${Date.now()}`,
      reference: 'MENTION DÉCHETS',
      position: tableItems.length + 3,
      name: '<span style="font-weight: bold">Obligation "mention déchets" applicable</span><br/>Gestion, évacuation et traitements des déchets de chantier comprenant la main d\'œuvre liée à la dépose et au tri, le transport des déchets de chantier vers un ou plusieurs points de collecte et les coûts de traitement. NB : Les coûts et frais prévus au présent devis sont des estimations susceptibles d\'être revues en fonction de la quantité réelle et de la nature des déchets constatés en fin de chantier. Installation de collecte envisagée : SIREDOM 40 Avenue Paul Langevin, 91130 Ris-Orangis',
      quantity: 1,
      unitPriceHT: 0, // Blank value
      unitPriceTTC: 0, // Blank value
      tva: 0, // Blank value
      totalHT: 0, // Blank value
      totalTTC: 0 // Blank value
    };
    
    // Use a single state update to add all items at once
    setTableItems(prevItems => [...prevItems, richOperation, installationService, wasteService]);
    
    // Log to confirm all items were added
    console.log('Added operation and related items to tableItems:', { richOperation, installationService, wasteService });
  };
  
  const handleRemoveItem = (id: string) => {
    setTableItems(tableItems.filter(item => item.id !== id));
  };

  const handleDuplicateQuote = () => {
    alert('Dupliquer le devis: Cette fonctionnalité créerait une copie du devis actuel.');
  };

  // Get product details for the selected product code
  const getProductDetails = (productCode: string) => {
    // Find the operation item with the matching reference
    const operation = tableItems.find(item => item.reference === productCode);
    if (!operation) return undefined;
    
    // If the operation has a productId, find that product's details
    if ('productId' in operation && operation.productId) {
      const product = products.find(p => p.id === operation.productId);
      if (product) {
        return {
          name: product.name,
          brand: product.brand,
          reference: product.reference
        };
      }
    }
    
    // Return basic details from the operation if product not found
    return {
      name: "Pompe à chaleur",
      brand: "",
      reference: productCode
    };
  };

  // Add this function to handle saving indivision data
  const handleSaveIndivision = (data: IndivisionData) => {
    setIndivisionData(data);
    
    // Update additional info to show "Indivision créée"
    if (!additionalInfo.includes("Indivision créée")) {
      setAdditionalInfo(prev => 
        prev ? `${prev}\n\nIndivision créée.` : "Indivision créée."
      );
    }
  };

  // Add this function to handle saving documents
  const handleSaveDocuments = (documents: QuoteDocument[]) => {
    setQuoteDocuments(prev => [...prev, ...documents]);
  };

  // Add this function to handle removing documents
  const handleRemoveDocument = (id: string) => {
    setQuoteDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Add this function to handle saving incentives
  const handleSaveIncentives = (incentives: IncentivesData) => {
    setIncentivesData(incentives);
  };
  
  // Modified handleAction function to handle sizing note actions
  const handleAction = (actionId: string, productCode?: string) => {
    if (actionId.startsWith("sizingNote_") && productCode) {
      // Find existing sizing note for this product code
      const existingNote = sizingNotes.find(note => note.productReference === productCode);
      setSelectedProductCode(productCode);
      // If existing note, set it as the one to edit
      if (existingNote) {
        setEditingSizingNote(existingNote);
      } else {
        setEditingSizingNote(null);
      }
      setShowSizingNoteModal(true);
      return;
    }
    
    switch (actionId) {
      case 'addSubcontractor':
        setShowAddSubcontractorModal(true);
        break;
      case 'addAgent':
        setShowAddMandataireModal(true);
        break;
      case 'addInfo':
        setShowAddInformationModal(true);
        break;
      case 'addOperation':
        if (hasDeal) {
          setShowAddOperationModal(true);
        } else {
          // Warn the user that they need to assign a deal first
          alert('Vous devez d\'abord affecter un deal à ce devis avant de pouvoir ajouter une opération.');
        }
        break;
      case 'addProduct':
        setShowAddProductModal(true);
        break;
      case 'addService':
        setShowAddServiceModal(true);
        break;
      case 'addFunding':
        setShowAddFinancingModal(true);
        break;
      case 'addMairie':
        setShowAddDPMairieModal(true);
        break;
      case 'assignToDeal':
        // Now opens modal
        setShowDealModal(true);
        break;
      case 'addDivision':
        setShowAddIndivisionModal(true);
        break;
      case 'addDocument':
        setShowAddDocumentModal(true);
        break;
      case 'modifyPrime':
        setShowAddIncentivesModal(true);
        break;
      case 'deleteQuote':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
          alert('Devis supprimé');
          onClose();
        }
        break;
      default:
        alert(`Action "${actionId}" à implémenter`);
    }
  };

  // Add this function to handle saving DP Mairie data
  const handleSaveDPMairie = (data: DPMairieData) => {
    setDpMairieData(data);
    // No longer updating additionalInfo
  };
  

  // Add this function to handle saving a subcontractor
  const handleSaveSubcontractor = (subcontractor: Subcontractor) => {
    // First, store the selected subcontractor
    setSelectedSubcontractor(subcontractor);
    
    // Then, map the subcontractor data to match what the devis generator expects
    if (subcontractor) {
      // Create the formatted subcontractor object that matches the clientDetails.subcontractor structure
      const formattedSubcontractor = {
        name: subcontractor.name,
        address: subcontractor.address,
        leader: subcontractor.director, // Map director → leader
        siret: subcontractor.siret,
        decennialNumber: subcontractor.insurance, // Map insurance → decennialNumber
        qualifications: subcontractor.qualifications
      };
      
      // Update the clientDetails with the subcontractor information
      setClientDetails((prev: typeof clientDetails) => ({
        ...prev,
        subcontractor: formattedSubcontractor
      }));
    } else {
      // If no subcontractor is selected (or it was removed),
      // remove the subcontractor property from clientDetails
      setClientDetails((prev: typeof clientDetails) => {
        const newDetails = { ...prev };
        // @ts-expect-error - Properly handle the dynamic property deletion
        delete newDetails.subcontractor;
        return newDetails;
      });
    }
  };

  // Add function to handle saving the additional information
  const handleSaveInformation = (info: string) => {
    setAdditionalInfo(info);
  };

  // Add this function to handle saving a mandataire
  const handleSaveMandataire = (mandataire: Mandataire) => {
    setSelectedMandataire(mandataire);
  };

  // Add the handleSaveFinancing function
  const handleSaveFinancing = (financing: FinancingData) => {
    setFinancingData(financing);
  };

  // Helper function to get frequency label
  const getFrequencyLabel = (frequencyId: string) => {
    const frequencyMap: {[key: string]: string} = {
      'monthly': 'Mensuelle',
      'quarterly': 'Trimestrielle',
      'biannual': 'Semestrielle',
      'annual': 'Annuelle'
    };
    return frequencyMap[frequencyId] || frequencyId;
  };

  // Custom formatter for table cells to hide zeros in MENTION DÉCHETS
  const formatTableCell = (item: TableItem, value: number, formatter: (val: number) => string) => {
    if (item.reference === 'MENTION DÉCHETS') {
      return '';
    }
    return formatter(value);
  };

  // Debug function to show content in console if needed
  useEffect(() => {
    console.log('Current tableItems:', tableItems);
  }, [tableItems]);

  const handleEditItem = (item: TableItem) => {
    setEditingItem(item);
    setShowEditItemModal(true);
  };

  // Add this function to the DevisEditor component
  const handleSaveEditedItem = (editedItem: TableItem) => {
    setTableItems(prevItems => 
      prevItems.map(item => 
        item.id === editedItem.id ? editedItem : item
      )
    );
  };

  // const getCustomFileName = () => {
  //   const docType = quoteId ? "Devis" : "Facture"; // Determine if it's a quote or invoice
  //   const reference = quoteId ? quoteNumber : invoiceNumber;
    
  //   if (customName) {
  //     // Replace spaces with underscores and remove special characters
  //     const sanitizedName = customName.replace(/\s+/g, '_').replace(/[^\w\-_.]/g, '');
  //     return `${docType}_${sanitizedName}.pdf`;
  //   }
    
  //   return `${docType}_${reference}.pdf`;
  // };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md">
      {/* Action buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleDuplicateQuote}
          className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          <DocumentDuplicateIcon className="h-5 w-5" />
          <span>Dupliquer le devis</span>
        </button>
        
        <ActionMenu
          onAction={handleAction}
          onShowDealModal={() => setShowDealModal(true)}
          tableItems={tableItems}

          // NEW PROPS
          hasMandataire={hasMandataire}
          hasSubcontractor={hasSubcontractor}
          hasInformation={hasInformation}
          hasFinancing={hasFinancing}
          hasMairie={hasMairie}
          hasDeal={hasDealSet}
          hasDivision={hasDivision}
        />

        
        {dealId && (
          <div className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <span>Deal affecté: {dealId}</span>
          </div>
        )}
      </div>
      
      {/* Quote and invoice details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="col-span-full mb-4">
        {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="customName" className="block text-sm font-medium text-gray-700">
              Nom personnalisé du document
            </label>
            <div className="text-xs text-gray-500">
              <span className="italic">Ex: Devis_pour_john</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="customName"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ajouter un nom personnalisé pour le téléchargement..."
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {customName && (
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Fichier: {getCustomFileName()}
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Ce nom sera utilisé lors du téléchargement du document. Si aucun nom n&apos;est spécifié, le numéro de référence sera utilisé.
          </p>
        </div> */}
      </div>

        <div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="quoteNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de devis
              </label>
              <input
                type="text"
                id="quoteNumber"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-100"
                disabled
              />
            </div>
            
            <div>
              <label htmlFor="quoteDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de devis
              </label>
              <input
                type="date"
                id="quoteDate"
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="validUntilDate" className="block text-sm font-medium text-gray-700 mb-1">
                Devis valable jusqu&apos;au
              </label>
              <input
                type="date"
                id="validUntilDate"
                value={validUntilDate}
                onChange={(e) => setValidUntilDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="preVisitDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de prévisite ou d&apos;audit
              </label>
              <input
                type="date"
                id="preVisitDate"
                value={preVisitDate}
                onChange={(e) => setPreVisitDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="estimatedWorkDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date prévisionnelle des travaux
              </label>
              <input
                type="date"
                id="estimatedWorkDate"
                value={estimatedWorkDate}
                onChange={(e) => setEstimatedWorkDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="commitmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date d&apos;engagement
              </label>
              <input
                type="date"
                id="commitmentDate"
                value={commitmentDate}
                onChange={(e) => setCommitmentDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
        
        <div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de facture
              </label>
              <input
                type="text"
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-100"
                disabled
              />
            </div>
            
            <div>
              <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de facture
              </label>
              <input
                type="date"
                id="invoiceDate"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="paymentDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de règlement avant le
              </label>
              <input
                type="date"
                id="paymentDueDate"
                value={paymentDueDate}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de pose
              </label>
              <input
                type="date"
                id="installationDate"
                value={installationDate}
                onChange={(e) => setInstallationDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label htmlFor="workCompletionDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date fin de travaux
              </label>
              <input
                type="date"
                id="workCompletionDate"
                value={workCompletionDate}
                onChange={(e) => setWorkCompletionDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subcontractor Info Display */}
      {selectedSubcontractor && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-blue-800">
              Installateur sous-traitant
            </h3>
            <button
              onClick={() => setSelectedSubcontractor(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm font-medium text-blue-700">Entreprise</span>
              <span className="text-gray-800">{selectedSubcontractor.name}</span>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-blue-700">Dirigeant</span>
              <span className="text-gray-800">{selectedSubcontractor.director}</span>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-blue-700">SIRET</span>
              <span className="text-gray-800">{selectedSubcontractor.siret}</span>
            </div>
            
            <div className="md:col-span-2">
              <span className="block text-sm font-medium text-blue-700">Adresse</span>
              <span className="text-gray-800">{selectedSubcontractor.address}</span>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-blue-700">N° Décennale</span>
              <span className="text-gray-800">{selectedSubcontractor.insurance}</span>
            </div>
          </div>
          
          {selectedSubcontractor.qualifications && selectedSubcontractor.qualifications.length > 0 && (
            <div className="mt-3">
              <span className="block text-sm font-medium text-blue-700 mb-1">Qualifications</span>
              <div className="flex flex-wrap gap-2">
                {selectedSubcontractor.qualifications.map((qual: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {qual}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simplified Subcontractor Info Display */}
      {selectedSubcontractor && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-800">
                Installateur sous-traitant: <span className="text-blue-900 font-semibold">{selectedSubcontractor.name}</span>
              </h3>
            </div>
            <button
              onClick={() => setSelectedSubcontractor(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Item Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
        <div className="bg-blue-50 border-b border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Ajouter une prestation</span>
            </button>
            
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Ajouter un produit</span>
            </button>
            
            <button
              onClick={() => setShowAddOperationModal(true)}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                hasDeal 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
              disabled={!hasDeal}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Ajouter une opération</span>
            </button>
          </div>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit et prestation</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unitaire HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unitaire TTC</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tableItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                  Aucun élément ajouté. Utilisez les boutons ci-dessus pour ajouter des produits, prestations ou opérations.
                </td>
              </tr>
            ) : (
              tableItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {/* <div className="font-medium text-gray-900">{item.reference}</div> */}
                    <div className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: item.name }}></div>
                  </td>
                  <td className="py-3 px-4">{item.reference === 'MENTION DÉCHETS' ? '' : item.quantity}</td>
                  <td className="py-3 px-4">{formatTableCell(item, item.unitPriceHT, val => val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }))}</td>
                  <td className="py-3 px-4">{formatTableCell(item, item.unitPriceTTC, val => val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }))}</td>
                  <td className="py-3 px-4">{item.reference === 'MENTION DÉCHETS' ? '' : item.tva + '%'}</td>
                  <td className="py-3 px-4">{formatTableCell(item, item.totalHT, val => val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }))}</td>
                  <td className="py-3 px-4 font-medium">{formatTableCell(item, item.totalTTC, val => val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }))}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td colSpan={6} className="py-3 px-4 text-right">Total:</td>
              <td className="py-3 px-4">{totals.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
              <td className="py-3 px-4">{totals.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Additional Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left Section - Information complémentaire */}
        <div className="col-span-2">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Information complémentaire</h3>
              <textarea
                rows={4}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ajoutez des informations supplémentaires concernant ce devis..."
              />
            </div>

            {/* Add the Mandataire Info Display right here, after the Information complémentaire section */}
            {selectedMandataire && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Mandataire</h3>
                  <button
                    onClick={() => setSelectedMandataire(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nom</p>
                      <p className="text-gray-900">{selectedMandataire.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Entreprise</p>
                      <p className="text-gray-900">{selectedMandataire.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">SIRET</p>
                      <p className="text-gray-900">{selectedMandataire.siret}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact</p>
                      <p className="text-gray-900">{selectedMandataire.email}</p>
                      <p className="text-gray-600 text-sm">{selectedMandataire.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Adresse</p>
                      <p className="text-gray-900">{selectedMandataire.address}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-amber-700 text-sm">
                      <InformationCircleIcon className="h-5 w-5 text-amber-500" />
                      <p>Ce mandataire sera associé à ce devis pour les documents MaPrimeRénov&apos;.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Indivision Info Display */}
            {indivisionData && (
              <IndivisionInfoDisplay
                indivisionData={indivisionData}
                onRemove={() => setIndivisionData(null)}
              />
            )}

            {/* Simplified DP Mairie status box - only shown when dpMairieData exists */}
            {dpMairieData && (
              <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-md">
                      <BuildingLibraryIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-blue-800 font-medium">DP mairie créée</p>
                  </div>
                  <button
                    onClick={() => setDpMairieData(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Financing Information Section - only shown when financing data exists */}
            {financingData && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Paiement avec financement</h3>
                  <button
                    onClick={() => setFinancingData(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="font-semibold mb-2">Organisme Bancaire : {financingData.bankName}</p>
                  
                  <p className="text-gray-700 mb-3">Une offre préalable de crédit a été remise au client aux conditions principales suivantes :</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Montant du prêt :</span>
                      <span className="ml-1 font-medium">{financingData.loanAmount} €</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mois de Report :</span>
                      <span className="ml-1 font-medium">{financingData.deferredMonths}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Taux débiteur fixe :</span>
                      <span className="ml-1 font-medium">{financingData.fixedRate} %</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Taux annuel effectif global (TAEG) :</span>
                      <span className="ml-1 font-medium">{financingData.annualPercentageRate} %</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Nombre d&apos;échéances :</span>
                      <span className="ml-1 font-medium">{financingData.numberOfPayments}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Montant des échéances avec assurance :</span>
                      <span className="ml-1 font-medium">{financingData.paymentAmountWithInsurance} €</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Montant des échéances sans assurance :</span>
                      <span className="ml-1 font-medium">{financingData.paymentAmountWithoutInsurance} €</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Périodicité :</span>
                      <span className="ml-1 font-medium">{getFrequencyLabel(financingData.frequency)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Montant total dû :</span>
                      <span className="ml-1 font-medium">{financingData.totalAmountDue} €</span>
                    </div>
                    {financingData.personalContribution && financingData.personalContribution !== "0" && (
                      <div>
                        <span className="text-gray-600">Apport personnel :</span>
                        <span className="ml-1 font-medium">{financingData.personalContribution} €</span>
                      </div>
                    )}
                    {financingData.sellerName && (
                      <div>
                        <span className="text-gray-600">Nom du vendeur :</span>
                        <span className="ml-1 font-medium">{financingData.sellerName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span>Envoyer un document par email</span>
                </button>
                
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <DocumentCheckIcon className="h-5 w-5" />
                  <span>Envoyer une signature électronique</span>
                </button>
                
                {/* Replace the dropdown with our custom PDF Generator component */}
                <PDFGenerator 
                  tableItems={tableItems}
                  quoteNumber={quoteNumber}
                  quoteDate={quoteDate}
                  clientName="Jean Dupont" // Replace with actual client name when available
                  totals={totals}
                  dealId={dealId}
                  additionalInfo={additionalInfo}
                  sizingNotes={sizingNotes}
                  financingData={financingData}
                  dpMairieData={dpMairieData}
                  indivisionData={indivisionData}
                  incentivesData={incentivesData}
                  customName={customName}
                  // Pass the additional date fields
                  validUntilDate={validUntilDate}
                  preVisitDate={preVisitDate}
                  estimatedWorkDate={estimatedWorkDate}
                  commitmentDate={commitmentDate}
                  clientDetails={clientDetails}
                />
              </div>
            </div>
          </div>
          {/* Sizing Notes Section */}
          {sizingNotes.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              {sizingNotes.map((note) => (
                <div key={note.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Note de dimensionnement {note.productType}
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Type de produit :</span>
                        <span className="text-sm ml-1">{note.productType}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Marque du produit :</span>
                        <span className="text-sm ml-1">{note.productBrand}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Référence du produit :</span>
                        <span className="text-sm ml-1">{note.productReference}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Volume :</span>
                        <span className="text-sm ml-1">{note.volume} m³</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Déperdition :</span>
                        <span className="text-sm ml-1">{parseFloat(note.heatLoss).toLocaleString('fr-FR')} watts soit {(parseFloat(note.heatLoss)/1000).toLocaleString('fr-FR')} KWs</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Dimensionnement :</span>
                        <span className="text-sm ml-1">{note.dimensioning} KWs</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Couverture :</span>
                        <span className="text-sm ml-1">{note.coverage}%</span>
                      </div>
                    </div>
                    
                    {/* Additional details if needed */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Type de logement :</span>
                          <span className="text-xs ml-1">{note.buildingType}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Type de radiateur :</span>
                          <span className="text-xs ml-1">{note.radiatorType}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Température de l&apos;eau :</span>
                          <span className="text-xs ml-1">{note.waterTemperature}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Section - Financial Summary */}
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Récapitulatif financier</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Prix Total HT</span>
                <span className="font-semibold">{totals.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">TVA</span>
                <span className="font-semibold">{(totals.totalTTC - totals.totalHT).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Prix Total TTC</span>
                <span className="font-bold text-lg">{totals.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              
              {/* Prime DEAL_ID - Only show if value is greater than 0 */}
              {totals.primeCEE > 0 && (
                <div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Prime {dealId}</span>
                    <span className="font-semibold text-green-600">-{totals.primeCEE.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  {dealId === 'CEE' && (
                    <div className="text-xs text-gray-500 ml-2 mb-2">
                      au titre du dispositif d&apos;économies d&apos;énergies CEE
                    </div>
                  )}
                </div>
              )}

              {/* Show MaPrimeRenov if operations exist, primeMPR is not "Prime MPR non deduite", and value > 0 */}
              {(() => {
                // Get operations for MaPrimeRenov to avoid "Cannot find name 'operations'" error
                const operations = tableItems.filter(item => 
                  item.reference && ["BAR-TH-171", "BAR-TH-104", "BAR-TH-113", "BAR-TH-143"].includes(item.reference)
                );
                
                const primeRenovValue = totals.primeRenov || 0;
                
                if (operations.length > 0 && incentivesData.primeMPR !== 'Prime MPR non deduite' && primeRenovValue > 0) {
                  return (
                    <div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Estimation MaPrimeRenov&apos;</span>
                        <span className="font-semibold text-green-600">
                          -{primeRenovValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>
                      {/* Add the description below */}
                      <div className="text-xs text-gray-500 ml-2 mb-2">
                        Sous réserve de l&apos;accord de l&apos;ANAH (**)
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Show additional incentives if they exist and are greater than 0 */}
              {incentivesData.primeCEE && parseFloat(incentivesData.primeCEE) > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Prime C.E.E supplémentaire</span>
                  <span className="font-semibold text-green-600">-{parseFloat(incentivesData.primeCEE).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              )}

              {incentivesData.remiseExceptionnelle && parseFloat(incentivesData.remiseExceptionnelle) > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Remise exceptionnelle</span>
                  <span className="font-semibold text-green-600">-{parseFloat(incentivesData.remiseExceptionnelle).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              )}

              {incentivesData.montantPriseEnChargeRAC && parseFloat(incentivesData.montantPriseEnChargeRAC) > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Prise en charge du RAC</span>
                  <span className="font-semibold text-green-600">-{parseFloat(incentivesData.montantPriseEnChargeRAC).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              )}

              {incentivesData.acompte && parseFloat(incentivesData.acompte) > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Acompte</span>
                  <span className="font-semibold text-amber-600">-{parseFloat(incentivesData.acompte).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 mt-2 bg-blue-50 p-2 rounded-lg">
                <span className="text-blue-800 font-medium">Reste à payer</span>
                <span className="font-bold text-blue-800">{totals.remaining.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-3 border-t border-gray-200 text-xs text-gray-500">
              <p>Créé par Jean Martin le 02/04/2025 à 14:30</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List Section */}
      <DocumentsList 
        documents={quoteDocuments} 
        onRemoveDocument={handleRemoveDocument} 
      />
      
      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {showAddProductModal && (
          <AddProductModal 
            onClose={() => setShowAddProductModal(false)}
            onSave={handleAddProduct}
          />
        )}
        
        {showAddServiceModal && (
          <AddServiceModal 
            onClose={() => setShowAddServiceModal(false)}
            onSave={handleAddService}
          />
        )}
        
        {showAddOperationModal && (
          <AddOperationModal 
            onClose={() => setShowAddOperationModal(false)}
            onSave={handleAddOperation}
            hasDeal={hasDeal}
            dealId={dealId}
          />
        )}
        
        {showDealModal && (
          <DealSelectionModal
            onClose={() => setShowDealModal(false)}
            onSelect={handleDealSelect}
          />
        )}

        {showSizingNoteModal && (
          <SizingNoteModal
            onClose={() => {
              setShowSizingNoteModal(false);
              setEditingSizingNote(null); // Clear the editing state when closing
            }}
            onSave={handleAddSizingNote}
            productCode={selectedProductCode}
            productDetails={getProductDetails(selectedProductCode)}
            existingNote={editingSizingNote} // Pass the existing note here
          />
        )}

        {showAddSubcontractorModal && (
          <AddSubcontractorModal
            onClose={() => setShowAddSubcontractorModal(false)}
            onSave={handleSaveSubcontractor}
            existingSubcontractor={selectedSubcontractor}
          />
        )}

        {showAddMandataireModal && (
          <AddMandataireModal
            onClose={() => setShowAddMandataireModal(false)}
            onSave={handleSaveMandataire}
            existingMandataire={selectedMandataire}
          />
        )}

        {showAddInformationModal && (
          <AddInformationModal
            onClose={() => setShowAddInformationModal(false)}
            onSave={handleSaveInformation}
            currentInfo={additionalInfo}
            // currentInfo={additionalInfo}
          />
        )}

        {showAddDPMairieModal && (
          <AddDPMairieModal
            onClose={() => setShowAddDPMairieModal(false)}
            onSave={handleSaveDPMairie}
            existingDpMairie={dpMairieData}
          />
        )}

        {showAddFinancingModal && (
          <AddFinancingModal
            onClose={() => setShowAddFinancingModal(false)}
            onSave={handleSaveFinancing}
            existingFinancing={financingData}
          />
        )}

        {showAddIndivisionModal && (
          <AddIndivisionModal
            onClose={() => setShowAddIndivisionModal(false)}
            onSave={handleSaveIndivision}
          />
        )}

        {showAddDocumentModal && (
          <AddDocumentModal
            onClose={() => setShowAddDocumentModal(false)}
            onSave={handleSaveDocuments}
          />
        )}

        {showAddIncentivesModal && (
            <AddIncentivesModal
              onClose={() => setShowAddIncentivesModal(false)}
              onSave={handleSaveIncentives}
              currentIncentives={incentivesData}
              tableItems={tableItems}
            />
        )}
        
        {showEditItemModal && editingItem && (
          <EditItemModal
            onClose={() => setShowEditItemModal(false)}
            onSave={handleSaveEditedItem}
            item={editingItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Send signature request modal component
const SendSignatureRequestModal: React.FC<{
  document: Document;
  onClose: () => void;
  onSend: () => void;
}> = ({ document, onClose, onSend }) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>(`Bonjour,\n\nVeuillez trouver ci-joint votre ${document.type === "devis" ? "devis" : "facture"} n°${document.reference} pour signature.\n\nCordialement,\nVotre entreprise`);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the API call to send the signature request
    onSend();
    onClose();
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
                <EnvelopeIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Envoyer une demande de signature
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
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Document</span>
                  <span className="text-lg font-semibold">{document.type === "devis" ? "Devis" : "Facture"} #{document.reference}</span>
                </div>
                <DocumentStatusBadge status={document.status} />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Client</span>
                  <span className="text-base">{document.clientName}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Montant</span>
                  <span className="text-base font-semibold">{document.montant}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email du destinataire
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="client@example.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700 inline-flex items-center"
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Document preview component with custom naming feature
const DocumentPreview: React.FC<{
  document: Document;
  onRequestSignature: (document: Document) => void;
  onSendReminder: (document: Document) => void;
  onEditDocument: (document: Document) => void;
  onUpdateCustomName: (documentId: string, customName: string) => void;
}> = ({ document, onRequestSignature, onSendReminder, onEditDocument, onUpdateCustomName }) => {
  const [customName, setCustomName] = useState<string>(document.customName || "");
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  // const [documents, setDocuments] = useState<Document[]>([]);

  
  // Update local state when document changes
  useEffect(() => {
    setCustomName(document.customName || "");
  }, [document.id, document.customName]);
  
  // Save custom name to parent component/database
  const saveCustomName = () => {
    onUpdateCustomName(document.id, customName);
    setIsCustomizing(false);
  };
  
  // Generate filename based on document type and custom name
  const getFileName = () => {
    const baseType = document.type === "devis" ? "Devis" : "Facture";
    
    if (customName) {
      // Replace spaces with underscores and remove special characters
      const sanitizedName = customName.replace(/\s+/g, '_').replace(/[^\w\-_.]/g, '');
      return `${baseType}_${sanitizedName}.pdf`;
    }
    
    return `${baseType}_${document.reference}.pdf`;
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Document header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            {/* Custom name section */}
            <div className="mb-2">
              {isCustomizing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ajouter un nom personnalisé..."
                    className="px-3 py-1.5 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                  <button 
                    onClick={saveCustomName}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  {customName ? (
                    <div className="text-blue-600 font-medium mb-1">{customName}</div>
                  ) : (
                    <button
                      onClick={() => setIsCustomizing(true)}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm mb-1"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Ajouter un nom personnalisé
                    </button>
                  )}
                  {customName && (
                    <button 
                      onClick={() => setIsCustomizing(true)} 
                      className="ml-2 text-gray-400 hover:text-blue-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {document.type === "devis" ? "Devis" : "Facture"} #{document.reference}
            </h2>
            <p className="text-gray-600">{document.clientName}</p>
          </div>
          <div className="flex flex-col items-end">
            <DocumentStatusBadge status={document.status} />
            <span className="text-sm text-gray-500 mt-2">Créé le {document.dateCreation}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Montant</span>
            <span className="text-xl font-bold text-gray-900">{document.montant}</span>
          </div>
          {document.type === "devis" && (
            <div>
              <span className="block text-sm font-medium text-gray-500">Validité</span>
              <span className="text-base text-gray-900">{document.dateExpiration || "Non définie"}</span>
            </div>
          )}
          {document.type === "facture" && (
            <div>
              <span className="block text-sm font-medium text-gray-500">Date d&apos;échéance</span>
              <span className="text-base text-gray-900">{document.dateDue || "Non définie"}</span>
            </div>
          )}
          <div>
            <span className="block text-sm font-medium text-gray-500">Signature</span>
            <div className="flex items-center mt-0.5">
              <SignatureStatusBadge status={document.signatureStatus} />
              {document.signatureDate && (
                <span className="text-xs text-gray-500 ml-2">
                  le {document.signatureDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Document preview iframe */}
      <div className="flex-grow relative bg-gray-100 rounded-lg overflow-hidden mb-4">
        {document.fileUrl ? (
          <div className="relative h-full">
            {/* Custom name badge overlay */}
            {customName && (
              <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium z-10">
                {customName}
              </div>
            )}
            <iframe 
              src={document.fileUrl}
              className="w-full h-full"
              title={`Aperçu du ${document.type} #${document.reference}`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500">Aperçu non disponible</p>
            {customName && (
              <div className="mt-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {customName}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Fichier de téléchargement: {getFileName()}
            </p>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-auto">
        <a 
          href={document.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <EyeIcon className="h-5 w-5 text-gray-500" />
          Visualiser
        </a>
        <a
          href={document.fileUrl}
          download={getFileName()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
          Télécharger
        </a>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <PrinterIcon className="h-5 w-5 text-gray-500" />
          Imprimer
        </button>
        
        <button
          onClick={() => onEditDocument(document)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <PencilIcon className="h-5 w-5 text-gray-500" />
          Modifier
        </button>
        
        {/* Signature status specific actions */}
        {document.signatureStatus === "non_demandé" && (
          <button
            onClick={() => onRequestSignature(document)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-auto"
          >
            <EnvelopeIcon className="h-5 w-5" />
            Demander une signature
          </button>
        )}
        {document.signatureStatus === "en_attente" && (
          <button
            onClick={() => onSendReminder(document)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition ml-auto"
          >
            <BellIcon className="h-5 w-5" />
            Envoyer un rappel
          </button>
        )}
      </div>
    </div>
  );
};

// Empty state component
const EmptyState: React.FC<{
  type: "all" | "devis" | "facture";
  onCreateNew: () => void;
}> = ({ type, onCreateNew }) => {
  const title = type === "devis" ? "Aucun devis" : type === "facture" ? "Aucune facture" : "Aucun document";
  const message = type === "devis" 
    ? "Vous n'avez pas encore créé de devis. Commencez par en créer un."
    : type === "facture" 
      ? "Vous n'avez pas encore créé de facture. Commencez par en créer une."
      : "Vous n'avez pas encore créé de documents. Commencez par en créer un.";
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        {type === "devis" ? (
          <DocumentIcon className="h-10 w-10 text-blue-600" />
        ) : type === "facture" ? (
          <DocumentTextIcon className="h-10 w-10 text-blue-600" />
        ) : (
          <DocumentCheckIcon className="h-10 w-10 text-blue-600" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md text-center">{message}</p>
      <button
        onClick={onCreateNew}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg transition hover:bg-blue-700 inline-flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-1" />
        {type === "devis" ? "Créer un devis" : type === "facture" ? "Créer une facture" : "Créer un document"}
      </button>
    </div>
  );
};

// Main tab component
const DevisFactureTab: React.FC<DevisFactureTabProps> = ({ contactId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "devis" | "facture">("all");
  const [filterSignature, setFilterSignature] = useState<SignatureStatus | "all">("all");
  const [sortKey, setSortKey] = useState<keyof Document>("dateCreation");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const [showDevisEditor, setShowDevisEditor] = useState<boolean>(false);
  // Function to update custom name for a specific document
const handleUpdateCustomName = (documentId: string, customName: string) => {
  // Update the document in the local state
  setDocuments(prevDocuments => 
    prevDocuments.map(doc => 
      doc.id === documentId 
        ? { ...doc, customName } 
        : doc
    )
  );
  
  // You would also want to save this to your backend/database
  // This is just a placeholder for where you would make that API call
  // saveDocumentCustomNameToDatabase(documentId, customName);
};
// Placeholder function for saving to database
// const saveDocumentCustomNameToDatabase = async (documentId: string, customName: string) => {
//   try {
//     // Example API call - replace with your actual implementation
//     await api.post('/documents/update-custom-name', {
//       documentId,
//       customName
//     });
    
//     // Optional: show success notification
//     // showNotification('Nom personnalisé enregistré');
//   } catch (error) {
//     console.error('Failed to save custom name:', error);
//     // Optional: show error notification
//     // showNotification('Échec de l\'enregistrement du nom personnalisé', 'error');
    
//     // You might want to revert the local state change on error
//   }
// };
  
  // Fetch documents on mount and when contactId changes
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This would be your actual API call
        // const response = await fetch(`/api/documents?contactId=${contactId}`);
        // if (!response.ok) throw new Error("Failed to fetch documents");
        // const data = await response.json();
        
        // For demonstration, we'll use mock data
        // In a real application, replace this with actual API calls
        setTimeout(() => {
          const mockDocuments: Document[] = [
            {
              id: "DE15032025-1",
              type: "devis",
              reference: "DE15032025-1",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "15/03/2025",
              dateExpiration: "15/04/2025",
              montant: "4 580,00 €",
              status: "signé",
              signatureStatus: "signé",
              signatureDate: "20/03/2025",
              fileUrl: ""
            },
            {
              id: "DE18032025-2",
              type: "devis",
              reference: "DE18032025-2",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "18/03/2025",
              dateExpiration: "18/04/2025",
              montant: "2 340,00 €",
              status: "envoyé",
              signatureStatus: "en_attente",
              fileUrl: ""
            },
            {
              id: "FA20032025-1",
              type: "facture",
              reference: "FA20032025-1",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "20/03/2025",
              dateDue: "20/04/2025",
              montant: "4 580,00 €",
              status: "payé",
              signatureStatus: "signé",
              signatureDate: "22/03/2025",
              fileUrl: ""
            },
            {
              id: "DE22032025-3",
              type: "devis",
              reference: "DE22032025-3",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "22/03/2025",
              dateExpiration: "22/04/2025",
              montant: "5 260,00 €",
              status: "brouillon",
              signatureStatus: "non_demandé",
              fileUrl: ""
            }
          ];
          
          setDocuments(mockDocuments);
          if (mockDocuments.length > 0) {
            setSelectedDocument(mockDocuments[0]);
          }
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Impossible de charger les documents. Veuillez réessayer.");
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [contactId]);
  
  // Helper functions for sorting and filtering
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filter by search query
      const matchesSearch = 
        doc.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.montant.includes(searchQuery);
      
      // Filter by document type
      const matchesType = 
        filterType === "all" || 
        (filterType === "devis" && doc.type === "devis") ||
        (filterType === "facture" && doc.type === "facture");
      
      // Filter by signature status
      const matchesSignature = 
        filterSignature === "all" || 
        doc.signatureStatus === filterSignature;
      
      return matchesSearch && matchesType && matchesSignature;
    }).sort((a, b) => {
      // Special case for date sorting
      if (sortKey === "dateCreation" || sortKey === "dateExpiration" || sortKey === "dateDue" || sortKey === "signatureDate") {
        const dateA = a[sortKey] ? new Date(a[sortKey].split('/').reverse().join('-')) : new Date(0);
        const dateB = b[sortKey] ? new Date(b[sortKey].split('/').reverse().join('-')) : new Date(0);

        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      
      // Special case for amount sorting (convert to number first)
      if (sortKey === "montant") {
        const amountA = parseFloat(a[sortKey].replace(/[€\s.]/g, "").replace(",", ".")) || 0;
        const amountB = parseFloat(b[sortKey].replace(/[€\s.]/g, "").replace(",", ".")) || 0;

        return sortDirection === "asc"
          ? amountA - amountB
          : amountB - amountA;
      }
      
      // Default string comparison
      const aValue = a[sortKey] ?? "";
      const bValue = b[sortKey] ?? "";
      if (aValue < bValue)
        return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue)
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [documents, searchQuery, filterType, filterSignature, sortKey, sortDirection]);
  
  // Statistics
  const stats = useMemo(() => {
    const devisCount = documents.filter(doc => doc.type === "devis").length;
    const factureCount = documents.filter(doc => doc.type === "facture").length;
    const pendingSignatureCount = documents.filter(doc => doc.signatureStatus === "en_attente").length;
    const signedCount = documents.filter(doc => doc.signatureStatus === "signé").length;
    
    // Calculate total amount based on document type
    const devisAmount = documents
      .filter(doc => doc.type === "devis")
      .reduce((sum, doc) => {
        const amount = parseFloat(doc.montant.replace(/[€\s.]/g, "").replace(",", ".")) || 0;
        return sum + amount;
      }, 0);
      
    const factureAmount = documents
      .filter(doc => doc.type === "facture")
      .reduce((sum, doc) => {
        const amount = parseFloat(doc.montant.replace(/[€\s.]/g, "").replace(",", ".")) || 0;
        return sum + amount;
      }, 0);
    
    return {
      devisCount,
      factureCount,
      pendingSignatureCount,
      signedCount,
      devisAmount: devisAmount.toLocaleString("fr-FR").replace(/,/g, " ") + " €",
      factureAmount: factureAmount.toLocaleString("fr-FR").replace(/,/g, " ") + " €"
    };
  }, [documents]);
  
  // Handle sort click
  const handleSort = (key: keyof Document) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };
  
  // Handle request signature
  const handleRequestSignature = (doc: Document) => {
    setSelectedDocument(doc);
    setShowSignatureModal(true);
  };
  
  // Handle send reminder
  const handleSendReminder = (doc: Document) => {
    // In a real app, this would make an API call to send a reminder
    alert(`Rappel envoyé pour le document ${doc.reference}`);
  };
  
  // Handle edit document
  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDevisEditor(true);
  };
  
  // Handle send signature request
  const handleSendSignatureRequest = () => {
    if (!selectedDocument) return;
    
    // In a real app, this would make an API call to send the signature request
    // For now, we'll update the document status locally
    setDocuments(docs => docs.map(doc => 
      doc.id === selectedDocument.id 
        ? { ...doc, signatureStatus: "en_attente" as SignatureStatus, status: "envoyé" as DocumentStatus } 
        : doc
    ));
    
    setSelectedDocument(prev => 
      prev ? { ...prev, signatureStatus: "en_attente", status: "envoyé" } : null
    );
    
    alert(`Demande de signature envoyée pour le document ${selectedDocument.reference}`);
  };
  
  // Handle create new document
  const handleCreateNew = () => {
    setShowDevisEditor(true);
    setSelectedDocument(null);
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-10 py-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-16 -mt-20 opacity-30" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-blue-300 rounded-full -mb-10 opacity-20" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-white text-blue-600 rounded-full w-16 h-16 mr-6 shadow-xl">
              <DocumentCheckIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                Devis & Factures
              </h2>
              <p className="text-blue-100 mt-1">Gestion des documents financiers et signatures</p>
            </div>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nouveau devis</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      {showDevisEditor ? (
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
          <DevisEditor 
            quoteId={selectedDocument?.id}
            onClose={() => setShowDevisEditor(false)}
          />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-blue-50 border-b border-blue-100">
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Devis</p>
                <p className="text-2xl font-bold text-gray-900">{stats.devisCount}</p>
                <p className="text-xs text-gray-600">{stats.devisAmount}</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Factures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.factureCount}</p>
                <p className="text-xs text-gray-600">{stats.factureAmount}</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
            >
              <div className="p-3 bg-amber-100 rounded-lg">
                <ClockIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">En attente de signature</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingSignatureCount}</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
            >
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Documents signés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.signedCount}</p>
              </div>
            </motion.div>
          </div>

          {/* Search, Filters and Sorting */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par référence, client ou montant..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-4 py-2 text-sm font-medium transition ${
                      filterType === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilterType("devis")}
                    className={`px-4 py-2 text-sm font-medium transition ${
                      filterType === "devis"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Devis
                  </button>
                  <button
                    onClick={() => setFilterType("facture")}
                    className={`px-4 py-2 text-sm font-medium transition ${
                      filterType === "facture"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Factures
                  </button>
                </div>
                
                <div className="relative">
                  <select
                    className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterSignature}
                    onChange={(e) => setFilterSignature(e.target.value as SignatureStatus | "all")}
                  >
                    <option value="all">Toutes signatures</option>
                    <option value="non_demandé">Non demandé</option>
                    <option value="en_attente">En attente</option>
                    <option value="signé">Signé</option>
                    <option value="refusé">Refusé</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={sortKey}
                    onChange={(e) => handleSort(e.target.value as keyof Document)}
                  >
                    <option value="dateCreation">Date de création</option>
                    <option value="reference">Référence</option>
                    <option value="montant">Montant</option>
                    {filterType !== "facture" && <option value="dateExpiration">Date d&apos;expiration</option>}
                    {filterType !== "devis" && <option value="dateDue">Date d&apos;échéance</option>}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Split View */}
          <div className="flex-grow flex overflow-hidden">
            {/* Left Panel - Document List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-500">Chargement des documents...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
                  <p className="text-gray-600 mb-6 text-center">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Réessayer
                  </button>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <EmptyState 
                  type={filterType}
                  onCreateNew={handleCreateNew}
                />
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <li
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className={`border-l-4 ${
                        selectedDocument?.id === doc.id
                          ? "border-l-blue-500 bg-blue-50"
                          : "border-l-transparent hover:bg-gray-50"
                      } transition-all cursor-pointer`}
                    >
                      <div className="p-4">
                        {/* Custom Name Display - Now at the top */}
                        {doc.customName && (
                          <div className="mb-2">
                            <span className="text-blue-700 font-medium inline-flex items-center">
                              <TagIcon className="h-4 w-4 mr-1" />
                              {doc.customName}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {doc.type === "devis" ? (
                              <DocumentIcon className="h-5 w-5 text-blue-600 mr-2" />
                            ) : (
                              <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                            )}
                            <span className="font-medium text-gray-900">{doc.reference}</span>
                          </div>
                          <DocumentStatusBadge status={doc.status} />
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">{doc.clientName}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 inline mr-1" />
                            {doc.dateCreation}
                          </div>
                          <div className="font-semibold">{doc.montant}</div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <SignatureStatusBadge status={doc.signatureStatus} />
                          <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                            <span>Détails</span>
                            <ChevronRightIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Right Panel - Document Preview */}
            <div className="flex-grow overflow-y-auto bg-white p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-500">Chargement des documents...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
                  <p className="text-gray-600 mb-6 text-center">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Réessayer
                  </button>
                </div>
              ) : !selectedDocument ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <DocumentCheckIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun document sélectionné</h3>
                  <p className="text-gray-500 mb-6 max-w-md text-center">
                    Sélectionnez un document dans la liste pour voir les détails.
                  </p>
                </div>
              ) : (
                
                <DocumentPreview 
                  document={selectedDocument}
                  onRequestSignature={handleRequestSignature}
                  onSendReminder={handleSendReminder}
                  onEditDocument={handleEditDocument}
                  onUpdateCustomName={handleUpdateCustomName}
                />
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Signature Request Modal */}
      <AnimatePresence>
        {showSignatureModal && selectedDocument && (
          <SendSignatureRequestModal 
            document={selectedDocument}
            onClose={() => setShowSignatureModal(false)}
            onSend={handleSendSignatureRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevisFactureTab;