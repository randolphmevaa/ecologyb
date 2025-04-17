// SavTab.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClockIcon, 
  PlusIcon, 
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ChevronRightIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  FireIcon,
  BoltIcon,
  LifebuoyIcon
} from "@heroicons/react/24/outline";
import AddTicketForm from "../../contacts-organizations copy/components/AddTicketForm";

interface SavTabProps {
  contactId: string | number;
}

// This interface matches the API response
// interface ApiTicket {
//   _id: string;
//   ticket: string;
//   "problème": string;
//   customer: string;
//   statut: string;
//   priority: string;
//   description: string;
//   solution: string;
//   assignedTechnician: string;
//   dates: {
//     created: string;
//     updated: string;
//     resolution: string;
//   };
//   contactId: string;
// }

// This is our internal Ticket interface used by the UI.
interface Ticket {
  id: string;
  titre: string;
  categorie: string;
  status: "Ouvert" | "En cours" | "Fermé";
  priorite: "Basse" | "Moyenne" | "Haute" | "Urgente";
  dateCreation: string;
  derniereMiseAJour: string;
  description: string;
  solution?: string;
  technicien?: string;
}

// Sample data
const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "1",
    titre: "Pompe à chaleur bruyante",
    categorie: "Maintenance",
    status: "En cours",
    priorite: "Moyenne",
    dateCreation: "12/03/2025",
    derniereMiseAJour: "15/03/2025",
    description: "Le client signale que sa pompe à chaleur émet un bruit anormal depuis l'installation. Le bruit s'intensifie pendant les cycles de chauffage. Il s'agit d'une PAC air/eau installée il y a 2 semaines.",
    solution: "Un technicien a été envoyé sur place. Premier diagnostic : problème possible de vibration excessive du compresseur. Des supports anti-vibration supplémentaires vont être installés.",
    technicien: "Thomas Martin"
  },
  {
    id: "2",
    titre: "Défaut d'affichage sur thermostat",
    categorie: "Électronique",
    status: "Ouvert",
    priorite: "Basse",
    dateCreation: "18/03/2025",
    derniereMiseAJour: "18/03/2025",
    description: "L'écran du thermostat intelligent ne s'allume plus. Le système de chauffage continue de fonctionner mais le client ne peut plus ajuster les paramètres. Modèle du thermostat : EcoControl X20.",
    technicien: "Sophie Dubois"
  },
  {
    id: "3",
    titre: "Fuite d'eau sur raccordement",
    categorie: "Plomberie",
    status: "Fermé",
    priorite: "Haute",
    dateCreation: "02/03/2025",
    derniereMiseAJour: "05/03/2025",
    description: "Fuite d'eau détectée au niveau du raccordement principal de la PAC au circuit de chauffage. Le client a dû couper l'alimentation en eau pour éviter les dégâts.",
    solution: "Le joint d'étanchéité était défectueux. Remplacement effectué et test d'étanchéité réalisé avec succès. Aucune autre fuite détectée.",
    technicien: "Jean Lefebvre"
  },
  {
    id: "4",
    titre: "Erreur E45 sur unité extérieure",
    categorie: "Technique",
    status: "En cours",
    priorite: "Urgente",
    dateCreation: "17/03/2025",
    derniereMiseAJour: "19/03/2025",
    description: "Le système affiche l'erreur E45 et s'arrête automatiquement après quelques minutes de fonctionnement. D'après le manuel, cette erreur indique un problème de surchauffe du compresseur.",
    technicien: "Marc Dupont"
  },
  {
    id: "5",
    titre: "Installation de radiateurs supplémentaires",
    categorie: "Installation",
    status: "Ouvert",
    priorite: "Basse",
    dateCreation: "19/03/2025",
    derniereMiseAJour: "19/03/2025",
    description: "Le client souhaite ajouter deux radiateurs dans des pièces supplémentaires et les connecter au système existant. Il demande un devis et une date d'intervention."
  }
];

