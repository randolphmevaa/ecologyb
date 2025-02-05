// components/RelatedTab.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Define types (adjust these based on your schema)
type Organization = { 
  id: number | string; 
  nom: string; 
  secteur: string; 
  // coordonnées is now an object with nested properties:
  coordonnées: {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  }; 
  rôle: string; 
  // taille is now an object with nested properties:
  taille: {
    employees?: string;
    annualRevenue?: string;
    regionsServed?: string;
  }; 
  solutions: string; 
};

type Dossier = { 
  id: number | string; 
  numero: string; 
  client: string; 
  projet: string; 
  solutions: string; 
  étape: string; 
  valeur: string; 
  // échéances is now an object with nested properties:
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
  // dates is now an object with nested properties:
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

// Enhanced AccordionSection with better interaction
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
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-3 px-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-500" />}
          <span className="font-semibold text-gray-700">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 0 : 180 }}
          className="text-gray-500"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">{children}</div>
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
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // Modal state for adding new data
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<"organization" | "dossier" | "document" | "ticket" | "commentaire" | null>(null);

  // Fetch data from all collections based on contactId
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [orgRes, dosRes, docRes, tickRes, commRes] = await Promise.all([
          fetch(`/api/organizations?id=${contactId}`),
          fetch(`/api/dossiers?id=${contactId}`),
          fetch(`/api/documents?id=${contactId}`),
          fetch(`/api/tickets?id=${contactId}`),
          fetch(`/api/commentaires?id=${contactId}`)
        ]);

        const [orgData, dosData, docData, tickData, commData] = await Promise.all([
          orgRes.json(),
          dosRes.json(),
          docRes.json(),
          tickRes.json(),
          commRes.json()
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
    updatedData: Record<string, unknown> // or use a union type like UpdateData if needed
  ) {
    try {
      const res = await fetch(`/api/${collection}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour.");
      // Optionally refetch data here
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  // Handle submission of the add form (for demo, we just log the data)
  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(`Submitting new ${addModalType} data`);
    // Close modal and optionally update state or refetch data.
    setShowAddModal(false);
    setAddModalType(null);
  }

  // Render the add modal
  function renderAddModal() {
    if (!showAddModal) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {addModalType 
                ? `Ajouter un(e) ${
                    addModalType === "organization" ? "Organisation" :
                    addModalType === "dossier" ? "Dossier" :
                    addModalType === "document" ? "Document" :
                    addModalType === "ticket" ? "Ticket/Support" :
                    "Commentaire"
                  }`
                : "Sélectionnez un type"}
            </h2>
            <button onClick={() => { setShowAddModal(false); setAddModalType(null); }} className="text-red-600">&times;</button>
          </div>
          {addModalType ? (
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {addModalType === "organization" ? "Nom" : addModalType === "dossier" ? "Numéro" : addModalType === "document" ? "Titre" : addModalType === "ticket" ? "Ticket ID" : "Auteur"}
                </label>
                <input type="text" className="w-full border px-2 py-1" placeholder="Saisir la valeur..." required />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <button
                key="btn-org"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setAddModalType("organization")}
              >
                Nouvelle Organisation
              </button>
              <button
                key="btn-dos"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setAddModalType("dossier")}
              >
                Nouveau Dossier
              </button>
              <button
                key="btn-doc"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setAddModalType("document")}
              >
                Nouveau Document
              </button>
              <button
                key="btn-tick"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setAddModalType("ticket")}
              >
                Nouveau Ticket/Support
              </button>
              <button
                key="btn-comm"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setAddModalType("commentaire")}
              >
                Nouveau Commentaire
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) return <div>Chargement...</div>;

  const isEmpty =
    organizations.length === 0 &&
    dossiers.length === 0 &&
    documents.length === 0 &&
    tickets.length === 0 &&
    commentaires.length === 0;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <button
          onClick={() => { setShowAddModal(true); setAddModalType(null); }}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Ajouter
        </button>
      </div>

      {renderAddModal()}

      {isEmpty && <div>Aucune information n&apos;a été trouvée.</div>}

      {/* Organisations Section */}
      {organizations.length > 0 && (
        <AccordionSection title="Organisations">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">Nom</th>
                <th className="px-2 py-1 text-left">Secteur</th>
                <th className="px-2 py-1 text-left">Coordonnées</th>
                <th className="px-2 py-1 text-left">Rôle</th>
                <th className="px-2 py-1 text-left">Taille</th>
                <th className="px-2 py-1 text-left">Solutions</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, index) => (
                <tr key={`org-${org.id}-${index}`} className="border-b">
                  <td className="px-2 py-1">{org.nom}</td>
                  <td className="px-2 py-1">{org.secteur}</td>
                  <td className="px-2 py-1">
                    <div>{org.coordonnées?.phone || "N/A"}</div>
                    <div>{org.coordonnées?.email || "N/A"}</div>
                    <div>{org.coordonnées?.address || "N/A"}</div>
                    <div>{org.coordonnées?.website || "N/A"}</div>
                  </td>
                  <td className="px-2 py-1">{org.rôle}</td>
                  <td className="px-2 py-1">
                    <div>Employés: {org.taille?.employees || "N/A"}</div>
                    <div>Revenu: {org.taille?.annualRevenue || "N/A"}</div>
                    <div>Régions: {org.taille?.regionsServed || "N/A"}</div>
                  </td>
                  <td className="px-2 py-1">{org.solutions}</td>
                  <td className="px-2 py-1">
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        const updatedData = { /* ...nouvelles données... */ };
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
        </AccordionSection>
      )}

      {/* Dossiers Section */}
      {dossiers.length > 0 && (
        <AccordionSection title="Dossiers">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">N° Dossier</th>
                <th className="px-2 py-1 text-left">Client</th>
                <th className="px-2 py-1 text-left">Projet</th>
                <th className="px-2 py-1 text-left">Solutions</th>
                <th className="px-2 py-1 text-left">Étape</th>
                <th className="px-2 py-1 text-left">Valeur</th>
                <th className="px-2 py-1 text-left">Échéances</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((dos, index) => (
                <tr key={`dos-${dos.id}-${index}`} className="border-b">
                  <td className="px-2 py-1">{dos.numero}</td>
                  <td className="px-2 py-1">{dos.client}</td>
                  <td className="px-2 py-1">{dos.projet}</td>
                  <td className="px-2 py-1">{dos.solutions}</td>
                  <td className="px-2 py-1">{dos.étape}</td>
                  <td className="px-2 py-1">{dos.valeur}</td>
                  <td className="px-2 py-1">
                    <div>Début: {dos.échéances?.startDate || "N/A"}</div>
                    <div>Fin prévue: {dos.échéances?.expectedCompletion || "N/A"}</div>
                  </td>
                  <td className="px-2 py-1">
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        const updatedData = { /* ...nouvelles données... */ };
                        handleUpdate("dossiers", dos.id, updatedData);
                      }}
                    >
                      Éditer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionSection>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <AccordionSection title="Documents">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">Document</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Solution</th>
                <th className="px-2 py-1 text-left">Mise à jour</th>
                <th className="px-2 py-1 text-left">Auteur</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={`doc-${doc.id}-${index}`} className="border-b">
                  <td className="px-2 py-1">
                    <div>{doc.document}</div>
                    <div className="text-gray-500 text-xs">{doc.filePath}</div>
                  </td>
                  <td className="px-2 py-1">{doc.type}</td>
                  <td className="px-2 py-1">{doc.solution}</td>
                  <td className="px-2 py-1">{doc.miseAJour}</td>
                  <td className="px-2 py-1">{doc.auteur}</td>
                  <td className="px-2 py-1">
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => {
                        setPreviewDoc(doc);
                      }}
                    >
                      Prévisualiser
                    </button>
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        const updatedData = { /* ...nouvelles données... */ };
                        handleUpdate("documents", doc.id, updatedData);
                      }}
                    >
                      Éditer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {previewDoc && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded">
                <h2 className="font-bold mb-2">Prévisualisation du document</h2>
                <iframe
                  src={previewDoc.filePath}
                  title={previewDoc.document}
                  width="600"
                  height="400"
                />
                <button
                  className="mt-2 text-red-600"
                  onClick={() => setPreviewDoc(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </AccordionSection>
      )}

      {/* Tickets/Support Section */}
      {tickets.length > 0 && (
        <AccordionSection title="Tickets/Support">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">Ticket</th>
                <th className="px-2 py-1 text-left">Problème</th>
                <th className="px-2 py-1 text-left">Statut</th>
                <th className="px-2 py-1 text-left">Technicien</th>
                <th className="px-2 py-1 text-left">Dates</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={`ticket-${ticket.id}-${index}`} className="border-b">
                  <td className="px-2 py-1">{ticket.ticket}</td>
                  <td className="px-2 py-1">{ticket.problème}</td>
                  <td className="px-2 py-1">{ticket.statut}</td>
                  <td className="px-2 py-1">{ticket.technicien}</td>
                  <td className="px-2 py-1">
                    <div>Créé: {ticket.dates?.created || "N/A"}</div>
                    <div>Mis à jour: {ticket.dates?.updated || "N/A"}</div>
                    <div>Résolu: {ticket.dates?.resolution || "N/A"}</div>
                  </td>
                  <td className="px-2 py-1">
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        const updatedData = { /* ...nouvelles données... */ };
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
        </AccordionSection>
      )}

      {/* Commentaire (Notes) Section */}
      {commentaires.length > 0 && (
        <AccordionSection title="Commentaire (Notes)">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">Auteur</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Commentaire</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commentaires.map((comm, index) => (
                <tr key={`comm-${comm.id}-${index}`} className="border-b">
                  <td className="px-2 py-1">
                    <div>{comm.auteur}</div>
                    <div className="text-xs text-gray-500">{comm.role}</div>
                  </td>
                  <td className="px-2 py-1">{comm.date}</td>
                  <td className="px-2 py-1">{comm.commentaire}</td>
                  <td className="px-2 py-1">
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        const updatedData = { /* ...nouvelles données... */ };
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
        </AccordionSection>
      )}
    </div>
  );
}
