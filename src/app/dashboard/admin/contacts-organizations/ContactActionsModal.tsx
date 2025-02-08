// ContactActionsModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PencilIcon,
  PhotoIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  PrinterIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  Squares2X2Icon,
  BriefcaseIcon,
  FolderIcon,
  BuildingOfficeIcon as OrgBuildingIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NewProjectForm } from "./NewProjectForm";
import { ConvertToOrganizationForm } from "./ConvertToOrganizationForm";

/**
 * The canonical Contact interface used throughout your app.
 */
export interface Contact {
  lastName: string;
  firstName: string;
  effectif: string | number | boolean;
  secteur: string | number | boolean;
  dateToRemember: string;
  prefix: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role?: string;
  titre: string;
  tags?: string[];
  suivi: boolean;
  emailOptedOut?: boolean;
  homePhone?: string;
  mobilePhone?: string;
  otherPhone?: string;
  assistantPhone?: string;
  assistantName?: string;
  fax?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
  mailingAddress?: string;
  otherAddress?: string;
  dateOfBirth?: string;
  dateNextActivity?: string;
  dateLastActivity?: string;
  contactCreated?: string;
  linkedLead?: string;
  description?: string;
  // New fields:
  department?: string;
  climateZone?: string;
  rfr?: number;
  organizationPhone?: string;
  organizationAddress?: string;
  heatingType?: string;
  imageUrl?: string;
}

