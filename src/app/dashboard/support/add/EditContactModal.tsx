"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { Contact } from "./ContactActionsModal"; // Vérifiez le chemin d'importation

interface EditContactModalProps {
  contact: Contact;
  onClose: () => void;
  onSave: (updatedContact: Contact) => void;
}

// A custom TagInput component for a modern tag UI.
const TagInput: React.FC<{
  tags: string[];
  setTags: (tags: string[]) => void;
}> = ({ tags, setTags }) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // When user presses Enter or comma, add the tag.
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    // Allow Backspace to remove the last tag if input is empty.
    if (e.key === "Backspace" && !input && tags.length > 0) {
      setTags(tags.slice(0, tags.length - 1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
        >
          <span>{tag}</span>
          <button
            onClick={() => removeTag(index)}
            className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label={`Supprimer le tag ${tag}`}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tapez un tag et appuyez sur Entrée..."
        className="flex-grow min-w-[150px] focus:outline-none"
      />
    </div>
  );
};

// Reusable collapsible section component (accordion style), open by default.
const SectionDeroulante: React.FC<{ titre: string; children: React.ReactNode }> = ({
  titre,
  children,
}) => {
  const [ouvert, setOuvert] = useState(true);
  return (
    <div className="border-b pb-4 mb-4">
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full flex justify-between items-center text-left text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors"
      >
        <span>{titre}</span>
        {ouvert ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>
      {ouvert && <div className="mt-3">{children}</div>}
    </div>
  );
};

export function EditContactModal({ contact, onClose, onSave }: EditContactModalProps) {
  // States for "Nom et Poste"
  const [nom, setNom] = useState(contact.name || "");
  const [prefixe, setPrefixe] = useState(contact.prefix || "");
  const [organisation, setOrganisation] = useState(contact.organization || "");
  const [titre, setTitre] = useState(contact.titre || "");

  // States for "Détails du contact"
  const [email, setEmail] = useState(contact.email || "");
  const [emailDesinscrit, setEmailDesinscrit] = useState(contact.emailOptedOut || false);
  const [telephone, setTelephone] = useState(contact.phone || "");
  const [telephoneFixe, setTelephoneFixe] = useState(contact.homePhone || "");
  const [telephoneMobile, setTelephoneMobile] = useState(contact.mobilePhone || "");
  const [autreTelephone, setAutreTelephone] = useState(contact.otherPhone || "");
  const [telephoneAssistant, setTelephoneAssistant] = useState(contact.assistantPhone || "");
  const [nomAssistant, setNomAssistant] = useState(contact.assistantName || "");
  const [fax, setFax] = useState(contact.fax || "");
  const [linkedin, setLinkedin] = useState(contact.linkedIn || "");
  const [facebook, setFacebook] = useState(contact.facebook || "");
  const [twitter, setTwitter] = useState(contact.twitter || "");

  // States for "Informations d'adresse"
  const [adressePrincipale, setAdressePrincipale] = useState(contact.mailingAddress || "");
  const [autreAdresse, setAutreAdresse] = useState(contact.otherAddress || "");

  // States for "Dates à retenir"
  const [dateARetenir, setDateARetenir] = useState(contact.dateToRemember || "");
  const [dateDeNaissance, setDateDeNaissance] = useState(contact.dateOfBirth || "");

  // State for "Informations de description"
  const [description, setDescription] = useState(contact.description || "");

  // New state for tags, as an array of strings.
  const [tags, setTags] = useState<string[]>(contact.tags || []);

  // Loading state while saving
  const [isLoading, setIsLoading] = useState(false);

  // Simple function to update one field of the contact
  const updateContactField = async (field: string, value: string | boolean | string[]) => {
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed", data);
      } else {
        console.log("Update successful", data);
      }
    } catch (err) {
      console.error("Error updating contact", err);
    }
  };

  // Simplified handleSave: update each field separately
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateContactField("name", nom);
      await updateContactField("prefix", prefixe);
      await updateContactField("organization", organisation);
      await updateContactField("titre", titre);
      await updateContactField("email", email);
      await updateContactField("emailOptedOut", emailDesinscrit);
      await updateContactField("phone", telephone);
      await updateContactField("homePhone", telephoneFixe);
      await updateContactField("mobilePhone", telephoneMobile);
      await updateContactField("otherPhone", autreTelephone);
      await updateContactField("assistantPhone", telephoneAssistant);
      await updateContactField("assistantName", nomAssistant);
      await updateContactField("fax", fax);
      await updateContactField("linkedIn", linkedin);
      await updateContactField("facebook", facebook);
      await updateContactField("twitter", twitter);
      await updateContactField("mailingAddress", adressePrincipale);
      await updateContactField("otherAddress", autreAdresse);
      await updateContactField("dateToRemember", dateARetenir);
      await updateContactField("dateOfBirth", dateDeNaissance);
      await updateContactField("description", description);
      await updateContactField("tags", tags);

      // Optionally update parent state with the fully updated contact
      onSave({
        ...contact,
        name: nom,
        prefix: prefixe,
        organization: organisation,
        titre: titre,
        email: email,
        emailOptedOut: emailDesinscrit,
        phone: telephone,
        homePhone: telephoneFixe,
        mobilePhone: telephoneMobile,
        otherPhone: autreTelephone,
        assistantPhone: telephoneAssistant,
        assistantName: nomAssistant,
        fax: fax,
        linkedIn: linkedin,
        facebook: facebook,
        twitter: twitter,
        mailingAddress: adressePrincipale,
        otherAddress: autreAdresse,
        dateToRemember: dateARetenir,
        dateOfBirth: dateDeNaissance,
        description: description,
        tags: tags,
      });
    } catch (error) {
      console.error("Error in handleSave", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl p-8 w-11/12 max-w-3xl max-h-[95vh] overflow-y-auto"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Modifier le contact</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors">
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          {/* Form Sections */}
          <div className="space-y-8">
            {/* Section Nom et Poste */}
            <SectionDeroulante titre="Nom et Poste">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Entrez le nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Préfixe</label>
                  <input
                    type="text"
                    value={prefixe}
                    onChange={(e) => setPrefixe(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="M., Mme, Dr, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organisation</label>
                  <input
                    type="text"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nom de l'organisation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Titre du poste"
                  />
                </div>
              </div>
            </SectionDeroulante>
            {/* Section Détails du contact */}
            <SectionDeroulante titre="Détails du contact">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="exemple@domaine.com"
                  />
                </div>
                <div className="flex items-center col-span-2">
                  <input
                    type="checkbox"
                    checked={emailDesinscrit}
                    onChange={(e) => setEmailDesinscrit(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    id="emailDesinscrit"
                  />
                  <label htmlFor="emailDesinscrit" className="ml-2 text-sm text-gray-700">
                    Email désinscrit
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Numéro de téléphone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone fixe</label>
                  <input
                    type="text"
                    value={telephoneFixe}
                    onChange={(e) => setTelephoneFixe(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Téléphone fixe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone mobile</label>
                  <input
                    type="text"
                    value={telephoneMobile}
                    onChange={(e) => setTelephoneMobile(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Téléphone mobile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Autre téléphone</label>
                  <input
                    type="text"
                    value={autreTelephone}
                    onChange={(e) => setAutreTelephone(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Autre numéro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone assistant</label>
                  <input
                    type="text"
                    value={telephoneAssistant}
                    onChange={(e) => setTelephoneAssistant(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Numéro de l'assistant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l&apos;assistant</label>
                  <input
                    type="text"
                    value={nomAssistant}
                    onChange={(e) => setNomAssistant(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nom de l'assistant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fax</label>
                  <input
                    type="text"
                    value={fax}
                    onChange={(e) => setFax(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Numéro de fax"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Profil LinkedIn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Profil Facebook"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Profil Twitter"
                  />
                </div>
              </div>
            </SectionDeroulante>
            {/* Section Informations d'adresse */}
            <SectionDeroulante titre="Informations d'adresse">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse principale</label>
                  <input
                    type="text"
                    value={adressePrincipale}
                    onChange={(e) => setAdressePrincipale(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Entrez l'adresse principale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Autre adresse</label>
                  <input
                    type="text"
                    value={autreAdresse}
                    onChange={(e) => setAutreAdresse(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Entrez l'autre adresse"
                  />
                </div>
              </div>
            </SectionDeroulante>
            {/* Section Dates à retenir */}
            <SectionDeroulante titre="Dates à retenir">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date à retenir</label>
                  <input
                    type="text"
                    value={dateARetenir}
                    onChange={(e) => setDateARetenir(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ajouter une date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                  <input
                    type="date"
                    value={dateDeNaissance}
                    onChange={(e) => setDateDeNaissance(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </SectionDeroulante>
            {/* Section Informations de description */}
            <SectionDeroulante titre="Informations de description">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Décrivez le contact"
                />
              </div>
            </SectionDeroulante>
            {/* Improved Section for Tag Input */}
            <SectionDeroulante titre="Informations sur les étiquettes">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étiquettes (séparées par des virgules)
                </label>
                <TagInput tags={tags} setTags={setTags} />
              </div>
            </SectionDeroulante>
          </div>
          {/* Modal Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Enregistrer"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
