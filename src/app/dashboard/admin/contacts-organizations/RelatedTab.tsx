// components/RelatedTab.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDownIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AddDossierForm from "./components/AddDossierForm"; // adjust the import path as needed
import Link from "next/link";

// Define types (adjust these based on your schema)
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

// A reusable AccordionSection with an icon and smooth animation
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
        <motion.span
          animate={{ rotate: open ? 0 : 180 }}
          className="text-gray-600"
        >
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

export default function RelatedTab({ contactId }: RelatedTabProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  // const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // Modal state for adding new data
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<
    "organization" | "dossier" | "document" | "ticket" | "commentaire" | null
  >(null);

  // Fetch data for all collections based on contactId
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [orgRes, dosRes, docRes, tickRes, commRes] = await Promise.all([
          fetch(`/api/organizations?id=${contactId}`),
          fetch(`/api/dossiers?contactId=${contactId}`),
          fetch(`/api/documents?id=${contactId}`),
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (contactId) fetchData();
  }, [contactId]);

  // Helper for update operations
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
      // For a better UX, update the local state here instead of reloading the page.
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  // Handle submission of the add form (for demo, we simply log the data)
  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(`Submitting new ${addModalType} data`);
    // Close modal and (optionally) update state or refetch data.
    setShowAddModal(false);
    setAddModalType(null);
  }

  // Render the add modal with smooth transitions
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
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {addModalType
                  ? `Ajouter ${
                      addModalType === "organization"
                        ? "une Organisation"
                        : addModalType === "dossier"
                        ? "un Dossier"
                        : addModalType === "document"
                        ? "un Document"
                        : addModalType === "ticket"
                        ? "un Ticket/Support"
                        : "un Commentaire"
                    }`
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
                // When addModalType is "dossier", render the custom AddDossierForm.
                <AddDossierForm
                  contactId={contactId} // pass the contactId to the form
                  // contactName={contactName}
                  onClose={() => {
                    setShowAddModal(false);
                    setAddModalType(null);
                  }}
                />
              ) : (
                // For other add types, render your default form.
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {addModalType === "organization"
                        ? "Nom"
                        : addModalType === "document"
                        ? "Titre"
                        : addModalType === "ticket"
                        ? "Ticket ID"
                        : "Auteur"}
                    </label>
                    <input
                      type="text"
                      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="Saisir la valeur..."
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )
            ) : (
              // When no type is selected, show buttons to choose the add type.
              <div className="space-y-2">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("organization")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouvelle Organisation
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("dossier")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau Dossier
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("document")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau Document
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("ticket")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau Ticket/Support
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => setAddModalType("commentaire")}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Nouveau Commentaire
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (loading)
    return <div className="p-4 text-center">Chargement...</div>;

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

      {/* Organisations Section */}
      {organizations.length > 0 && (
        <AccordionSection title="Organisations">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Nom
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Secteur
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Coordonnées
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Rôle
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Taille
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Solutions
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org, index) => (
                  <tr
                    key={`org-${org.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                      <div>Employés: {org.taille?.employees || "N/A"}</div>
                      <div>
                        Revenu: {org.taille?.annualRevenue || "N/A"}
                      </div>
                      <div>
                        Régions: {org.taille?.regionsServed || "N/A"}
                      </div>
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

      {/* Documents Section */}
      {dossiers.length > 0 && (
        <AccordionSection title="Dossiers">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    N° Dossier
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Client
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Projet
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Solutions
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Étape
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Valeur
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Échéances
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dossiers.map((dos, index) => (
                  <tr
                    key={`dos-${dos.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{dos.numero}</td>
                    <td className="px-4 py-2">{dos.client}</td>
                    <td className="px-4 py-2">{dos.projet}</td>
                    <td className="px-4 py-2">{dos.solution}</td>
                    <td className="px-4 py-2">{dos.etape}</td>
                    <td className="px-4 py-2">{dos.valeur}</td>
                    <td className="px-4 py-2">
                      <div>Début: {dos.échéances?.startDate || "N/A"}</div>
                      <div>
                        Fin prévue: {dos.échéances?.expectedCompletion || "N/A"}
                      </div>
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

      {/* Tickets/Support Section */}
      {tickets.length > 0 && (
        <AccordionSection title="Tickets/Support">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Ticket
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Problème
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Statut
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Technicien
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Dates
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket, index) => (
                  <tr
                    key={`ticket-${ticket.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{ticket.ticket}</td>
                    <td className="px-4 py-2">{ticket.problème}</td>
                    <td className="px-4 py-2">{ticket.statut}</td>
                    <td className="px-4 py-2">{ticket.technicien}</td>
                    <td className="px-4 py-2">
                      <div>Créé: {ticket.dates?.created || "N/A"}</div>
                      <div>Mis à jour: {ticket.dates?.updated || "N/A"}</div>
                      <div>Résolu: {ticket.dates?.resolution || "N/A"}</div>
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

      {/* Commentaires Section */}
      {commentaires.length > 0 && (
        <AccordionSection title="Commentaire (Notes)">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Auteur
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Commentaire
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commentaires.map((comm, index) => (
                  <tr
                    key={`comm-${comm.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