interface ContactActionsModalProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactActionsModal({ contact, onClose }: ContactActionsModalProps) {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showConvertToOrgForm, setShowConvertToOrgForm] = useState(false);

  const handleChangeContactImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        try {
          const res = await fetch(`/api/contacts/${contact.id}/image`, {
            method: "PUT",
            body: formData,
          });
          if (res.ok) {
            console.log("Image updated for contact", contact.id);
            // Optionally, update UI or refetch the contact data.
          } else {
            console.error("Failed to update image for contact", contact.id);
          }
        } catch (err) {
          console.error("Error updating image", err);
        }
      }
    };
    fileInput.click();
  };

  // Delete the contact by calling the DELETE API endpoint.
  const handleDeleteContact = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      try {
        const res = await fetch(`/api/contacts/${contact.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          console.log("Contact deleted", contact.id);
          // Optionally, trigger a refetch or navigate away.
        } else {
          console.error("Failed to delete contact", contact.id);
        }
      } catch (err) {
        console.error("Error deleting contact", err);
      }
    }
  };

  // Clone the contact by removing its id and sending it via a POST request.
  const handleCloneContact = async () => {
    try {
      const { id: _id, ...contactData } = contact; // omit the id property
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Assuming the API expects an array of contacts:
        body: JSON.stringify([contactData]),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Contact cloned successfully", data);
      } else {
        console.error("Failed to clone contact", _id);
      }
    } catch (err) {
      console.error("Error cloning contact", err);
    }
  };    

  // Update the contact's marketing status (example: add a flag "inMarketingList")
  const handleAddToMarketingList = async () => {
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inMarketingList: true }),
      });
      if (res.ok) {
        console.log("Contact added to marketing list", contact.id);
      } else {
        console.error("Error updating marketing status for contact", contact.id);
      }
    } catch (err) {
      console.error("Error in addToMarketingList", err);
    }
  };

  // Convert the contact to a lead (prospect)
  const handleConvertToLead = async () => {
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lead" }), // Adjust as needed
      });
      if (res.ok) {
        console.log("Contact converted to lead", contact.id);
      } else {
        console.error("Error converting contact to lead", contact.id);
      }
    } catch (err) {
      console.error("Error in convertToLead", err);
    }
  };

  // Trigger the browser's print function.
  const handlePrintContact = () => {
    // Open a new window for printing.
    const printWindow = window.open("", "PRINT", "height=900,width=1200");
    if (!printWindow) {
      console.error("Unable to open print window.");
      return;
    }
  
    // Build the HTML template with custom fonts, a company logo, and a polished layout.
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <title>Fiche Contact - ${contact.name}</title>
          <style>
            /* Import custom fonts from local files */
            @font-face {
              font-family: 'HeaderFont';
              src: url('./fonts/Sato-Medium.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
            }
            @font-face {
              font-family: 'BodyFont';
              src: url('./fonts/RedHatDisplayMedium.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
            }
            :root {
              --primary-color: #007acc;
              --secondary-color: #005a99;
              --bg-color: #f7f9fc;
              --card-bg: #ffffff;
              --text-color: #333;
              --light-text: #555;
              --border-color: #e0e0e0;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'BodyFont', sans-serif;
              margin: 0;
              padding: 20px;
              background: var(--bg-color);
              color: var(--text-color);
              line-height: 1.6;
            }
            header {
              display: flex;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid var(--border-color);
            }
            .company-logo {
              width: 80px;
              height: auto;
              margin-right: 20px;
            }
            .profile-img {
              width: 140px;
              height: 140px;
              border-radius: 50%;
              object-fit: cover;
              margin-right: 30px;
              border: 4px solid var(--primary-color);
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .placeholder-img {
              width: 140px;
              height: 140px;
              border-radius: 50%;
              background: var(--border-color);
              color: #fff;
              font-size: 4rem;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 30px;
              border: 4px solid var(--primary-color);
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .contact-header {
              flex: 1;
            }
            .contact-header h1 {
              font-family: 'HeaderFont', sans-serif;
              font-size: 2.5rem;
              margin-bottom: 10px;
              color: var(--primary-color);
            }
            .contact-header h2 {
              font-size: 1.3rem;
              font-weight: 400;
              color: var(--light-text);
              margin-bottom: 5px;
            }
            .contact-header p {
              font-size: 1.1rem;
              margin: 0;
            }
            .section {
              margin-bottom: 40px;
            }
            .section h3 {
              font-family: 'HeaderFont', sans-serif;
              font-size: 1.8rem;
              margin-bottom: 20px;
              border-left: 4px solid var(--primary-color);
              padding-left: 10px;
              color: var(--secondary-color);
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 20px;
            }
            .card {
              background: var(--card-bg);
              padding: 20px;
              border: 1px solid var(--border-color);
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            .card label {
              display: block;
              font-weight: 500;
              margin-bottom: 8px;
              color: var(--light-text);
              text-transform: uppercase;
              font-size: 0.85rem;
            }
            .card span {
              font-size: 1rem;
              color: var(--text-color);
              word-break: break-word;
            }
            .description {
              background: var(--card-bg);
              padding: 25px;
              border: 1px solid var(--border-color);
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
              font-size: 1rem;
              color: var(--text-color);
            }
            footer {
              text-align: center;
              font-size: 0.9rem;
              color: var(--light-text);
              margin-top: 50px;
              border-top: 1px solid var(--border-color);
              padding-top: 15px;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <header>
            <!-- Company logo -->
            <img class="company-logo" src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png" alt="Company Logo" />
            ${
              contact.imageUrl
                ? `<img class="profile-img" src="${contact.imageUrl}" alt="${contact.name}" />`
                : `<div class="placeholder-img">${contact.name.charAt(0).toUpperCase()}</div>`
            }
            <div class="contact-header">
              <h1>${contact.name}</h1>
              <h2>${contact.titre}${contact.role ? " - " + contact.role : ""}</h2>
              <p>${contact.organization}</p>
            </div>
          </header>
  
          <section class="section">
            <h3>Coordonnées</h3>
            <div class="grid">
              <div class="card">
                <label>Email</label>
                <span>${contact.email}</span>
              </div>
              <div class="card">
                <label>Téléphone</label>
                <span>${contact.phone}</span>
              </div>
              ${contact.homePhone ? `
                <div class="card">
                  <label>Téléphone fixe</label>
                  <span>${contact.homePhone}</span>
                </div>` : ``}
              ${contact.mobilePhone ? `
                <div class="card">
                  <label>Téléphone mobile</label>
                  <span>${contact.mobilePhone}</span>
                </div>` : ``}
              ${contact.otherPhone ? `
                <div class="card">
                  <label>Autre téléphone</label>
                  <span>${contact.otherPhone}</span>
                </div>` : ``}
              <div class="card">
                <label>Adresse Principale</label>
                <span>${contact.mailingAddress || "Non défini"}</span>
              </div>
              ${contact.otherAddress ? `
                <div class="card">
                  <label>Adresse secondaire</label>
                  <span>${contact.otherAddress}</span>
                </div>` : ``}
            </div>
          </section>
  
          <section class="section">
            <h3>Informations Complémentaires</h3>
            <div class="grid">
              ${contact.dateOfBirth ? `
                <div class="card">
                  <label>Date de naissance</label>
                  <span>${contact.dateOfBirth}</span>
                </div>` : ``}
              ${contact.contactCreated ? `
                <div class="card">
                  <label>Date de création</label>
                  <span>${contact.contactCreated}</span>
                </div>` : ``}
              ${contact.dateNextActivity ? `
                <div class="card">
                  <label>Prochaine activité</label>
                  <span>${contact.dateNextActivity}</span>
                </div>` : ``}
              ${contact.dateLastActivity ? `
                <div class="card">
                  <label>Dernière activité</label>
                  <span>${contact.dateLastActivity}</span>
                </div>` : ``}
              ${contact.dateToRemember ? `
                <div class="card">
                  <label>Date à retenir</label>
                  <span>${contact.dateToRemember}</span>
                </div>` : ``}
              ${contact.linkedLead ? `
                <div class="card">
                  <label>Lien vers prospect</label>
                  <span>${contact.linkedLead}</span>
                </div>` : ``}
            </div>
          </section>
  
          <section class="section">
            <h3>Détails Organisationnels & Énergétiques</h3>
            <div class="grid">
              <div class="card">
                <label>Département</label>
                <span>${contact.department || "Non défini"}</span>
              </div>
              <div class="card">
                <label>Zone Climatique</label>
                <span>${contact.climateZone || "Non défini"}</span>
              </div>
              <div class="card">
                <label>RFR</label>
                <span>${contact.rfr ? contact.rfr + " €" : "Non défini"}</span>
              </div>
              <div class="card">
                <label>Type de Chauffage</label>
                <span>${contact.heatingType || "Non défini"}</span>
              </div>
              <div class="card">
                <label>Téléphone Organisation</label>
                <span>${contact.organizationPhone || "Non défini"}</span>
              </div>
              <div class="card">
                <label>Adresse Organisation</label>
                <span>${contact.organizationAddress || "Non défini"}</span>
              </div>
            </div>
          </section>
  
          <section class="section">
            <h3>Réseaux Sociaux & Divers</h3>
            <div class="grid">
              ${contact.linkedIn ? `
                <div class="card">
                  <label>LinkedIn</label>
                  <span>${contact.linkedIn}</span>
                </div>` : ``}
              ${contact.facebook ? `
                <div class="card">
                  <label>Facebook</label>
                  <span>${contact.facebook}</span>
                </div>` : ``}
              ${contact.twitter ? `
                <div class="card">
                  <label>Twitter</label>
                  <span>${contact.twitter}</span>
                </div>` : ``}
              ${contact.fax ? `
                <div class="card">
                  <label>Fax</label>
                  <span>${contact.fax}</span>
                </div>` : ``}
              ${contact.assistantName ? `
                <div class="card">
                  <label>Assistant(e)</label>
                  <span>${contact.assistantName}${contact.assistantPhone ? " - " + contact.assistantPhone : ""}</span>
                </div>` : ``}
              ${contact.tags && contact.tags.length ? `
                <div class="card">
                  <label>Tags</label>
                  <span>${contact.tags.join(", ")}</span>
                </div>` : ``}
            </div>
          </section>
  
          ${
            contact.description
              ? `<section class="section">
                  <h3>Description</h3>
                  <div class="description">
                    <p>${contact.description}</p>
                  </div>
                </section>`
              : ""
          }
  
          <footer>
            <p>Fiche générée par votre application - ${new Date().toLocaleDateString("fr-FR")}</p>
          </footer>
  
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;
  
    // Write the HTML content to the new window.
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
  
  // For adding new tasks, events, activity sets, opportunities, projects,
  // you might open dedicated modals or navigate to specific pages.
  // Here, we simulate these actions with API calls or logging.
  const handleAddNewTask = () => {
    // Open a modal or send an API request to create a new task.
    console.log("Adding new task(s) for contact", contact.id);
    // e.g., setShowNewTaskModal(true);
  };

  const handleAddNewEvent = () => {
    console.log("Adding new event for contact", contact.id);
    // e.g., setShowNewEventModal(true);
  };

  const handleAddActivitySet = () => {
    console.log("Adding activity set for contact", contact.id);
    // e.g., setShowActivitySetModal(true);
  };

  const handleAddNewOpportunity = () => {
    console.log("Adding new opportunity for contact", contact.id);
    // e.g., setShowNewOpportunityModal(true);
  };

  const handleAddNewProject = () => {
    setShowNewProjectForm(true);
  };

  // Convert the contact to an organization by updating its type/fields.
  const handleConvertToOrganization = () => {
    setShowConvertToOrgForm(true);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Actions pour ce contact</h2>
              <button onClick={onClose}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    console.log("Edit this contact");
                    onClose();
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                  Modifier ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleChangeContactImage();
                    console.log("Change contact image");
                    onClose();
                  }}
                >
                  <PhotoIcon className="h-4 w-4" />
                  Changer l&apos;image du contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleDeleteContact();
                    console.log("Delete this contact");
                    onClose();
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                  Supprimer ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleCloneContact();
                    console.log("Clone this contact");
                    onClose();
                  }}
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  Cloner ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleAddToMarketingList();
                    console.log("Add to marketing list");
                    onClose();
                  }}
                >
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                  Ajouter à la liste marketing
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleConvertToLead();
                    console.log("Change contact to lead");
                    onClose();
                  }}
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Transformer ce contact en prospect
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handlePrintContact();
                    console.log("Print this contact");
                    onClose();
                  }}
                >
                  <PrinterIcon className="h-4 w-4" />
                  Imprimer ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleAddNewTask();
                    console.log("Add new tasks for contact");
                    onClose();
                  }}
                >
                  <ClipboardDocumentCheckIcon className="h-4 w-4" />
                  Ajouter de nouvelles tâches pour ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleAddNewEvent();
                    console.log("Add new event for contact");
                    onClose();
                  }}
                >
                  <CalendarIcon className="h-4 w-4" />
                  Ajouter un nouvel événement pour ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleAddActivitySet();
                    console.log("Add activity set for contact");
                    onClose();
                  }}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                  Ajouter un ensemble d&apos;activités pour ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleAddNewOpportunity();
                    console.log("Add new opportunity for contact");
                    onClose();
                  }}
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Ajouter une nouvelle opportunité pour ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleAddNewProject();
                    // Do not immediately close the modal; the form modal will appear.
                  }}
                >
                  <FolderIcon className="h-4 w-4" />
                  Ajouter un nouveau projet pour ce contact
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleConvertToOrganization();
                    // Do not immediately close the modal; the form modal will appear.
                  }}
                >
                  <OrgBuildingIcon className="h-4 w-4" />
                  Convertir ce contact en organisation
                </button>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Render the New Project Form modal if needed */}
      {showNewProjectForm && (
        <NewProjectForm
          contact={contact}
          onClose={() => setShowNewProjectForm(false)}
          onProjectAdded={() => {
            console.log("New project added.");
          }}
        />
      )}

      {/* Render the Convert to Organization Form modal if needed */}
      {showConvertToOrgForm && (
        <ConvertToOrganizationForm
          contact={contact}
          onClose={() => setShowConvertToOrgForm(false)}
          onOrganizationAdded={() => {
            console.log("Contact converted to organization.");
          }}
        />
      )}
    </>
  );
}
