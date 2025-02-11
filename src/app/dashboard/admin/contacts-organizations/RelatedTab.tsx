// components/RelatedTab.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AddTicketForm from "./components/AddTicketForm";
import {
  ChevronDownIcon,
  PlusCircleIcon,
  XMarkIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import AddDossierForm from "./components/AddDossierForm"; // ajustez le chemin si nécessaire
import Link from "next/link";
import AddCommentForm from "./components/AddCommentForm";

// Définition des types (ajustez-les selon votre schéma)
type Organization = {
  id: number | string;
  nom: string;
  secteur: string;
  coordonnées: {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  };
  rôle: string;
  taille: {
    employees?: string;
    annualRevenue?: string;
    regionsServed?: string;
  };
  solutions: string;
};

type Dossier = {
  _id: string | number;
  id: number | string;
  numero: string;
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  échéances: {
    startDate?: string;
    expectedCompletion?: string;
  };
};

type Document = {
  statut: string;
  date: string;
  id: number | string;
  document: string;
  filePath: string;
  type: string;
  solution: string;
  miseAJour: string;
  auteur: string;
};

type Ticket = {
  id: number | string;
  ticket: string;
  problème: string;
  statut: string;
  technicien: string;
  dates: {
    created?: string;
    updated?: string;
    resolution?: string;
  };
};

type Commentaire = {
  id: number | string;
  auteur: string;
  role: string;
  date: string;
  commentaire: string;
};

interface RelatedTabProps {
  contactId: string;
}

// Composant réutilisable d'Accordion avec icône et animation fluide
const AccordionSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border rounded-md shadow-sm mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-600" />}
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <motion.span animate={{ rotate: open ? 0 : 180 }} className="text-gray-600">
          <ChevronDownIcon className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-white"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant dédié pour téléverser un document avec une UI haut de gamme
interface AddDocumentFormProps {
  onClose: () => void;
  contactId: string;
}
const AddDocumentForm = ({ onClose, contactId }: AddDocumentFormProps) => {
  // États pour le type de document et le type personnalisé en cas de "autre"
  const [docType, setDocType] = useState("");
  const [customDocType, setCustomDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Manquant");
  // Format de la date en français (jour/mois/année)
  const currentDate = new Date().toLocaleDateString("fr-FR");
  const [solution, setSolution] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("Soumis");
    } else {
      setFile(null);
      setStatus("Manquant");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Utilise le type personnalisé si "autre" est sélectionné
    const finalDocType = docType === "autre" ? customDocType : docType;

    // Vérification des champs requis (docType, solution et contactId)
    if (!finalDocType || !solution || !contactId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Création de FormData pour gérer la requête multipart/form-data
    const formData = new FormData();
    formData.append("docType", finalDocType);
    formData.append("date", currentDate);
    formData.append("status", status);
    formData.append("solution", solution);
    formData.append("contactId", contactId);
    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur lors du téléversement du document");
      onClose(); // Ferme la modale en cas de succès
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Informations du document
      </h3>

      {/* Type de document */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de document <span className="text-red-500">*</span>
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        >
          <option value="">Sélectionner le type</option>
          <option value="avis d'imposition">Avis d&apos;imposition</option>
          <option value="devis facture">Devis / Facture</option>
          <option value="checklist PAC">Checklist PAC</option>
          <option value="note de dimensionnement">Note de dimensionnement</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* Champ personnalisé pour "Autre" */}
      {docType === "autre" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécifiez le type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={customDocType}
            onChange={(e) => setCustomDocType(e.target.value)}
            placeholder="Entrez le type personnalisé..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
        </div>
      )}

      {/* Date de téléversement */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de téléversement
        </label>
        <input
          type="text"
          value={currentDate}
          disabled
          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
        />
      </div>

      {/* Zone de téléversement de fichier */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier
        </label>
        <div className="relative">
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <CloudIcon className="w-10 h-10 text-gray-400 mb-2" />
            {file ? (
              <span className="text-gray-700">{file.name}</span>
            ) : (
              <span className="text-gray-500">
                Cliquez ou glissez-déposez votre fichier ici
              </span>
            )}
          </label>
        </div>
        {!file && (
          <p className="mt-1 text-xs text-gray-500">
            Vous pouvez enregistrer ce document et téléverser le fichier ultérieurement.
          </p>
        )}
      </div>

      {/* Statut */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statut
        </label>
        <input
          type="text"
          value={status}
          disabled
          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
        />
      </div>

      {/* Solution */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Solution <span className="text-red-500">*</span>
        </label>
        <select
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        >
          <option value="">Sélectionner une solution</option>
          <option value="Pompes a chaleur">Pompes à chaleur</option>
          <option value="Chauffe-eau solaire individuel">
            Chauffe-eau solaire individuel
          </option>
          <option value="Chauffe-eau thermodynamique">
            Chauffe-eau thermodynamique
          </option>
          <option value="Système Solaire Combiné">
            Système Solaire Combiné
          </option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors text-center"
        >
          {file ? "Téléverser" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
};

export default function RelatedTab({ contactId }: RelatedTabProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const dossierId = dossiers.length > 0 ? dossiers[0]._id : "";
  const [loading, setLoading] = useState(true);
  // État pour la fenêtre modale d'ajout
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<
    "organization" | "dossier" | "document" | "ticket" | "commentaire" | null
  >(null);

  // Récupération des données selon le contactId
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [orgRes, dosRes, docRes, tickRes, commRes] = await Promise.all([
          fetch(`/api/organizations?id=${contactId}`),
          fetch(`/api/dossiers?contactId=${contactId}`),
          fetch(`/api/documents?contactId=${contactId}`),
          fetch(`/api/tickets?id=${contactId}`),
          fetch(`/api/commentaires?id=${contactId}`),
        ]);

        const [orgData, dosData, docData, tickData, commData] =
          await Promise.all([
            orgRes.json(),
            dosRes.json(),
            docRes.json(),
            tickRes.json(),
            commRes.json(),
          ]);

        setOrganizations(orgData);
        setDossiers(dosData);
        setDocuments(docData);
        setTickets(tickData);
        setCommentaires(commData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    }
    if (contactId) fetchData();
  }, [contactId]);

  // Fonction pour mettre à jour (PUT)
  async function handleUpdate(
    collection: string,
    id: string | number,
    updatedData: Record<string, unknown>
  ) {
    try {
      const res = await fetch(`/api/${collection}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour.");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  // Formulaire par défaut pour les autres types
  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(`Soumission des nouvelles données de type ${addModalType}`);
    setShowAddModal(false);
    setAddModalType(null);
  }

  // Rendu de la modale d'ajout avec animations
  function renderAddModal() {
    if (!showAddModal) return null;
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl shadow-xl w-96"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {addModalType
                  ? addModalType === "organization"
                    ? "Ajouter une organisation"
                    : addModalType === "dossier"
                    ? "Ajouter un dossier"
                    : addModalType === "document"
                    ? "Téléverser un document"
                    : addModalType === "ticket"
                    ? "Ajouter un ticket/support"
                    : "Ajouter un commentaire"
                  : "Sélectionner un type"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddModalType(null);
                }}
                className="text-red-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {addModalType ? (
              addModalType === "dossier" ? (
                <AddDossierForm
                  contactId={contactId}
                  onClose={() => {
                    setShowAddModal(false);
                    setAddModalType(null);
                  }}
                />
              ) : addModalType === "document" ? (
                <AddDocumentForm
                  onClose={() => {
                    setShowAddModal(false);
                    setAddModalType(null);
                  }}
                  contactId={contactId}
                />
              ) : addModalType === "ticket" ? (
                <AddTicketForm
                  contactId={contactId}
                  onClose={() => {
                    setShowAddModal(false);
                    setAddModalType(null);
                  }}
                />
              ) : addModalType === "commentaire" ? (
                <AddCommentForm
                  contactId={contactId}
                  onClose={() => {
                    setShowAddModal(false);
                    setAddModalType(null);
                  }}
                />
              ) : (
                <form onSubmit={handleAddSubmit} className="space-y-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                    {addModalType === "organization"
                        ? "Nom"
                        : addModalType === "commentaire"
                        ? "Auteur"
                        : "Saisir la valeur"}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Saisir la valeur..."
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="space-y-2">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("organization")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouvelle organisation
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("dossier")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau dossier
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("document")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau document
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("ticket")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau ticket/support
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("commentaire")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau commentaire
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (loading) return <div className="p-4 text-center">Chargement…</div>;

  const isEmpty =
    organizations.length === 0 &&
    dossiers.length === 0 &&
    documents.length === 0 &&
    tickets.length === 0 &&
    commentaires.length === 0;

  return (
    <div className="space-y-6 p-4">
      <div className="mb-4">
        <button
          onClick={() => {
            setShowAddModal(true);
            setAddModalType(null);
          }}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Ajouter
        </button>
      </div>

      {renderAddModal()}

      {isEmpty && (
        <div className="text-center text-gray-500">
          Aucune information n&apos;a été trouvée.
        </div>
      )}

      {/* Section Organisations */}
      {organizations.length > 0 && (
        <AccordionSection title="Organisations">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Nom</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Secteur</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Coordonnées</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Rôle</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Taille</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Solutions</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org, index) => (
                  <tr key={`org-${org.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{org.nom}</td>
                    <td className="px-4 py-2">{org.secteur}</td>
                    <td className="px-4 py-2">
                      <div>{org.coordonnées?.phone || "N/A"}</div>
                      <div>{org.coordonnées?.email || "N/A"}</div>
                      <div>{org.coordonnées?.address || "N/A"}</div>
                      <div>{org.coordonnées?.website || "N/A"}</div>
                    </td>
                    <td className="px-4 py-2">{org.rôle}</td>
                    <td className="px-4 py-2">
                      <div>Employés : {org.taille?.employees || "N/A"}</div>
                      <div>Revenu : {org.taille?.annualRevenue || "N/A"}</div>
                      <div>Régions : {org.taille?.regionsServed || "N/A"}</div>
                    </td>
                    <td className="px-4 py-2">{org.solutions}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          const updatedData = {
                            /* ... nouvelles données ... */
                          };
                          handleUpdate("organizations", org.id, updatedData);
                        }}
                      >
                        Éditer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>
      )}

      {/* Section Dossiers */}
      {dossiers.length > 0 && (
        <AccordionSection title="Dossiers">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">N° Dossier</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Client</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Projet</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Solutions</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Étape</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Valeur</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Échéances</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dossiers.map((dos, index) => (
                  <tr key={`dos-${dos.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{dos.numero}</td>
                    <td className="px-4 py-2">{dos.client}</td>
                    <td className="px-4 py-2">{dos.projet}</td>
                    <td className="px-4 py-2">{dos.solution}</td>
                    <td className="px-4 py-2">{dos.etape}</td>
                    <td className="px-4 py-2">{dos.valeur}</td>
                    <td className="px-4 py-2">
                      <div>Début : {dos.échéances?.startDate || "N/A"}</div>
                      <div>Fin prévue : {dos.échéances?.expectedCompletion || "N/A"}</div>
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/dashboard/admin/projects/${dos._id}`}
                        className="inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                      >
                        Voir plus
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>
      )}

      {/* Section Documents */}
      {documents.length > 0 && (
        <AccordionSection title="Documents">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Type</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Date</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Statut</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <tr key={`doc-${doc.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{doc.type}</td>
                    <td className="px-4 py-2">{doc.date}</td>
                    <td className="px-4 py-2">{doc.statut}</td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/dashboard/admin/projects/${dossierId}?tab=documents`}
                        className="inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                      >
                        Voir plus
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>
      )}


      {/* Section Tickets/Support */}
      {tickets.length > 0 && (
        <AccordionSection title="Tickets/Support">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Ticket</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Problème</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Statut</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Technicien</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Dates</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket, index) => (
                  <tr key={`ticket-${ticket.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{ticket.ticket}</td>
                    <td className="px-4 py-2">{ticket.problème}</td>
                    <td className="px-4 py-2">{ticket.statut}</td>
                    <td className="px-4 py-2">{ticket.technicien}</td>
                    <td className="px-4 py-2">
                      <div>Créé : {ticket.dates?.created || "N/A"}</div>
                      <div>Mis à jour : {ticket.dates?.updated || "N/A"}</div>
                      <div>Résolu : {ticket.dates?.resolution || "N/A"}</div>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          const updatedData = {
                            /* ... nouvelles données ... */
                          };
                          handleUpdate("tickets", ticket.id, updatedData);
                        }}
                      >
                        Éditer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>
      )}

      {/* Section Commentaires */}
      {commentaires.length > 0 && (
        <AccordionSection title="Commentaires (Notes)">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Auteur</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Date</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Commentaire</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commentaires.map((comm, index) => (
                  <tr key={`comm-${comm.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">
                      <div className="font-medium">{comm.auteur}</div>
                      <div className="text-xs text-gray-500">{comm.role}</div>
                    </td>
                    <td className="px-4 py-2">{comm.date}</td>
                    <td className="px-4 py-2">{comm.commentaire}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          const updatedData = {
                            /* ... nouvelles données ... */
                          };
                          handleUpdate("commentaires", comm.id, updatedData);
                        }}
                      >
                        Éditer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>
      )}
    </div>
  );
}
