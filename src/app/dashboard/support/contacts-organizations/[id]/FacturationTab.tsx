import React, { FC, useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  CreditCard,
  Building,
  Edit,
  Check,
  X,
  Plus,
  Filter,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";

// (The following constant is now used only as fallback if needed)
const PROJET_TYPES = [
  { value: "Poêle à granulés", label: "Poêle à granulés" },
  { value: "Chauffe-eau thermodynamique", label: "Chauffe-eau thermodynamique" },
  { value: "Pompe à chaleur", label: "Pompe à chaleur" },
  { value: "Système Solaire Combiné", label: "Système Solaire Combiné" },
  { value: "Panneaux photovoltaïques", label: "Panneaux photovoltaïques" },
  { value: "Chauffe-eau solaire individuel", label: "Chauffe-eau solaire individuel" },
//   { value: "Rénovation énergétique", label: "Rénovation énergétique" },
];

interface FacturationTabProps {
  contactId: string;
}

export interface Projet {
  id: string;
  type: string;
  description: string;
  prix: string;
  statut: string;
}

export interface ClientRegie {
  id: string;
  contactId: string;
  regieId: string;
  regieName: string;
}

// Type for a user with role "Project / Installation Manager"
interface RegieUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
}

// Interface for API project data
interface ProjetApiItem {
  type?: string;
  [key: string]: unknown;  // Allow other properties we don't know about
}

// Interface for API dossier data
interface DossierData {
  projet?: string | string[] | ProjetApiItem | ProjetApiItem[];
  assignedRegie?: string;
  prix?: string;
  statut?: string;
  solution?: string;
  id?: string;
  [key: string]: unknown;  // Allow other properties we don't know about
}

const DEFAULT_NEW_PROJET = {
  type: "",
  description: "",
  prix: "",
  statut: "A_FACTURER",
};

const STATUT_OPTIONS = [
  { value: "A_FACTURER", label: "A facturer", icon: ClipboardList },
  { value: "EN_COURS", label: "En cours", icon: Clock },
  { value: "TERMINE", label: "Terminé", icon: CheckCircle },
];

// ----------------- Components -----------------