const SavTab: React.FC<SavTabProps> = ({ contactId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSelectionne, setTicketSelectionne] = useState<Ticket | null>(null);
  const [recherche, setRecherche] = useState("");
  const [showAddTicketForm, setShowAddTicketForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    // Simulate API call with loading state
    setLoading(true);
    
    // For demo, use sample data instead of API call
    setTimeout(() => {
      setTickets(SAMPLE_TICKETS);
      setLoading(false);
    }, 800);

    // Commented out actual API call for demo
    /*
    // Convert contactId to a string in case it is a number.
    const contactIdStr = contactId.toString();

    // Fetch real data filtered by contactId
    fetch(`/api/tickets?contactId=${contactIdStr}`)
      .then((res) => res.json())
      .then((data: ApiTicket[]) => {
        // Transform the API data into our internal Ticket shape
        const transformedTickets: Ticket[] = data.map((apiTicket) => ({
          id: apiTicket._id,
          titre: apiTicket["problème"],
          categorie: apiTicket.customer,
          status:
            apiTicket.statut.charAt(0).toUpperCase() +
            apiTicket.statut.slice(1) as "Ouvert" | "En cours" | "Fermé",
          priorite: "Moyenne", // Default value if not provided by API
          dateCreation: new Date(apiTicket.dates.created).toLocaleDateString(),
          derniereMiseAJour: new Date(apiTicket.dates.updated).toLocaleDateString(),
          description: apiTicket.description,
          solution: apiTicket.solution,
          technicien: apiTicket.assignedTechnician
        }));
        setTickets(transformedTickets);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      });
    */
  }, [contactId]);

  // Filter tickets based on the search query and active filter
  const ticketsFiltres = tickets.filter(
    (ticket) => {
      const matchesSearch = 
        ticket.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        ticket.categorie.toLowerCase().includes(recherche.toLowerCase()) ||
        ticket.description.toLowerCase().includes(recherche.toLowerCase()) ||
        (ticket.technicien && ticket.technicien.toLowerCase().includes(recherche.toLowerCase()));
      
      if (activeFilter === "all") return matchesSearch;
      if (activeFilter === "open") return matchesSearch && ticket.status === "Ouvert";
      if (activeFilter === "inProgress") return matchesSearch && ticket.status === "En cours";
      if (activeFilter === "closed") return matchesSearch && ticket.status === "Fermé";
      
      return matchesSearch;
    }
  );

  // Get the badge color and icon based on ticket status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Ouvert":
        return { 
          bgColor: "bg-yellow-100", 
          textColor: "text-yellow-800",
          icon: <ExclamationCircleIcon className="w-4 h-4 mr-1" />
        };
      case "En cours":
        return { 
          bgColor: "bg-blue-100", 
          textColor: "text-blue-800",
          icon: <ArrowPathIcon className="w-4 h-4 mr-1" /> 
        };
      case "Fermé":
        return { 
          bgColor: "bg-green-100", 
          textColor: "text-green-800",
          icon: <CheckCircleIcon className="w-4 h-4 mr-1" />
        };
      default:
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: null
        };
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "maintenance":
        return <WrenchScrewdriverIcon className="w-4 h-4 text-indigo-500" />;
      case "électronique":
        return <BoltIcon className="w-4 h-4 text-amber-500" />;
      case "plomberie":
        return <FireIcon className="w-4 h-4 text-blue-500" />;
      case "technique":
        return <WrenchScrewdriverIcon className="w-4 h-4 text-red-500" />;
      case "installation":
        return <WrenchScrewdriverIcon className="w-4 h-4 text-green-500" />;
      default:
        return <TagIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Basse":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Basse
          </span>
        );
      case "Moyenne":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Moyenne
          </span>
        );
      case "Haute":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Haute
          </span>
        );
      case "Urgente":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Urgente
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
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
              <LifebuoyIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                Service Après-Vente
              </h2>
              <p className="text-blue-100 mt-1">Gestion des tickets de support et maintenance</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddTicketForm(true)}
            className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nouveau Ticket</span>
          </button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des tickets par titre, catégorie, description..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveFilter("open")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "open"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ouverts
            </button>
            <button
              onClick={() => setActiveFilter("inProgress")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "inProgress"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setActiveFilter("closed")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "closed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Fermés
            </button>
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left panel – Ticket list */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-500">Chargement des tickets...</p>
              </div>
            </div>
          ) : ticketsFiltres.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-center text-gray-500 mb-2">Aucun ticket trouvé</p>
              <p className="text-sm text-gray-400 text-center max-w-xs">Aucun ticket ne correspond à vos critères de recherche ou filtres sélectionnés.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {ticketsFiltres.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status);
                return (
                  <motion.li
                    key={ticket.id}
                    onClick={() => setTicketSelectionne(ticket)}
                    whileHover={{ 
                      backgroundColor: "#f9fafb",
                      x: 2 
                    }}
                    className={`border-l-4 ${
                      ticketSelectionne?.id === ticket.id 
                        ? "border-l-blue-500 bg-blue-50" 
                        : "border-l-transparent"
                    } transition-all cursor-pointer`}
                  >
                    <div className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
                          {ticket.titre}
                        </h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                          {statusInfo.icon}
                          {ticket.status}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center text-xs text-gray-500 mb-1.5">
                        <div className="flex items-center gap-1 mr-3">
                          {getCategoryIcon(ticket.categorie)}
                          <span>{ticket.categorie}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span>{ticket.derniereMiseAJour}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        {getPriorityBadge(ticket.priorite)}
                        
                        <button className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 gap-0.5">
                          <span>Détails</span>
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right panel – Ticket details */}
        <div className="flex-grow overflow-y-auto bg-white">
          {ticketSelectionne ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={ticketSelectionne.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {/* Ticket header */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {ticketSelectionne.titre}
                    </h2>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(ticketSelectionne.priorite)}
                      {getStatusInfo(ticketSelectionne.status).icon && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(ticketSelectionne.status).bgColor} ${getStatusInfo(ticketSelectionne.status).textColor}`}>
                          {getStatusInfo(ticketSelectionne.status).icon}
                          {ticketSelectionne.status}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        {getCategoryIcon(ticketSelectionne.categorie)}
                      </div>
                      <span className="text-gray-700">{ticketSelectionne.categorie}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>Créé le {ticketSelectionne.dateCreation}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500">
                      <ArrowPathIcon className="w-4 h-4" />
                      <span>Mis à jour le {ticketSelectionne.derniereMiseAJour}</span>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-gray-700 leading-relaxed">
                    {ticketSelectionne.description}
                  </div>
                </div>
                
                {/* Solution, if available */}
                {ticketSelectionne.solution && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Solution</h3>
                    <div className="bg-green-50 p-5 rounded-lg border border-green-100 text-gray-700 leading-relaxed">
                      {ticketSelectionne.solution}
                    </div>
                  </div>
                )}
                
                {/* Technician */}
                {ticketSelectionne.technicien && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Technicien assigné</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 inline-flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {ticketSelectionne.technicien.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{ticketSelectionne.technicien}</p>
                        <p className="text-sm text-gray-500">Technicien de maintenance</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-3 mt-8">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <ArrowPathIcon className="w-5 h-5" />
                    Actualiser
                  </button>
                  
                  {ticketSelectionne.status !== "Fermé" && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <PlusIcon className="w-5 h-5" />
                      Ajouter un commentaire
                    </button>
                  )}
                  
                  {ticketSelectionne.status === "Ouvert" && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <ArrowPathIcon className="w-5 h-5" />
                      Marquer en cours
                    </button>
                  )}
                  
                  {ticketSelectionne.status === "En cours" && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      Marquer comme résolu
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 py-10">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <LifebuoyIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Centre de support</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Sélectionnez un ticket dans la liste pour voir ses détails et suivre son état d&apos;avancement.
              </p>
              <button
                onClick={() => setShowAddTicketForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Créer un nouveau ticket
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Ticket Modal */}
      <AnimatePresence>
        {showAddTicketForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddTicketForm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Custom form header instead of using AddTicketForm internal header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <PlusIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Créer un nouveau ticket
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAddTicketForm(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Pass the AddTicketForm component with custom styling */}
              <div className="p-6">
                <AddTicketForm
                  contactId={contactId.toString()}
                  onClose={() => setShowAddTicketForm(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavTab;