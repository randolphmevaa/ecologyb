import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale/fr';
import { format, addHours } from "date-fns";

// Define proper interfaces for our data types
interface Organization {
  id: string;
  name: string;
  type: "CEE" | "MPR";
  logo: string;
}

interface Controller {
  id: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
}

interface Client {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
}

interface NewTaskModalProps {
  showNewTaskModal: boolean;
  setShowNewTaskModal: (show: boolean) => void;
  organizations: Organization[];
  controllers: Controller[];
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  showNewTaskModal,
  setShowNewTaskModal,
  organizations,
  controllers
}) => {
  // Fixed state definitions with proper types - MOVED BEFORE ANY CONDITIONALS
  const [newTaskOrg, setNewTaskOrg] = useState<string>("");
  const [newTaskController, setNewTaskController] = useState<string>("");
  const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);
  const [clientSearch, setClientSearch] = useState<string>("");
  // We'll remove selectedClient if it's unused, or keep it and use it
  // I'll keep it for now since the code uses it when selecting a client
  const [ , setSelectedClient] = useState<Client | null>(null);
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");
  const [sendDocs, setSendDocs] = useState<boolean>(false);
  const [controlDate, setControlDate] = useState<Date | null>(new Date());
  
  // New state for improved time slot selection
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("");
  const [customStartTime, setCustomStartTime] = useState<Date | null>(new Date());
  const [customEndTime, setCustomEndTime] = useState<Date | null>(
    customStartTime ? addHours(customStartTime, 2) : null
  );
  const [isCustomTimeRange, setIsCustomTimeRange] = useState<boolean>(false);

  // Handle closing the modal
  const handleClose = () => {
    console.log("Closing modal"); // For debugging
    setShowNewTaskModal(false);
  };

  // Predefined time slots
  const timeSlots: TimeSlot[] = [
    { id: "08-10", start: "08:00", end: "10:00", label: "08:00 - 10:00" },
    { id: "10-12", start: "10:00", end: "12:00", label: "10:00 - 12:00" },
    { id: "12-14", start: "12:00", end: "14:00", label: "12:00 - 14:00" },
    { id: "14-16", start: "14:00", end: "16:00", label: "14:00 - 16:00" },
    { id: "16-18", start: "16:00", end: "18:00", label: "16:00 - 18:00" },
    { id: "custom", start: "", end: "", label: "Personnalisé" }
  ];

  // Sample client data
  const clients: Client[] = [
    { id: 1, name: "Martin Dupont", email: "martin.dupont@example.com", phone: "06 12 34 56 78", address: "15 Rue de la Paix, 75001 Paris" },
    { id: 2, name: "Sophie Martin", email: "sophie.martin@example.com", phone: "07 23 45 67 89", address: "27 Avenue Victor Hugo, 69003 Lyon" },
    { id: 3, name: "Philippe Durand", email: "philippe.durand@example.com", phone: "06 78 91 23 45", address: "8 Boulevard Magenta, 33000 Bordeaux" },
    { id: 4, name: "Claire Lefevre", email: "claire.lefevre@example.com", phone: "06 54 32 19 87", address: "42 Rue du Commerce, 44000 Nantes" },
    { id: 5, name: "Julien Blanc", email: "julien.blanc@example.com", phone: "07 32 14 56 98", address: "3 Rue des Fleurs, 67000 Strasbourg" },
    { id: 6, name: "Émilie Dubois", email: "emilie.dubois@example.com", phone: "06 12 37 89 45", address: "17 Avenue Jean Jaurès, 59000 Lille" },
    { id: 7, name: "Thomas Moreau", email: "thomas.moreau@example.com", phone: "07 65 43 21 09", address: "5 Place Bellecour, 69002 Lyon" }
  ];

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone.includes(clientSearch)
  );

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeRange(slotId);
    setIsCustomTimeRange(slotId === "custom");
  };

  // Handle custom time change
  const handleCustomStartTimeChange = (time: Date | null) => {
    setCustomStartTime(time);
    if (time) {
      // Set end time 2 hours after start time by default
      const newEndTime = new Date(time);
      newEndTime.setHours(time.getHours() + 2);
      setCustomEndTime(newEndTime);
    }
  };

  // Format time range for display
  const getDisplayTimeRange = () => {
    if (isCustomTimeRange && customStartTime && customEndTime) {
      return `${format(customStartTime, 'HH:mm')} - ${format(customEndTime, 'HH:mm')}`;
    }
    
    const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeRange);
    return selectedSlot ? selectedSlot.label : "Sélectionner une tranche";
  };

  // Return null if the modal shouldn't be shown - AFTER all hooks are declared
  if (!showNewTaskModal) {
    return null;
  }

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
        onClick={handleClose}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
        >
          <div className="p-6 bg-gradient-to-r from-[#213f5b] to-[#1d3349] flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Nouveau contrôle sur site</h2>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre du contrôle</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                    placeholder="Ex: Contrôle installation PAC air-eau"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type d&apos;installation</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition">
                    <option value="">Sélectionner un type</option>
                    <option value="mono-geste">Mono-geste</option>
                    <option value="financement">Financement</option>
                    <option value="renovation">Rénovation d&apos;ampleur</option>
                    <option value="photovoltaique">Panneaux photovoltaique</option>
                  </select>
                </div>
                
                {/* Organisme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organisme</label>
                  <div className="relative">
                    <div className="flex flex-col space-y-2">
                      {organizations.map(org => (
                        <div 
                          key={org.id}
                          onClick={() => setNewTaskOrg(org.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            newTaskOrg === org.id 
                              ? "border-[#4facfe] bg-[#4facfe]/5 shadow-sm" 
                              : "border-gray-200 hover:border-[#4facfe]/50 hover:bg-[#4facfe]/5"
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md p-1 border border-gray-100">
                            <img 
                              src={org.logo} 
                              alt={org.name} 
                              className="h-6 object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{org.name}</p>
                            <span className="text-xs text-gray-500">{org.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Bureau de contrôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bureau de contrôle</label>
                  <div className="relative">
                    <div className="flex flex-col space-y-2">
                      {controllers.map(controller => (
                        <div 
                          key={controller.id}
                          onClick={() => setNewTaskController(controller.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            newTaskController === controller.id 
                              ? "border-[#4facfe] bg-[#4facfe]/5 shadow-sm" 
                              : "border-gray-200 hover:border-[#4facfe]/50 hover:bg-[#4facfe]/5"
                          }`}
                        >
                          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md p-1 border border-gray-100">
                            <img 
                              src={controller.logo} 
                              alt={controller.name} 
                              className="h-10 object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{controller.name}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <EnvelopeIcon className="h-3 w-3" />
                              <span>{controller.email}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                              <PhoneIcon className="h-3 w-3" />
                              <span>{controller.phone}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Date de contrôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de contrôle</label>
                  <DatePicker
                    selected={controlDate}
                    onChange={(date: Date | null) => setControlDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                    locale={fr}
                  />
                </div>
                
                {/* IMPROVED Tranche horaire UI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tranche horaire</label>
                  <div className="space-y-3">
                    {/* Visual time blocks */}
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.slice(0, 5).map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleTimeSlotSelect(slot.id)}
                          className={`p-3 text-sm font-medium rounded-lg transition-all ${
                            selectedTimeRange === slot.id
                              ? "bg-[#4facfe] text-white shadow-md"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleTimeSlotSelect("custom")}
                        className={`p-3 text-sm font-medium rounded-lg transition-all ${
                          isCustomTimeRange
                            ? "bg-[#4facfe] text-white shadow-md"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Personnalisé
                      </button>
                    </div>
                    
                    {/* Custom time range inputs */}
                    {isCustomTimeRange && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Début</label>
                            <DatePicker
                              selected={customStartTime}
                              onChange={handleCustomStartTimeChange}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Heure"
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                              locale={fr}
                            />
                          </div>
                          <div className="flex-none pt-5">
                            <span className="text-gray-500">à</span>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Fin</label>
                            <DatePicker
                              selected={customEndTime}
                              onChange={(date: Date | null) => setCustomEndTime(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Heure"
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                              locale={fr}
                              minTime={customStartTime || undefined}
                              maxTime={new Date(0, 0, 0, 23, 59)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Selected time range display */}
                    {selectedTimeRange && (
                      <div className="mt-2 p-2 bg-[#4facfe]/10 rounded-lg border border-[#4facfe]/30">
                        <p className="text-sm text-[#4facfe]">
                          <span className="font-medium">Horaire sélectionné:</span> {getDisplayTimeRange()}
                        </p>
                      </div>
                    )}
                    
                    {/* Availability indicator (visual cue) */}
                    <div className="mt-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs text-gray-500">Disponible pour cette date et heure</span>
                    </div>
                  </div>
                </div>
                
                {/* Client selection with autocomplete */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Commencez à taper pour rechercher un client..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                      onClick={() => setShowClientDropdown(true)}
                      onChange={(e) => setClientSearch(e.target.value)}
                      value={clientName}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Client dropdown */}
                    {showClientDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                        {filteredClients.length > 0 ? (
                          filteredClients.map(client => (
                            <div 
                              key={client.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedClient(client);
                                setClientName(client.name);
                                setClientEmail(client.email);
                                setClientPhone(client.phone);
                                setClientAddress(client.address);
                                setShowClientDropdown(false);
                              }}
                            >
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-gray-600">{client.email} • {client.phone}</div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">Aucun client trouvé</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Auto-filled client information fields - editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                    placeholder="Adresse complète"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email du client</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                    placeholder="client@exemple.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone du client</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                    placeholder="Ex: 0612345678"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
                
                {/* Document sending option */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Envoyé doc au client</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio h-4 w-4 text-[#4facfe]" 
                        name="send_doc" 
                        value="oui"
                        onChange={() => setSendDocs(true)}
                      />
                      <span className="ml-2 text-sm text-gray-700">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio h-4 w-4 text-[#4facfe]" 
                        name="send_doc" 
                        value="non"
                        onChange={() => setSendDocs(false)}
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Non</span>
                    </label>
                  </div>
                </div>
                
                {/* Conditional document upload section - only shows if sendDocs is true */}
                {sendDocs && (
                  <div className="md:col-span-2">
                    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-center flex-col">
                        <svg className="h-12 w-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 mb-1">Inséré les documents à envoyer au client</p>
                        <p className="text-xs text-gray-500 mb-3">Le client recevra les documents par email et une notification par SMS</p>
                        <button 
                          type="button"
                          className="px-4 py-2 bg-[#4facfe] text-white rounded-lg hover:bg-[#3b82f6] transition text-sm"
                        >
                          Choisir les fichiers
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button 
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button 
              type="button"
              onClick={() => {
                alert("Contrôle créé avec succès!");
                setShowNewTaskModal(false);
              }}
              className="px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#1a324a] transition"
            >
              Créer le contrôle
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Emergency close button */}
      <button 
        className="fixed top-4 right-4 z-[10000] bg-red-600 text-white p-2 rounded-full shadow-lg"
        onClick={handleClose}
        aria-label="Close modal"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </AnimatePresence>
  );
};

export default NewTaskModal;