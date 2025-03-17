import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Button } from "@/components/ui/Button";
import { Check, X, Search, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  assignedRegie?: string; // Added to match the requirement
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  assignedRegie?: string; // Added to match the requirement
}

interface Ticket {
  ticket: string;
  status: string;
  priority: string;
  contactId: string;
  customerFirstName: string;
  customerLastName: string;
  problem: string;
  notes: string;
  technicianId: string;
  technicianFirstName: string;
  technicianLastName: string;
  createdAt: string;
  assignedRegie?: string; // Added to match the requirement
}

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

// Define a type that includes all common properties needed for display
interface NamedItem {
  id: string;
  firstName: string;
  lastName: string;
}


/* Improved searchable dropdown with better UX and design */
function Dropdown<T extends NamedItem>({
  items,
  selectedItem,
  onSelect,
  placeholder,
  nameFormat,
  dropDirection = "down",
  required = false,
}: {
  items: T[];
  selectedItem: string;
  onSelect: (id: string) => void;
  placeholder: string;
  nameFormat: (item: T) => string;
  dropDirection?: "up" | "down";
  required?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If an item is already selected, show its full name in the input
  useEffect(() => {
    if (selectedItem) {
      const itemObj = items.find((item) => item.id === selectedItem);
      if (itemObj) {
        setSearch(nameFormat(itemObj));
      } else {
        setSearch('');
      }
    } else {
      setSearch('');
    }
  }, [selectedItem, items, nameFormat]);

  // Filter items based on the search query
  const filteredItems = items.filter((item) =>
    nameFormat(item).toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: T) => {
    onSelect(item.id);
    setSearch(nameFormat(item));
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
    // Clear selection if search is cleared
    if (e.target.value === '' && selectedItem) {
      onSelect('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`
            mt-1 block w-full border ${selectedItem ? 'border-blue-500' : 'border-gray-300'} 
            rounded-md p-2 pl-8 pr-8 focus:ring-2 focus:ring-blue-300 focus:outline-none
            transition-all duration-200
            ${required && !selectedItem ? 'border-red-300 focus:ring-red-200' : ''}
          `}
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {isOpen ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </button>
      </div>

      {/* Dropdown list with position based on dropDirection */}
      {isOpen && (
        <ul 
          className={`
            absolute z-10 bg-white border border-gray-200 rounded-md w-full max-h-60 
            overflow-auto ${dropDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"}
            shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100
          `}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className={`
                  cursor-pointer hover:bg-blue-50 p-2 transition-colors duration-150
                  ${item.id === selectedItem ? 'bg-blue-50' : ''}
                `}
                onClick={() => handleSelect(item)}
              >
                <div className="flex items-center justify-between">
                  <span>{nameFormat(item)}</span>
                  {item.id === selectedItem && <Check className="h-4 w-4 text-blue-500" />}
                </div>
              </li>
            ))
          ) : (
            <li className="p-3 text-sm text-gray-500 text-center">
              Aucun résultat trouvé
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function NewTicketModal({ isOpen, onClose, onTicketCreated }: NewTicketModalProps) {
  // Form fields
  const [ticketCode, setTicketCode] = useState('');
  const [client, setClient] = useState('');
  const [problem, setProblem] = useState('');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [technician, setTechnician] = useState('');
  
  // Add state for current user's regie ID
  const [currentUserRegieId, setCurrentUserRegieId] = useState<string | null>(null);

  // Form validation
  const [touched, setTouched] = useState({
    client: false,
    problem: false,
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Dropdown lists
  const [clients, setClients] = useState<Contact[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);

  // Loading/error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get user info from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const proInfoString = localStorage.getItem('proInfo');
        if (proInfoString) {
          const proInfo = JSON.parse(proInfoString);
          setCurrentUserRegieId(proInfo.id || null);
        }
      } catch (error) {
        console.error("Error parsing proInfo from localStorage:", error);
      }
    }
  }, []);

  // Format names for display
  const formatClientName = (client: Contact) => `${client.firstName} ${client.lastName}`;
  const formatTechnicianName = (tech: User) => `${tech.lastName} ${tech.firstName}`;

  // Validate form
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!client) errors.client = "Un client est requis";
    // Minimum length requirement (adjustable as needed)
    if (!problem || problem.trim().length < 5) errors.problem = "Une description détaillée du problème est requise";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Auto-generate the ticket code when the modal opens and reset the form
  useEffect(() => {
    if (isOpen) {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setTicketCode(`TKT-${year}-${randomNum}`);
      
      // Reset form fields and errors
      setClient('');
      setProblem('');
      setStatus('open');
      setPriority('medium');
      setNotes('');
      setTechnician('');
      setError('');
      setSuccess(false);
      setFormErrors({});
      setTouched({
        client: false,
        problem: false,
      });
    }
  }, [isOpen]);

  // Fetch clients (contacts) from your API - filtered by assignedRegie
  useEffect(() => {
    if (isOpen) {
      fetch('/api/contacts')
        .then((res) => res.json())
        .then((data: Contact[]) => {
          // Filter contacts by assignedRegie if currentUserRegieId exists
          const filteredData = currentUserRegieId 
            ? data.filter(contact => contact.assignedRegie === currentUserRegieId)
            : data;
          setClients(filteredData);
        })
        .catch((err) => console.error('Error fetching contacts:', err));
    }
  }, [isOpen, currentUserRegieId]);

  // Fetch technicians (users) from your API and filter only by role (no assignedRegie filter)
  useEffect(() => {
    if (isOpen) {
      fetch('/api/users')
        .then((res) => res.json())
        .then((data: User[]) => {
          // Only filter by role, show all technicians regardless of assignedRegie
          const filteredUsers = data.filter(
            (user) =>
              user.role === 'Technician / Installer' || user.role === 'Installer'
          );
          
          setTechnicians(filteredUsers);
        })
        .catch((err) => console.error('Error fetching users:', err));
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    setTouched({
      client: true,
      problem: true,
    });
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Look up the selected client and technician from the dropdown lists
    const selectedClient = clients.find(c => c.id === client);
    const selectedTech = technicians.find(t => t.id === technician);
    
    setLoading(true);
    const newTicket: Ticket = {
      ticket: ticketCode, // Référence
      status,           // Status
      priority,         // Priorité
      // Client: send both the contactId and the client's first and last names
      contactId: selectedClient ? selectedClient.id : '',
      customerFirstName: selectedClient ? selectedClient.firstName : '',
      customerLastName: selectedClient ? selectedClient.lastName : '',
      problem,          // Problème
      notes,            // Notes complémentaires
      // Technicien assigné: send both the technician's id and name details
      technicianId: selectedTech ? selectedTech.id : '',
      technicianFirstName: selectedTech ? selectedTech.firstName : '',
      technicianLastName: selectedTech ? selectedTech.lastName : '',
      createdAt: new Date().toISOString(),
      // Add the assignedRegie field from the current user
      assignedRegie: currentUserRegieId || undefined,
    };

    // Post the new ticket to your API (endpoint updated to /api/ticket)
    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket),
    })
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
        setSuccess(true);
        // After success, reload the page after 1 second
        setTimeout(() => {
          if (onTicketCreated) onTicketCreated(newTicket);
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.error('Error creating ticket:', err);
        setError('Erreur lors de la création du ticket');
        setLoading(false);
      });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  if (!isOpen) return null;

  // Priority color mapping
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Modal title="Créer un nouveau ticket" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top section with ticket info and status */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            {/* Ticket Code (Auto-generated) */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Référence</label>
              <div className="font-mono font-bold text-lg text-gray-800">{ticketCode}</div>
            </div>
            
            {/* Status and Priority badges */}
            <div className="flex space-x-2">
              <div className="flex flex-col items-end">
                <label className="text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`
                    rounded-full px-3 py-1 text-sm font-medium
                    ${status === 'open' ? 'bg-blue-100 text-blue-800' : 
                      status === 'pending' ? 'bg-purple-100 text-purple-800' : 
                      'bg-gray-100 text-gray-800'}
                    border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none
                  `}
                >
                  <option value="open">Ouvert</option>
                  <option value="pending">En attente</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>
              
              <div className="flex flex-col items-end">
                <label className="text-xs text-gray-500 mb-1">Priorité</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`
                    rounded-full px-3 py-1 text-sm font-medium
                    ${priorityColors[priority as keyof typeof priorityColors]}
                    border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none
                  `}
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Client Dropdown with Integrated Search */}
        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Client <span className="text-red-500">*</span>
            </label>
            {touched.client && formErrors.client && (
              <span className="text-xs text-red-500 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {formErrors.client}
              </span>
            )}
          </div>
          <Dropdown<Contact>
            items={clients}
            selectedItem={client}
            onSelect={(id) => setClient(id)}
            placeholder="Rechercher un client..."
            nameFormat={formatClientName}
            required={true}
          />
          {clients.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Aucun client disponible. Veuillez vérifier vos autorisations ou contacter un administrateur.
            </p>
          )}
        </div>

        {/* Problème */}
        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Problème <span className="text-red-500">*</span>
            </label>
            {touched.problem && formErrors.problem && (
              <span className="text-xs text-red-500 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {formErrors.problem}
              </span>
            )}
          </div>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onBlur={() => handleBlur('problem')}
            className={`
              mt-1 block w-full border rounded-md p-3 min-h-24
              focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200
              ${touched.problem && formErrors.problem ? 'border-red-300' : 'border-gray-300'}
            `}
            placeholder="Décrivez le problème en détail..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes complémentaires
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 min-h-24 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="Informations complémentaires, détails techniques, historique..."
          />
        </div>

        {/* Technicien Dropdown with Integrated Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Technicien assigné
          </label>
          <Dropdown<User>
            items={technicians}
            selectedItem={technician}
            onSelect={(id) => setTechnician(id)}
            placeholder="Rechercher un technicien..."
            nameFormat={formatTechnicianName}
            dropDirection="up"
          />
          {!technician && (
            <p className="text-xs text-gray-500 mt-1">
              Aucun technicien assigné. Le ticket sera visible par tous les techniciens.
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">Ticket créé avec succès!</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl px-4 py-2 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading || success}
            className="bg-[#213f5b] hover:bg-[#162c41] text-white rounded-xl shadow-md px-5 py-2 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Créé
              </>
            ) : (
              "Créer Ticket"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
