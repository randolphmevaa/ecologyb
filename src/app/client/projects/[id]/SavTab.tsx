"use client";
import { useState, useEffect, FormEvent } from 'react';

  // Définition des interfaces pour nos types de données
interface Conversation {
  sender: 'technicien' | 'client' | null;
  message: string | null;
  timestamp: string | null;
}

interface TicketStats {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  averageResolutionTime?: string;
}

interface Ticket {
  _id: string;
  ticket: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'high' | 'medium' | 'low';
  contactId: string;
  customerFirstName: string;
  customerLastName: string;
  problem: string;
  notes?: string;
  technicianId?: string;
  technicianFirstName?: string;
  technicianLastName?: string;
  createdAt: string;
  location?: string;
  start?: string;
  end?: string;
  participants?: string;
  title?: string;
  type?: string;
  conversation?: Conversation[];
}

interface SavTabProps {
  contactId: string;
}

export default function SavTab({ contactId }: SavTabProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tickets?contactId=${contactId}`);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des tickets: ${response.statusText}`);
        }
        
        const data: Ticket[] = await response.json();
        setTickets(data);
        // Auto-sélection du premier ticket si disponible
        if (data.length > 0) {
          setSelectedTicket(data[0]);
        }
        
        // Calcul des statistiques
        const stats: TicketStats = {
          totalTickets: data.length,
          openTickets: data.filter(t => t.status === 'open' || t.status === 'in-progress').length,
          closedTickets: data.filter(t => t.status === 'closed').length
        };
        setTicketStats(stats);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
        setError(errorMessage);
        console.error("Échec de la récupération des tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (contactId) {
      fetchTickets();
    }
  }, [contactId]);

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTicket) return;
    
    // Dans une implémentation réelle, ceci enverrait le message à l'API
    console.log(`Envoi d'un message au ticket ${selectedTicket.ticket}: ${newMessage}`);
    
    // Mise à jour optimiste de l'interface
    const updatedTicket: Ticket = {
      ...selectedTicket,
      conversation: [
        ...(selectedTicket.conversation || []),
        {
          sender: "technicien",
          message: newMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Mise à jour du ticket sélectionné et de la liste des tickets
    setSelectedTicket(updatedTicket);
    setTickets(tickets.map(t => t._id === updatedTicket._id ? updatedTicket : t));
    
    // Vidage du champ de saisie
    setNewMessage('');
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const translateStatus = (status: string): string => {
    switch(status) {
      case 'open': return 'Ouvert';
      case 'in-progress': return 'En cours';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  const translatePriority = (priority: string): string => {
    switch(priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ticket.customerFirstName + ' ' + ticket.customerLastName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Support / SAV</h2>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Support / SAV</h2>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Erreur lors du chargement des tickets: {error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Support / Service Après-Vente</h2>
          <button 
            onClick={() => setShowStatsModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistiques
          </button>
        </div>
      </div>
      
      {/* Modal de statistiques */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Statistiques des tickets</h3>
              <button 
                onClick={() => setShowStatsModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                <div className="text-3xl font-bold text-blue-700">{ticketStats.totalTickets}</div>
                <div className="text-sm text-blue-600 mt-1">Total des tickets</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                <div className="text-3xl font-bold text-green-700">{ticketStats.openTickets}</div>
                <div className="text-sm text-green-600 mt-1">Tickets ouverts</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <div className="text-3xl font-bold text-gray-700">{ticketStats.closedTickets}</div>
                <div className="text-sm text-gray-600 mt-1">Tickets fermés</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Distribution des priorités</h4>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${(tickets.filter(t => t.priority === 'high').length / tickets.length) * 100}%` }}
                    title={`Haute: ${tickets.filter(t => t.priority === 'high').length} tickets`}
                  />
                  <div 
                    className="bg-amber-500" 
                    style={{ width: `${(tickets.filter(t => t.priority === 'medium').length / tickets.length) * 100}%` }}
                    title={`Moyenne: ${tickets.filter(t => t.priority === 'medium').length} tickets`}
                  />
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(tickets.filter(t => t.priority === 'low').length / tickets.length) * 100}%` }}
                    title={`Basse: ${tickets.filter(t => t.priority === 'low').length} tickets`}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  Haute: {tickets.filter(t => t.priority === 'high').length}
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                  Moyenne: {tickets.filter(t => t.priority === 'medium').length}
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  Basse: {tickets.filter(t => t.priority === 'low').length}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowStatsModal(false)}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      
      {tickets.length === 0 ? (
        <div className="p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 mt-4">Aucun ticket de support trouvé pour ce contact.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] max-h-[800px]">
          {/* Sidebar liste des tickets */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un ticket..."
                  className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Tickets ({filteredTickets.length})</h3>
                <div className="flex space-x-1">
                  <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  </button>
                  <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto flex-grow">
              {filteredTickets.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucun résultat pour &quot;{searchTerm}&quot;
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div 
                    key={ticket._id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition ${selectedTicket?._id === ticket._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                    onClick={() => handleTicketSelect(ticket)}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{ticket.ticket}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(ticket.status)}`}>
                        {translateStatus(ticket.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate font-medium my-1">{ticket.problem}</div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(ticket.createdAt).split('à')[0]}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full ${getPriorityClass(ticket.priority)}`}>
                        {translatePriority(ticket.priority)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Détails du ticket et conversation */}
          <div className="w-full md:w-2/3 flex flex-col h-full">
            {selectedTicket ? (
              <>
                {/* En-tête des détails du ticket */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{selectedTicket.ticket}</h3>
                      <div className="text-sm text-gray-600">{selectedTicket.problem}</div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(selectedTicket.status)}`}>
                        {translateStatus(selectedTicket.status)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(selectedTicket.priority)}`}>
                        {translatePriority(selectedTicket.priority)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium text-gray-700">Client:</span> 
                      <span className="ml-1">{selectedTicket.customerFirstName} {selectedTicket.customerLastName}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-700">Créé le:</span> 
                      <span className="ml-1">{formatDate(selectedTicket.createdAt)}</span>
                    </div>
                    {selectedTicket.technicianFirstName && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium text-gray-700">Technicien:</span> 
                        <span className="ml-1">{selectedTicket.technicianFirstName} {selectedTicket.technicianLastName}</span>
                      </div>
                    )}
                    {selectedTicket.location && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium text-gray-700">Lieu:</span> 
                        <span className="ml-1">{selectedTicket.location}</span>
                      </div>
                    )}
                    {selectedTicket.start && selectedTicket.end && (
                      <div className="col-span-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-gray-700">Intervention:</span> 
                        <span className="ml-1">Du {formatDate(selectedTicket.start)} au {formatDate(selectedTicket.end)}</span>
                      </div>
                    )}
                    {selectedTicket.notes && (
                      <div className="col-span-2 mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <span className="font-medium text-gray-700">Notes:</span> 
                            <p className="mt-1 text-gray-700">{selectedTicket.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Section de conversation */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedTicket.conversation && selectedTicket.conversation.length > 0 ? (
                    selectedTicket.conversation
                      .filter(msg => msg.sender && msg.message) // Filtrer les entrées nulles
                      .map((msg, index) => (
                        <div 
                          key={index} 
                          className={`flex ${msg.sender === 'technicien' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.sender === 'client' && (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 text-white font-bold">
                              {selectedTicket.customerFirstName.charAt(0)}
                            </div>
                          )}
                          <div 
                            className={`max-w-xs md:max-w-md rounded-lg p-3 shadow-sm
                              ${msg.sender === 'technicien' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-800 border border-gray-200'}`}
                          >
                            <p className={`text-sm ${msg.sender === 'technicien' ? 'text-white' : 'text-gray-800'}`}>{msg.message}</p>
                            <p className={`text-xs mt-1 text-right ${msg.sender === 'technicien' ? 'text-blue-200' : 'text-gray-500'}`}>
                              {formatDate(msg.timestamp)}
                            </p>
                          </div>
                          {msg.sender === 'technicien' && (
                            <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center ml-2 text-white font-bold">
                              {selectedTicket.technicianFirstName?.charAt(0) || 'T'}
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-gray-500 mt-4">Aucune conversation disponible pour ce ticket.</p>
                      {selectedTicket.status !== 'closed' && (
                        <p className="text-gray-500 mt-2">Commencez la conversation ci-dessous.</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Saisie de message */}
                {selectedTicket.status !== 'closed' ? (
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tapez votre message..."
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                        disabled={!newMessage.trim()}
                      >
                        <span>Envoyer</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex mt-2 text-sm text-gray-500 justify-end">
                      <button type="button" className="flex items-center mr-3 hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>Pièce jointe</span>
                      </button>
                      <button type="button" className="flex items-center hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Emoji</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      <span>Ce ticket est fermé. Vous ne pouvez plus y répondre.</span>
                    </div>
                    <button 
                      className="mt-3 inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Rouvrir le ticket
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 mt-4">Sélectionnez un ticket pour voir les détails et la conversation.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition flex items-center border border-blue-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Nouveau ticket
                </button>
                
                {tickets.length > 0 && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Statistiques rapides</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded border border-blue-100">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-lg font-bold text-blue-700">{ticketStats.totalTickets}</div>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-100">
                        <div className="text-sm text-gray-600">Ouverts</div>
                        <div className="text-lg font-bold text-green-600">{ticketStats.openTickets}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}