// Displays a status badge with icon and color based on the project's status.
const StatutBadge: FC<{ statut: string }> = ({ statut }) => {
  const StatusIcon = STATUT_OPTIONS.find(s => s.value === statut)?.icon || ClipboardList;
  
  let bgColorClass = "bg-gray-100";
  let textColorClass = "text-gray-800";
  
  if (statut === "TERMINE") {
    bgColorClass = "bg-green-100";
    textColorClass = "text-green-800";
  } else if (statut === "EN_COURS") {
    bgColorClass = "bg-blue-100";
    textColorClass = "text-blue-800";
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${bgColorClass} ${textColorClass}`}>
      <StatusIcon className="mr-1" size={14} />
      {STATUT_OPTIONS.find(s => s.value === statut)?.label || "Devis"}
    </span>
  );
};

// Formats the price so it always includes the euro symbol.
const FormattedPrice: FC<{ prix: string }> = ({ prix }) => {
    const safePrix = prix || "0";
    const formattedPrice = safePrix.includes("€") ? safePrix : `${safePrix}€`;
    return <span className="font-semibold">{formattedPrice}</span>;
  };  

// RegieSelector now accepts an options prop (fetched regies) and displays each user's first and last name.
// When an option is selected, the value is the user's id.
interface RegieSelectorProps {
  regie: string;
  onChange: (regie: string) => void;
  disabled?: boolean;
  options: { id: string; firstName: string; lastName: string }[];
}
const RegieSelector: FC<RegieSelectorProps> = ({ regie, onChange, disabled = false, options }) => {
  return (
    <div className="relative">
      <select
        value={regie}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full border ${disabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'} rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none`}
      >
        <option value="">Sélectionner une régie</option>
        {options.map((regieOption) => (
          <option key={regieOption.id} value={regieOption.id}>
            {regieOption.firstName} {regieOption.lastName}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

// ProjetForm now accepts an extra prop "projetOptions" for the dropdown options.
// If not provided, it falls back to PROJET_TYPES.
interface ProjetFormProps {
  projet: Partial<Projet>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (key: string, value: string) => void;
  onCancel: () => void;
  submitLabel: string;
  projetOptions?: { value: string; label: string }[];
}
const ProjetForm: FC<ProjetFormProps> = ({ projet, onSubmit, onChange, onCancel, submitLabel, projetOptions }) => {
const options = (projetOptions && projetOptions.length > 0) ? projetOptions : PROJET_TYPES;
console.log("Dropdown options:", options);
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div className="space-y-1">
        <label className="block text-sm text-[#213f5b] font-medium">
          Type de Projet <span className="text-red-500">*</span>
        </label>
        <select
          value={projet.type || ""}
          onChange={(e) => onChange("type", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        >
          <option value="">Sélectionner un type</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm text-[#213f5b] font-medium">
          Prix <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={projet.prix || ""}
            onChange={(e) => onChange("prix", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 pl-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="ex: 1200€"
            required
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm text-[#213f5b] font-medium">
          Description
        </label>
        <input
          type="text"
          value={projet.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Description brève"
        />
      </div>
      
      <div className="space-y-1 md:col-span-2">
        <label className="block text-sm text-[#213f5b] font-medium">
          Statut
        </label>
        <div className="relative">
          <select
            value={projet.statut || "DEVIS"}
            onChange={(e) => onChange("statut", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
          >
            {STATUT_OPTIONS.map((statut) => (
              <option key={statut.value} value={statut.value}>
                {statut.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition hover:bg-gray-100 flex items-center"
        >
          <X size={16} className="mr-1" />
          Annuler
        </button>
        <button
          type="submit"
          className="bg-[#213f5b] text-white px-6 py-2 rounded-md transition hover:bg-opacity-90 inline-flex items-center"
        >
          <Check size={16} className="mr-1" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

// A simple confirmation dialog component.
const ConfirmDialog: FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, confirmLabel, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 pl-14">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition hover:bg-gray-100"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md transition hover:bg-red-700 inline-flex items-center"
            onClick={onConfirm}
          >
            <Trash2 size={16} className="mr-1" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Displayed when there are no projects.
const EmptyState: FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
  <div className="py-12 text-center bg-gray-50 rounded-lg">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
      <ClipboardList className="text-blue-600" size={28} />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Aucun projet proposé
    </h3>
    <p className="text-gray-500 mb-4 max-w-md mx-auto">
      Il n&apos;y a pas encore de projets proposés pour ce client. Commencez par
      ajouter votre premier projet.
    </p>
    <button
      onClick={onAddClick}
      className="bg-[#213f5b] text-white px-4 py-2 rounded-md transition hover:bg-opacity-90 inline-flex items-center"
    >
      <Plus size={16} className="mr-1" />
      Ajouter un projet
    </button>
  </div>
);

// ----------------- Main Component -----------------

const FacturationTab: FC<FacturationTabProps> = ({ contactId }) => {
  // Local state for dossier data
  const [projets, setProjets] = useState<Projet[]>([]);
  const [clientRegie, setClientRegie] = useState<ClientRegie | null>(null);
  // const [assignedRegie, setAssignedRegie] = useState("");
//   const [isRegieEditing, setIsRegieEditing] = useState(false);
  // For the regie dropdown, we now fetch a list of available regies
  const [regies, setRegies] = useState<RegieUser[]>([]);
  // For the "Type de Projet" dropdown, we also store available options (fetched from dossier)
  const [projetOptions, setProjetOptions] = useState<{ value: string; label: string }[]>([]);

  const [selectedRegie, setSelectedRegie] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegieEditing, setIsRegieEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: keyof Projet; direction: "asc" | "desc" }>({
    key: "type",
    direction: "asc",
  });
  // Add this function near the beginning of your component
const logApiState = async () => {
  try {
    // Fetch the current state from the API
    const response = await fetch(`/api/dossiers?contactId=${contactId}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Current API State:", {
        assignedRegie: data.assignedRegie,
        projet: data.projet,
        prix: data.prix,
        statut: data.statut,
        fullData: data
      });
    }
  } catch (error) {
    console.error("Error fetching current API state:", error);
  }
};

// Call this after every successful API operation
// For example, after patchDossier in handleAddProjet, handleSaveEdit, handleDeleteProjet, etc.
// And at the end of fetchDossier

// Example usage in handleAddProjet:
// await patchDossier(updatedProjets, selectedRegie);
// await logApiState(); // Add this line
// toast.success("Projet ajouté avec succès");

  const [filterStatut, setFilterStatut] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newProjet, setNewProjet] = useState({ ...DEFAULT_NEW_PROJET });

  // State for editing a project row
  const [editingProjetId, setEditingProjetId] = useState<string | null>(null);
  const [editedProjet, setEditedProjet] = useState<Projet | null>(null);

  // Fetch regies (users with role "Project / Installation Manager")
  useEffect(() => {
    const fetchRegies = async () => {
      try {
        const response = await fetch(`/api/users?role=Project%20/%20Installation%20Manager`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des régies");
        }
        const data = await response.json();
        // Assuming the API returns an array of users with fields: id, firstName, lastName, etc.
        setRegies(data);
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors du chargement des régies");
      }
    };

    fetchRegies();
  }, []);

  // Replace the existing patchDossier function with this updated version
  const patchDossier = async (updatedProjects: Projet[], regie: string): Promise<DossierData> => {
    // Extract types making sure no empty values
    const projectTypes: string[] = updatedProjects
      .map(p => p.type.trim())
      .filter(type => type !== "");
    
    // Get values for prix and statut
    const mostCommonPrice: string = updatedProjects.length > 0 
      ? updatedProjects[0].prix.replace('€', '').trim() // Remove € symbol for consistency
      : "0";
    
    const mostCommonStatus: string = updatedProjects.length > 0 
      ? updatedProjects[0].statut 
      : "A_FACTURER";
    
    // Get description (using the first project's description if available)
    const description: string = updatedProjects.length > 0 && updatedProjects[0].description
      ? updatedProjects[0].description
      : "";
    
    // Build a payload that exactly matches what the API expects
    const payload = {
      assignedRegie: regie,
      projet: projectTypes.length > 0 ? projectTypes : [""], // Send at least an empty string if no projects
      prix: mostCommonPrice,
      statut: mostCommonStatus,
      description: description
    };

    console.log("Sending payload to APIs:", payload);
    
    try {
      // 1. Update the dossiers API
      const dossierResponse = await fetch(`/api/dossiers?contactId=${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!dossierResponse.ok) {
        throw new Error(`Erreur HTTP dossiers: ${dossierResponse.status} ${dossierResponse.statusText}`);
      }

      // 2. ALSO update the contacts API
      const contactResponse = await fetch(`/api/contacts?id=${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!contactResponse.ok) {
        throw new Error(`Erreur HTTP contacts: ${contactResponse.status} ${contactResponse.statusText}`);
      }
      
      // Get the response data and handle array format (from the dossier response)
      const responseData = await dossierResponse.json();
      console.log("Raw response after patch:", responseData);
      
      // Extract the first item if it's an array
      const result = Array.isArray(responseData) ? responseData[0] : responseData;
      console.log("Extracted result after patch:", result);
      
      // Debug the current API state
      await logApiState();
      
      return result;
    } catch (error) {
      console.error("Error in patchDossier:", error);
      throw error;
    }
  };

  // Summary counts using useMemo for performance
  const { totalMontant, projetsCount } = useMemo(() => {
    const projetsAFacturer = projets.filter(p => p.statut === "A_FACTURER");
    const projetsEnCours = projets.filter(p => p.statut === "EN_COURS");
    const projetsTermine = projets.filter(p => p.statut === "TERMINE");
    
    const total = projets.reduce((sum, projet) => {
        const montant = parseFloat((projet.prix || "0").replace(/[€\s]/g, ""));
        return isNaN(montant) ? sum : sum + montant;
      }, 0);
      
    return {
      totalMontant: total.toLocaleString("fr-FR") + "€",
      projetsCount: projets.length,
      projetsAFacturerCount: projetsAFacturer.length,
      projetsEnCoursCount: projetsEnCours.length,
      projetsTermineCount: projetsTermine.length
    };
  }, [projets]);

  
  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; projetId: string | null }>({
    isOpen: false,
    projetId: null,
  });

  // Fetch dossier data (which includes available projet options, common prix/statut, etc.)
  useEffect(() => {
    const fetchDossier = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!contactId) {
          throw new Error("ID du contact manquant");
        }
    
        const response = await fetch(`/api/dossiers?contactId=${contactId}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }
    
        // Get the raw response data
        const responseData = await response.json();
        console.log("Raw API response:", responseData);
        
        // CRITICAL FIX: Extract the first item if the response is an array
        // This is the key issue - your API returns an array with one object
        const data = Array.isArray(responseData) ? responseData[0] : responseData;
        console.log("Extracted data object:", data);
        
        // Run our debug function on the extracted data
        debugDataStructure(data);
    
        if (!data) {
          throw new Error("Données reçues du serveur sont vides");
        }
    
        // Extract projet data
        let projetsFromApi: string[] = [];
        
        if (data.projet) {
          // Ensure we're working with an array
          const projetArray = Array.isArray(data.projet) ? data.projet : [data.projet];
          
          // Extract strings 
          projetsFromApi = projetArray
            .filter((item: ProjetApiItem | string | null | undefined): item is ProjetApiItem | string => 
              item !== null && item !== undefined)
            .map((item: ProjetApiItem | string) => {
              if (typeof item === 'object' && item !== null && 'type' in item && item.type) {
                return item.type;
              }
              return String(item);
            })
            .filter((item: string) => item.trim() !== "");
        }
        
        // If projet is empty but we have a solution field, use that as fallback
        if (projetsFromApi.length === 0 && data.solution && typeof data.solution === 'string') {
          if (data.solution.includes(',')) {
            projetsFromApi = data.solution.split(',').map((s: string) => s.trim());
          } else {
            projetsFromApi = [data.solution.trim()];
          }
          console.log("Using solution field as fallback:", projetsFromApi);
        }
        
        console.log("Final projetsFromApi:", projetsFromApi);
        
        // Create project entries with consistent IDs and properties
        const apiProjects = projetsFromApi.map((proj: string, index: number) => ({
          id: `${contactId}-${index}`,
          type: proj,
          description: "", // No description provided by the API
          prix: data.prix || "0€", // Default price if missing
          statut: data.statut || "A_FACTURER", // Default status if missing
        }));
        
        console.log("Setting projets state to:", apiProjects);
        setProjets(apiProjects);
    
        // Set dropdown options
        if (projetsFromApi.length === 0) {
          console.log("Using default PROJET_TYPES");
          setProjetOptions(PROJET_TYPES);
        } else {
          const uniqueProjects: string[] = [...new Set(projetsFromApi)];
          const options = uniqueProjects.map((proj: string) => ({
            value: proj,
            label: proj,
          }));
          console.log("Setting projetOptions to:", options);
          setProjetOptions(options);
        }
    
        // Safely set client régie info
        const regieInfo = {
          id: data.id || contactId,
          contactId,
          regieId: data.assignedRegie || "",
          regieName: "", // leave blank initially
        };
        console.log("Setting clientRegie to:", regieInfo);
        setClientRegie(regieInfo);
        
        console.log("Setting selectedRegie to:", data.assignedRegie || "");
        setSelectedRegie(data.assignedRegie || "");
    
        // Fetch régie details if assigned
        if (data.assignedRegie) {
          console.log("Fetching regie details with id:", data.assignedRegie);
          try {
            const regieResponse = await fetch(`/api/users?id=${data.assignedRegie}`);
            console.log("Régie response status:", regieResponse.status);
            
            if (regieResponse.ok) {
              const regieData = await regieResponse.json();
              console.log("Régie data from API:", regieData);
              
              // If API returns an array, take the first element
              const user = Array.isArray(regieData) ? regieData[0] : regieData;
              console.log("User data for régie:", user);
              
              if (user && user.firstName && user.lastName) {
                const regieName = `${user.firstName} ${user.lastName}`;
                console.log("Setting régie name to:", regieName);
                
                setClientRegie((prev) =>
                  prev ? { ...prev, regieName } : null
                );
              } else {
                console.log("No user data found, using assignedRegie as name");
                setClientRegie((prev) =>
                  prev ? { ...prev, regieName: data.assignedRegie } : null
                );
              }
            } else {
              console.warn("Failed to fetch régie details:", regieResponse.status);
              setClientRegie((prev) =>
                prev ? { ...prev, regieName: data.assignedRegie } : null
              );
            }
          } catch (regieError: unknown) {
            console.error("Error fetching régie details:", regieError);
            setClientRegie((prev) =>
              prev ? { ...prev, regieName: data.assignedRegie || "Régie inconnue" } : null
            );
          }
        }
    
        setIsLoading(false);
      } catch (error: unknown) {
        console.error("Error in fetchDossier:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Erreur inconnue';
        setError(`Erreur lors de la récupération des données du dossier: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    fetchDossier();
  }, [contactId]);

  // Sorting and filtering logic
  const displayedProjets = useMemo(() => {
    let filteredProjets = projets;
    if (filterStatut) {
      filteredProjets = filteredProjets.filter((projet) => projet.statut === filterStatut);
    }
    return [...filteredProjets].sort((a, b) => {
      if (sortConfig.key === "prix") {
        const prixA = parseFloat(a.prix.replace(/[€\s]/g, "")) || 0;
        const prixB = parseFloat(b.prix.replace(/[€\s]/g, "")) || 0;
        return sortConfig.direction === "asc" ? prixA - prixB : prixB - prixA;
      }
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [projets, sortConfig, filterStatut]);

  const handleSort = (key: keyof Projet) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle changes in the new project form
  const handleNewProjetChange = (key: string, value: string) => {
    setNewProjet((prev) => ({ ...prev, [key]: value }));
  };

  // Add new project and patch dossier
  const handleAddProjet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newId = `proj-${projets.length + 1}-${Math.random().toString(36).substr(2, 9)}`;
      const addedProjet = { ...newProjet, id: newId };
      const updatedProjets = [...projets, addedProjet as Projet];
      // Update local state first
      setProjets(updatedProjets);
      setNewProjet({ ...DEFAULT_NEW_PROJET });
      setShowAddForm(false);
      // Patch the dossier with the updated projects and assigned regie
      await patchDossier(updatedProjets, selectedRegie);
      toast.success("Projet ajouté avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du projet");
    }
  };

  // Confirm delete dialog
  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({ isOpen: true, projetId: id });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, projetId: null });
  };

  // Delete a project and patch dossier
  const handleDeleteProjet = async () => {
    if (!deleteConfirmation.projetId) return;
    try {
      const updatedProjets = projets.filter((projet) => projet.id !== deleteConfirmation.projetId);
      setProjets(updatedProjets);
      await patchDossier(updatedProjets, selectedRegie);
      toast.success("Projet supprimé avec succès");
      closeDeleteConfirmation();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression du projet");
    }
  };

  // Editing functions
  const startEditing = (projet: Projet) => {
    setEditingProjetId(projet.id);
    setEditedProjet({ ...projet });
  };

  const cancelEditing = () => {
    setEditingProjetId(null);
    setEditedProjet(null);
  };

  const handleEditChange = (key: string, value: string) => {
    if (editedProjet) {
      setEditedProjet({ ...editedProjet, [key]: value });
    }
  };

  // Save edited project and patch dossier
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjetId || !editedProjet) return;
    try {
      const updatedProjets = projets.map((projet) =>
        projet.id === editingProjetId ? editedProjet : projet
      );
      setProjets(updatedProjets);
      await patchDossier(updatedProjets, selectedRegie);
      toast.success("Projet mis à jour avec succès");
      cancelEditing();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  // Handle regie changes – when saving, patch the dossier with the new assigned regie.
  const handleRegieChange = async (value: string) => {
    setSelectedRegie(value);
  };

  // Replace the handleSaveRegie function with this TypeScript-fixed version
  // Replace the handleSaveRegie function with this updated version
const handleSaveRegie = async (): Promise<void> => {
  try {
    // First find the selected régie user
    const selectedRegieUser = regies.find(r => r.id === selectedRegie);
    
    // Build the régie name from first and last name, or use empty string if not found
    const selectedRegieName: string = selectedRegieUser
      ? `${selectedRegieUser.firstName || ''} ${selectedRegieUser.lastName || ''}`.trim()
      : "";
    
    // Update local state for clientRegie
    setClientRegie(prev => prev ? {
      ...prev,
      regieId: selectedRegie,
      regieName: selectedRegieName
    } : {
      id: contactId,
      contactId,
      regieId: selectedRegie,
      regieName: selectedRegieName
    });
    
    // Create a minimal payload that just sets the assignedRegie
    const payload = {
      assignedRegie: selectedRegie
    };
    
    console.log("Updating régie with payload:", payload);
    
    // 1. Send régie change to the dossier API
    const dossierResponse = await fetch(`/api/dossiers?contactId=${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!dossierResponse.ok) {
      throw new Error("Erreur lors de l'assignation de la régie dans le dossier");
    }
    
    // 2. ALSO send the same régie change to the contacts API
    const contactResponse = await fetch(`/api/contacts?id=${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!contactResponse.ok) {
      throw new Error("Erreur lors de l'assignation de la régie dans le contact");
    }
    
    setIsRegieEditing(false);
    toast.success("Régie assignée avec succès");
  } catch (error) {
    console.error(error);
    toast.error("Erreur lors de l'assignation de la régie");
  }
};

  // Add this function to your component
// Updated debug data function
const debugDataStructure = (data: DossierData) => {
  console.log("=== DEBUG DATA STRUCTURE ===");
  console.log("Raw data:", data);
  
  // Check projet field
  console.log("projet field type:", typeof data?.projet);
  console.log("projet is array:", Array.isArray(data?.projet));
  console.log("projet value:", data?.projet);
  
  if (data?.projet) {
    // Check for zero-length strings or other edge cases
    if (Array.isArray(data.projet)) {
      console.log("projet array length:", data.projet.length);
      data.projet.forEach((item: string | ProjetApiItem, index: number) => {
        console.log(`projet[${index}] type:`, typeof item);
        console.log(`projet[${index}] value:`, item);
        console.log(`projet[${index}] trim empty:`, typeof item === 'string' && item.trim() === '');
      });
    }
  }
  
  // Check assignedRegie
  console.log("assignedRegie type:", typeof data?.assignedRegie);
  console.log("assignedRegie value:", data?.assignedRegie);
  console.log("assignedRegie truthy:", Boolean(data?.assignedRegie));
  
  // Check prix and statut
  console.log("prix:", data?.prix);
  console.log("statut:", data?.statut);
  console.log("=== END DEBUG ===");
};

  return (
    <div className="">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header */}
        <header className="bg-[#213f5b] text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Facturation</h1>
              <p className="text-sm opacity-80 mt-1">
                Gestion du projet et facturation du client
              </p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <ClipboardList className="text-[#213f5b]" size={28} />
            </div>
          </div>
        </header>

        {/* Regie Assignment Section */}
        <section className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-[#213f5b]">
                Régie assignée
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Sélectionnez la régie responsable pour ce client
              </p>
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              {isRegieEditing ? (
                <>
                  <div className="w-64">
                    <RegieSelector 
                      regie={selectedRegie} 
                      onChange={handleRegieChange} 
                      options={regies}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setIsRegieEditing(false);
                        setSelectedRegie(clientRegie?.regieId || "");
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={handleSaveRegie}
                      className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-md border border-blue-100">
                    <Building size={18} className="text-blue-500 mr-2" />
                    <span className="font-medium">
                    {clientRegie?.regieName || "Aucune régie assignée"}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsRegieEditing(true)}
                    className="bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 inline-flex items-center"
                  >
                    <Edit size={16} className="mr-1" />
                    Modifier
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <ClipboardList className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Nombre de projets</p>
              <p className="text-xl font-bold text-[#213f5b]">
                {projetsCount}
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Montant total</p>
              <p className="text-xl font-bold text-[#213f5b]">
                {totalMontant}
              </p>
            </div>
          </div>
        </section>

        {/* Add Project Toggle & Form */}
        <section className="bg-[#d2fcb2]/30 px-6 pt-6 pb-3">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setShowAddForm((prev) => !prev);
                if (showAddForm) {
                  setNewProjet({ ...DEFAULT_NEW_PROJET });
                }
              }}
              className="bg-[#213f5b] text-white px-6 py-2 rounded-md transition hover:bg-opacity-90 flex items-center"
            >
              {showAddForm ? (
                <>
                  <X size={16} className="mr-1" />
                  Annuler
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-1" />
                  Ajouter un Projet
                </>
              )}
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4 text-[#213f5b]">
                Proposer un Nouveau Projet
              </h2>
              <ProjetForm
                projet={newProjet}
                onSubmit={handleAddProjet}
                onChange={handleNewProjetChange}
                onCancel={() => {
                  setShowAddForm(false);
                  setNewProjet({ ...DEFAULT_NEW_PROJET });
                }}
                submitLabel="Enregistrer"
                projetOptions={projetOptions}
              />
            </div>
          )}
        </section>

        {/* Filters */}
        <section className="px-6 py-4 bg-[#d2fcb2]/30 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatut(null)}
            className={`px-4 py-2 rounded-full text-sm transition inline-flex items-center ${
              filterStatut === null
                ? "bg-[#213f5b] text-white"
                : "bg-white text-[#213f5b] border border-[#213f5b]"
            }`}
          >
            <Filter size={14} className="mr-1" />
            Tous
          </button>
          {STATUT_OPTIONS.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => setFilterStatut(status.value)}
                className={`px-4 py-2 rounded-full text-sm transition inline-flex items-center ${
                  filterStatut === status.value
                    ? "bg-[#213f5b] text-white"
                    : "bg-white text-[#213f5b] border border-[#213f5b]"
                }`}
              >
                <Icon size={14} className="mr-1" />
                {status.label}
              </button>
            );
          })}
        </section>

        {/* Loading, Error and Empty states */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#213f5b]"></div>
            <p className="mt-2 text-gray-600">Chargement des projets...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#213f5b] text-white rounded-md"
            >
              Réessayer
            </button>
          </div>
        ) : projets.length === 0 ? (
          <EmptyState onAddClick={() => setShowAddForm(true)} />
        ) : (
          // Projects Table
          <section className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-[#213f5b] border-b border-gray-200">
                    <th
                      className="px-4 py-3 text-left cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type de projet
                        {sortConfig.key === "type" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th
                      className="px-4 py-3 text-left cursor-pointer"
                      onClick={() => handleSort("prix")}
                    >
                      <div className="flex items-center">
                        Prix
                        {sortConfig.key === "prix" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProjets.map((projet) => (
                    <tr
                      key={projet.id}
                      className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors"
                    >
                      {editingProjetId === projet.id && editedProjet ? (
                        <td colSpan={6} className="px-4 py-4">
                          <ProjetForm
                            projet={editedProjet}
                            onSubmit={handleSaveEdit}
                            onChange={handleEditChange}
                            onCancel={cancelEditing}
                            submitLabel="Mettre à jour"
                            projetOptions={projetOptions}
                          />
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-4">
                            <span className="text-[#213f5b] font-medium">
                              {projet.type}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-gray-600 line-clamp-1">
                              {projet.description || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <FormattedPrice prix={projet.prix} />
                          </td>
                          <td className="px-4 py-4">
                            <StatutBadge statut={projet.statut} />
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end space-x-1">
                              <button
                                onClick={() => startEditing(projet)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmation(projet.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDeleteProjet}
        onCancel={closeDeleteConfirmation}
      />
    </div>
  );
};

export default FacturationTab;