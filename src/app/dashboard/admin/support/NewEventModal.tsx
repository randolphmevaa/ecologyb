import React, { useState, useEffect } from 'react';
import { 
  X, 
  CalendarPlus, 
  MapPin, 
  UserCircle, 
  Clock, 
  Ticket, 
  AlertTriangle,
  Check 
} from 'lucide-react';

interface Ticket {
  id: string;
  title?: string;
  description?: string;
}

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (eventData: {
    title: string;
    participant: string;
    location: string;
    type: string;
    startTime: string;
    endTime: string;
    ticketId: string;
  }) => void;
}

const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [participant, setParticipant] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Refined color palette for event types
  // const eventTypeColors = {
  //   'Réunion': 'bg-blue-50 text-blue-700',
  //   'Conférence': 'bg-green-50 text-green-700',
  //   'Atelier': 'bg-purple-50 text-purple-700',
  //   'Autre': 'bg-gray-50 text-gray-700'
  // };

  // Event type suggestions
  const eventTypeSuggestions = [
    'Réunion', 'Conférence', 'Atelier', 'Présentation', 'Formation', 'Autre'
  ];

  useEffect(() => {
    if (isOpen) {
      fetch('/api/tickets')
        .then((res) => res.json())
        .then((data) => setTickets(data))
        .catch((err) => {
          console.error(err);
          setError('Impossible de charger les tickets');
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Enhanced validation
    if (!title.trim()) {
      setError('Le titre de l\'événement est requis');
      setLoading(false);
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError('La date de fin doit être postérieure à la date de début');
      setLoading(false);
      return;
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      const newEvent = {
        title,
        participant,
        location,
        type: eventType || 'Autre',
        startTime,
        endTime,
        ticketId: selectedTicketId,
      };
      
      onEventCreated(newEvent);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch {
      setError('Erreur lors de la création de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out scale-100 hover:scale-[1.01]">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-4 text-lg font-semibold text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CalendarPlus className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-white">Créer un Événement</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white transition-colors rounded-full p-2 hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8 space-y-6 bg-gray-50/50">
          {/* Animated Error/Success Messages */}
          {error && (
            <div className="animate-shake bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="animate-bounce bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center">
              <Check className="w-6 h-6 text-green-500 mr-3" />
              <p className="text-green-700 font-medium">Événement créé avec succès!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title with Enhanced Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre de l&apos;Événement
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nom descriptif de l'événement"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all duration-300 ease-in-out"
                  required
                />
              </div>
            </div>

            {/* Event Type with Suggestions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type d&apos;Événement
              </label>
              <div className="flex flex-wrap gap-2">
                {eventTypeSuggestions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventType(type)}
                    className={`
                      px-3 py-1 rounded-full text-sm 
                      ${eventType === type 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      transition-all duration-200
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Datetime Inputs with Advanced Styling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date et Heure de Début
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date et Heure de Fin
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Participant
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={participant}
                    onChange={(e) => setParticipant(e.target.value)}
                    placeholder="Nom du participant"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lieu
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Adresse ou emplacement"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Association */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Associer un Ticket
              </label>
              <select
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition-all duration-300 ease-in-out"
              >
                <option value="">-- Sélectionner un Ticket --</option>
                {tickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.title || `Ticket #${ticket.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 
                rounded-xl transition duration-300 ease-in-out"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="px-6 py-3 bg-[#213f5b] text-white rounded-xl 
                hover:bg-[#162c41] focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2 
                transition duration-300 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center"
              >
                {loading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Création en cours...
                  </>
                ) : success ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Événement Créé
                  </>
                ) : (
                  "Créer l'Événement"
                )}
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default NewEventModal;