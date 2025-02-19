"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Select, { MultiValue } from "react-select";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";

// ----------------------
// Interfaces
// ----------------------

interface Comment {
  text: string;
  timestamp: string;
}

interface CommentAPI {
  _id: string;
  contactId: string;
  auteur: string;
  date: string;
  commentaire: string;
  linkedTo: string;
}

export interface Contact {
  eligible: boolean;
  rfr: string;
  climateZone: string;
  mprpassword: string;
  mpremail: string;
  maprNumero: string;
  contactId: string;
  imageUrl: File | null;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  mailingAddress: string;
  phone: string;
  email: string;
  role: string;
  numeroDossier: string;
  department: string;
  gestionnaireSuivi: string;
  comments: Comment[];
}


export interface Dossier {
  numero: string; // <-- Add this line
  informationLogement: {
    systemeChauffage: string[];
    surfaceHabitable: string;
    typeCompteurElectrique: string;
    projetPropose: string[];
    anneeConstruction: string;
    typeLogement: string;
    profileLogement: string;
  };
  informationAides: {
    numeroDossierMPR: string;
    nombrePersonne: string;
    codePostale: string;
    zoneClimatique: string;
    rfr: string;
    mprColor: string;
    compteMPRExistant: boolean;
    mpremail: string;
    mprpassword: string;
    eligible: boolean;
  };
  phaseProjet: string;
  typeTravaux: string;
  contactId: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

interface AddressSuggestion {
  properties: {
    label: string;
    id?: string;
    context: string;
    postcode: string;
  };
}

export interface ContactPayload extends Contact {
  maprNumero: string;
  mpremail: string;
  mprpassword: string;
  climateZone: string;
  rfr: string;
  eligible: boolean;
  contactId: string;
}

// ----------------------
// Options
// ----------------------

const projetOptions = [
  { value: "Pompes a chaleur", label: "Pompes a chaleur" },
  { value: "Chauffe-eau solaire individuel", label: "Chauffe-eau solaire individuel" },
  { value: "Chauffe-eau thermodynamique", label: "Chauffe-eau thermodynamique" },
  { value: "Système Solaire Combiné", label: "Système Solaire Combiné" },
  { value: "Poêle à granulés", label: "Poêle à granulés" },
  { value: "Panneaux photovoltaïques", label: "Panneaux photovoltaïques" },
];

const typeLogementOptions = [
  { value: "Maison", label: "Maison" },
  { value: "Appartement", label: "Appartement" },
  { value: "Autre", label: "Autre" },
];

const profileLogementOptions = [
  { value: "proprietaireOccupant", label: "Propriétaire Occupant" },
  { value: "proprietaireBailleur", label: "Propriétaire Bailleur" },
  { value: "locataire", label: "Locataire" },
  { value: "sci", label: "SCI" },
  { value: "residenceSecondaire", label: "Résidence Secondaire" },
];

const travauxOptions = [
  { value: "Mono-geste", label: "Mono-geste" },
  { value: "Financement", label: "Financement" },
  { value: "Rénovation d'ampleur", label: "Rénovation d'ampleur" },
  { value: "Panneaux photovoltaique", label: "Panneaux photovoltaique" },
];

const phaseProjetOptions = [
  { value: "1 Prise de contact", label: "1 Prise de contact" },
  { value: "2 En attente des documents", label: "2 En attente des documents" },
  { value: "3 Instruction du dossier", label: "3 Instruction du dossier" },
  { value: "4 Dossier Accepter", label: "4 Dossier Accepter" },
  { value: "5 Installation", label: "5 Installation" },
  { value: "6 Contrôle", label: "6 Contrôle" },
  { value: "7 Dossier clôturé", label: "7 Dossier clôturé" },
];

const chauffageOptions = [
  { value: "gaz", label: "Gaz" },
  { value: "fioul", label: "Fioul" },
  { value: "electrique", label: "Electrique" },
  { value: "pompe-a-chaleur", label: "Pompe à chaleur" },
  { value: "chaudiere-a-bois", label: "Chaudière à bois" },
  { value: "chaudiere-a-granules", label: "Chaudière à granulés" },
];

// ----------------------
// Component
// ----------------------

export default function EditContactDossierPage() {
  const router = useRouter();
  const { id } = useParams(); // dynamic route parameter
  const [comments, setComments] = useState<Comment[]>([]);

  // ----------------------
  // State definitions
  // ----------------------

  const [contact, setContact] = useState<Contact>({
    eligible: false, // now a boolean
    rfr: "",
    climateZone: "",
    mprpassword: "",
    mpremail: "",
    maprNumero: "",
    contactId: "",
    imageUrl: null,
    lastName: "",
    firstName: "",
    dateOfBirth: "",
    mailingAddress: "",
    phone: "",
    email: "",
    role: "Client / Customer (Client Portal)",
    numeroDossier: "",
    department: "",
    gestionnaireSuivi: "",
    comments: [],
  });
  

  const [dossier, setDossier] = useState<Dossier>({
    numero: "",
    informationLogement: {
      systemeChauffage: [],
      surfaceHabitable: "",
      typeCompteurElectrique: "",
      projetPropose: [],
      anneeConstruction: "",
      typeLogement: "",
      profileLogement: "",
    },
    informationAides: {
      numeroDossierMPR: "",
      nombrePersonne: "",
      codePostale: "",
      zoneClimatique: "",
      rfr: "",
      mprColor: "",
      compteMPRExistant: false,
      mpremail: "",
      mprpassword: "",
      eligible: false,
    },
    phaseProjet: "",
    typeTravaux: "",
    contactId: "",
  });
  
  

  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [dossierErrors ] = useState<{ [key: string]: string }>({});
  const [createdContactId, setCreatedContactId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("client");
  const tabs = [
    { key: "client", label: "Information client" },
    { key: "habitation", label: "Information de l'habitation" },
    { key: "aides", label: "Information des aides" },
    { key: "projet", label: "Le projet" },
  ];

  const [commentInput, setCommentInput] = useState("");

  // ----------------------
  // Fetch existing data using the id parameter
  // ----------------------
  // useEffect(() => {
  //   if (!id) return;
  //   async function fetchData() {
  //     try {
  //       // First, fetch the dossier data using the id from the URL
  //       const resDossier = await fetch(`/api/dossiers/${id}`);
  //       if (!resDossier.ok) throw new Error("Failed to fetch dossier data");
  //       const fetchedDossier = await resDossier.json();
  //       setDossier(fetchedDossier);
  
  //       // Now fetch the contact data using dossier.contactId
  //       if (fetchedDossier.contactId) {
  //         const resContact = await fetch(`/api/contacts/${fetchedDossier.contactId}`);
  //         if (!resContact.ok) throw new Error("Failed to fetch contact data");
  //         const fetchedContact = await resContact.json();
  //         setContact(fetchedContact);
  //         setCreatedContactId(fetchedContact.contactId);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  //   fetchData();
  // }, [id]);  

  // ----------------------
  // Other effects (e.g. fetch users, calculate eligibility, etc.)
  // ----------------------
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  // (Optional) If you want to auto-set some fields when editing, you may add additional effects here.
  // For example, if you need to recalculate eligibility when RFR changes:
  useEffect(() => {
    // Only run if informationAides exists
    if (dossier.informationAides) {
      // Provide a fallback of "0" if rfr is not defined
      const rfrValue = parseFloat(dossier.informationAides.rfr || "0");
      const eligible = !isNaN(rfrValue) && rfrValue >= 30000;
      setDossier((prev) => ({
        ...prev,
        informationAides: { ...prev.informationAides, eligible },
      }));
    }
  }, [dossier.informationAides?.rfr]);
  
  useEffect(() => {
    if (dossier.informationAides) {
      const num = parseInt(dossier.informationAides.nombrePersonne || "0");
      const rfrValue = parseFloat(dossier.informationAides.rfr || "0");
      if (!isNaN(num) && !isNaN(rfrValue)) {
        const color = num >= 3 && rfrValue >= 30000 ? "vert" : "rouge";
        setDossier((prev) => ({
          ...prev,
          informationAides: { ...prev.informationAides, mprColor: color },
        }));
      }
    }
  }, [dossier.informationAides?.nombrePersonne, dossier.informationAides?.rfr]);

  // ----------------------
  // Handlers for Address Autocomplete, Comments, Image Upload, etc.
  // ----------------------
  const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setContact({ ...contact, mailingAddress: query });
    if (query.length > 3) {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await res.json();
        setAddressSuggestions(data.features);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectAddressSuggestion = (suggestion: AddressSuggestion) => {
    const label = suggestion.properties.label;
    const context = suggestion.properties.context;
    let department = "";
    if (context) {
      department = context.split(",")[0];
    }
    const postcode = suggestion.properties.postcode || "";
    let zoneClimatique = "";
    if (department === "75") zoneClimatique = "H1";
    else if (department === "77") zoneClimatique = "H2";
    else if (department === "78") zoneClimatique = "H3";
    else zoneClimatique = "H1";
    setContact({ ...contact, mailingAddress: label, department });
    setDossier((prev) => ({
      ...prev,
      informationAides: { ...prev.informationAides, codePostale: postcode, zoneClimatique },
    }));
    setAddressSuggestions([]);
  };

  const handleContactBlur = (field: keyof Contact, value: Contact[typeof field]) => {
    if (!value && field !== "imageUrl") {
      setContactErrors((prev) => ({ ...prev, [field]: "Ce champ est requis" }));
    }
  };

  const addComment = () => {
    if (commentInput.trim() !== "") {
      const newComment: Comment = {
        text: commentInput.trim(),
        timestamp: new Date().toLocaleString(),
      };
      // Optionally update locally before syncing with your backend.
      setComments((prev) => [...prev, newComment]);
      setCommentInput("");
      // You might also want to POST this new comment to your /api/commentaires endpoint.
    }
  };

  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
  //     setContact({ ...contact, imageUrl: e.dataTransfer.files[0] });
  //   }
  // };
  // const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // ----------------------
  // Submit Handler
  // ----------------------
  const handleUnifiedSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // (Perform validations for contact and dossier fields here)
    // If validations fail, update the error states and return early.

    setIsSubmitting(true);

    try {
      const contactPayload: ContactPayload = {
        ...contact,
        role: "Client / Customer (Client Portal)",
        maprNumero: dossier.informationAides.numeroDossierMPR,
        mpremail: dossier.informationAides.mpremail,
        mprpassword: dossier.informationAides.mprpassword,
        climateZone: dossier.informationAides.zoneClimatique,
        rfr: dossier.informationAides.rfr,
        eligible: dossier.informationAides.eligible,
        contactId: createdContactId || contact.contactId, // use the existing id
      };

      const formData = new FormData();
      Object.entries(contactPayload).forEach(([key, value]) => {
        if (key === "imageUrl" && value) formData.append(key, value as File);
        else if (key === "comments") formData.append(key, JSON.stringify(value));
        else formData.append(key, value as string | Blob);
      });

      // Update contact via API
      await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        body: formData,
      });

      const dossierPayload = {
        contactId: createdContactId || contact.contactId,
        numero: contact.numeroDossier,
        assignedTeam: contact.gestionnaireSuivi,
        projet: dossier.informationLogement.systemeChauffage,
        surfaceChauffee: dossier.informationLogement.surfaceHabitable,
        typeCompteurElectrique: dossier.informationLogement.typeCompteurElectrique,
        solution: dossier.informationLogement.projetPropose.join(", "),
        anneeConstruction: dossier.informationLogement.anneeConstruction,
        typeDeLogement: dossier.informationLogement.typeLogement,
        profil: dossier.informationLogement.profileLogement,
        nombrePersonne: dossier.informationAides.nombrePersonne,
        codePostal: dossier.informationAides.codePostale,
        mprColor: dossier.informationAides.mprColor,
        etape: dossier.phaseProjet,
        typeTravaux: dossier.typeTravaux,
      };

      // Update dossier via API
      await fetch(`/api/dossiers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dossierPayload),
      });

      // (Optionally update comments as needed)
      setIsSubmitting(false);
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  // Navigation for tab buttons
  const currentTabIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1)
      setActiveTab(tabs[currentTabIndex + 1].key);
  };
  const goToPreviousTab = () => {
    if (currentTabIndex > 0)
      setActiveTab(tabs[currentTabIndex - 1].key);
  };

  const projetSelectValue = projetOptions.filter((option) =>
    (dossier.informationLogement?.projetPropose || []).includes(option.value)
  );

  // const selectedOptions = chauffageOptions.filter((option) =>
  //   (dossier.informationLogement?.systemeChauffage || []).includes(option.value)
  // );  

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        // Fetch the dossier data from your API
        const resDossier = await fetch(`/api/dossiers/${id}`);
        if (!resDossier.ok) throw new Error("Failed to fetch dossier data");
        const fetchedDossier = await resDossier.json();
  
        // Map the API data to your expected state structure
        setDossier({
          informationLogement: {
            systemeChauffage: fetchedDossier.projet || [],
            surfaceHabitable: fetchedDossier.surfaceChauffee || "",
            typeCompteurElectrique: fetchedDossier.typeCompteurElectrique || "",
            // Assuming the "solution" field is a comma-separated string
            projetPropose: fetchedDossier.solution
              ? fetchedDossier.solution.split(",").map((s: string) => s.trim())
              : [],
            anneeConstruction: fetchedDossier.anneeConstruction || "",
            // Map the flat API fields to your nested state
            typeLogement: fetchedDossier.typeDeLogement || "",
            profileLogement: fetchedDossier.profil || "",
          },
          informationAides: {
            numeroDossierMPR: "",
            nombrePersonne: fetchedDossier.nombrePersonne || "",
            codePostale: fetchedDossier.codePostal || "",
            zoneClimatique: "", // Derive this if needed
            rfr: "",
            mprColor: fetchedDossier.mprColor || "",
            compteMPRExistant: false,
            mpremail: "",
            mprpassword: "",
            eligible: false,
          },
          phaseProjet: fetchedDossier.etape || "",
          typeTravaux: fetchedDossier.typeTravaux || "",
          contactId: fetchedDossier.contactId || "",
          numero: fetchedDossier.numero || "",
        });
  
        // Now fetch the associated contact data using the dossier's contactId
        if (fetchedDossier.contactId) {
          const resContact = await fetch(`/api/contacts/${fetchedDossier.contactId}`);
          if (!resContact.ok) throw new Error("Failed to fetch contact data");
          const fetchedContact = await resContact.json();
          setContact(fetchedContact);
          setCreatedContactId(fetchedContact.contactId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [id]);
  

  useEffect(() => {
    // Only fetch comments if we have a dossier.numero value
    if (dossier.numero) {
      async function fetchComments() {
        try {
          const res = await fetch(`/api/commentaires?linkedTo=${encodeURIComponent(dossier.numero)}`);
          if (!res.ok) throw new Error("Failed to fetch comments");
          const data: CommentAPI[] = await res.json();

          // Map API data to local Comment structure
          const mappedComments: Comment[] = data.map((c) => ({
            text: c.commentaire,
            timestamp: c.date,
          }));
          setComments(mappedComments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
      fetchComments();
    }
  }, [dossier.numero]);
  

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <header className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold text-gray-800"
            >
              Modifier un client
            </motion.h1>
          </header>
          <div className="mb-6">
            <div className="flex space-x-8 relative border-b border-gray-300">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="relative pb-2 text-lg font-semibold transition-colors duration-200 ease-in-out text-gray-600 hover:text-indigo-600 focus:outline-none"
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-1 bg-indigo-600 rounded"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleUnifiedSubmit} noValidate>
            <AnimatePresence>
              {/* INFORMATION CLIENT TAB */}
              {activeTab === "client" && (
                <motion.div
                  key="client"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-lg shadow-lg mb-8"
                >
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Nom
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={contact.lastName}
                          onChange={(e) =>
                            setContact({ ...contact, lastName: e.target.value })
                          }
                          onBlur={(e) => handleContactBlur("lastName", e.target.value)}
                          placeholder="Entrez le nom"
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {contactErrors.lastName && (
                          <p className="mt-1 text-xs text-red-500">{contactErrors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={contact.firstName}
                          onChange={(e) =>
                            setContact({ ...contact, firstName: e.target.value })
                          }
                          onBlur={(e) => handleContactBlur("firstName", e.target.value)}
                          placeholder="Entrez le prénom"
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {contactErrors.firstName && (
                          <p className="mt-1 text-xs text-red-500">{contactErrors.firstName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        value={contact.dateOfBirth}
                        onChange={(e) =>
                          setContact({ ...contact, dateOfBirth: e.target.value })
                        }
                        onBlur={(e) => handleContactBlur("dateOfBirth", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {contactErrors.dateOfBirth && (
                        <p className="mt-1 text-xs text-red-500">{contactErrors.dateOfBirth}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700">
                        Adresse
                      </label>
                      <input
                        type="text"
                        id="mailingAddress"
                        value={contact.mailingAddress}
                        onChange={handleAddressChange}
                        placeholder="Entrez l'adresse"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {addressSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                          {addressSuggestions.map((suggestion) => (
                            <li
                              key={suggestion.properties.id || suggestion.properties.label}
                              onClick={() => selectAddressSuggestion(suggestion)}
                              className="cursor-pointer px-3 py-2 hover:bg-indigo-100"
                            >
                              {suggestion.properties.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={contact.phone}
                        onChange={(e) =>
                          setContact({ ...contact, phone: e.target.value })
                        }
                        onBlur={(e) => handleContactBlur("phone", e.target.value)}
                        placeholder="Entrez le numéro de téléphone"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {contactErrors.phone && (
                        <p className="mt-1 text-xs text-red-500">{contactErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={contact.email}
                        onChange={(e) =>
                          setContact({ ...contact, email: e.target.value })
                        }
                        onBlur={(e) => handleContactBlur("email", e.target.value)}
                        placeholder="Entrez l'email"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {contactErrors.email && (
                        <p className="mt-1 text-xs text-red-500">{contactErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="numeroDossier" className="block text-sm font-medium text-gray-700">
                        Numéro de dossier
                      </label>
                      <input
                        type="text"
                        id="numeroDossier"
                        value={contact.numeroDossier}
                        readOnly
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Département
                      </label>
                      <input
                        type="text"
                        id="department"
                        value={contact.department}
                        readOnly
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="contactId" className="block text-sm font-medium text-gray-700">
                        Contact ID
                      </label>
                      <input
                        type="text"
                        id="contactId"
                        value={createdContactId}
                        readOnly
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="gestionnaireSuivi" className="block text-sm font-medium text-gray-700">
                        Gestionnaire de suivi
                      </label>
                      <select
                        id="gestionnaireSuivi"
                        value={contact.gestionnaireSuivi}
                        onChange={(e) =>
                          setContact({ ...contact, gestionnaireSuivi: e.target.value })
                        }
                        onBlur={(e) => handleContactBlur("gestionnaireSuivi", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Sélectionnez un gestionnaire</option>
                        {users.map((user) => {
                          const name =
                            user.firstName || user.lastName
                              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                              : user.email;
                          return (
                            <option key={user._id} value={user._id}>
                              {name} {user.role ? `(${user.role})` : ""}
                            </option>
                          );
                        })}
                      </select>
                      {contactErrors.gestionnaireSuivi && (
                        <p className="mt-1 text-xs text-red-500">{contactErrors.gestionnaireSuivi}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Commentaires</label>
                      <div className="border border-gray-300 rounded-lg p-4 h-40 overflow-y-auto bg-blue-50">
                        {comments.map((comment, index) => (
                          <div key={index} className="mb-2">
                            <div className="bg-white rounded-lg p-2 shadow-sm">
                              <p className="text-sm text-gray-800">{comment.text}</p>
                              <span className="block text-xs text-gray-500 text-right">{comment.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          className="flex-1 rounded-l-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Button type="button" variant="primary" onClick={addComment}>
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* INFORMATION DE L'HABITATION TAB */}
              {activeTab === "habitation" && (
                <motion.div
                  key="habitation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-lg shadow-lg mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="typeLogement" className="block text-sm font-medium text-gray-700">
                      Type de logement
                    </label>
                    <select
                      id="typeLogement"
                      value={dossier.informationLogement?.typeLogement || ""}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationLogement: {
                            ...dossier.informationLogement,
                            typeLogement: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionnez</option>
                      {typeLogementOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {dossierErrors["informationLogement.typeLogement"] && (
                      <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.typeLogement"]}</p>
                    )}
                  </div>

                  {/* Profil Field */}
                  <div>
                    <label htmlFor="profileLogement" className="block text-sm font-medium text-gray-700">
                      Profil
                    </label>
                    <select
                      id="profileLogement"
                      value={dossier.informationLogement?.profileLogement || ""}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationLogement: {
                            ...dossier.informationLogement,
                            profileLogement: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionnez</option>
                      {profileLogementOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {dossierErrors["informationLogement.profileLogement"] && (
                      <p className="mt-1 text-xs text-red-500">
                        {dossierErrors["informationLogement.profileLogement"]}
                      </p>
                    )}
                  </div>

                  {/* Système de chauffage Field */}
                  <div>
                    <label htmlFor="systemeChauffage" className="block text-sm font-medium text-gray-700">
                      Système de chauffage
                    </label>
                    <Select
                      id="systemeChauffage"
                      isMulti
                      options={chauffageOptions}
                      value={chauffageOptions.filter((option) => {
                        // Treat the current value as an array
                        const currentValues = Array.isArray(dossier.informationLogement?.systemeChauffage)
                          ? dossier.informationLogement.systemeChauffage
                          : dossier.informationLogement?.systemeChauffage
                            ? [dossier.informationLogement.systemeChauffage]
                            : [];
                        return currentValues.includes(option.value);
                      })}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                        setDossier({
                          ...dossier,
                          informationLogement: {
                            ...dossier.informationLogement,
                            systemeChauffage: values,
                          },
                        });
                      }}
                      placeholder="Sélectionnez..."
                      className="mt-1"
                    />
                    {dossierErrors["informationLogement.systemeChauffage"] && (
                      <p className="mt-1 text-xs text-red-500">
                        {dossierErrors["informationLogement.systemeChauffage"]}
                      </p>
                    )}
                  </div>


                    <div>
                      <label htmlFor="surfaceHabitable" className="block text-sm font-medium text-gray-700">
                        Surface habitable (m²)
                      </label>
                      <input
                        type="number"
                        id="surfaceHabitable"
                        value={dossier.informationLogement?.surfaceHabitable || ""}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationLogement: { ...dossier.informationLogement, surfaceHabitable: e.target.value },
                          })
                        }
                        placeholder="Ex: 180"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {dossierErrors["informationLogement.surfaceHabitable"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.surfaceHabitable"]}</p>
                      )}
                    </div>

                    {/* Type de compteur électrique Field */}
                    <div>
                      <label htmlFor="typeCompteurElectrique" className="block text-sm font-medium text-gray-700">
                        Type de compteur électrique
                      </label>
                      <select
                        id="typeCompteurElectrique"
                        value={dossier.informationLogement?.typeCompteurElectrique || ""}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationLogement: {
                              ...dossier.informationLogement,
                              typeCompteurElectrique: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="Monophasé">Monophasé</option>
                        <option value="Triphasé">Triphasé</option>
                      </select>
                      {dossierErrors["informationLogement.typeCompteurElectrique"] && (
                        <p className="mt-1 text-xs text-red-500">
                          {dossierErrors["informationLogement.typeCompteurElectrique"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="anneeConstruction" className="block text-sm font-medium text-gray-700">
                        Année de construction
                      </label>
                      <input
                        type="number"
                        id="anneeConstruction"
                        value={dossier.informationLogement?.anneeConstruction || ""}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationLogement: {
                              ...dossier.informationLogement,
                              anneeConstruction: e.target.value,
                            },
                          })
                        }
                        placeholder="Ex: 1998"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      {dossierErrors["informationLogement.anneeConstruction"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.anneeConstruction"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="projetPropose" className="block text-sm font-medium text-gray-700">
                        Projet proposé
                      </label>
                      <Select
                        isMulti
                        options={projetOptions}
                        value={projetSelectValue || ""}
                        onChange={(
                          selectedOptions: MultiValue<{ value: string; label: string }>
                        ) => {
                          const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                          setDossier({
                            ...dossier,
                            informationLogement: {
                              ...dossier.informationLogement,
                              projetPropose: values,
                            },
                          });
                        }}
                        placeholder="Sélectionnez..."
                        className="mt-1"
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            borderRadius: "0.375rem",
                            borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
                            boxShadow: state.isFocused ? "0 0 0 2px rgba(37, 99, 235, 0.25)" : provided.boxShadow,
                            "&:hover": {
                              borderColor: "#2563eb",
                            },
                            padding: 4,
                            minHeight: "auto",
                          }),
                          valueContainer: (provided) => ({
                            ...provided,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "6px 8px",
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "#3b82f6",
                            borderRadius: "0.375rem",
                            alignSelf: "flex-start",
                            marginBottom: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }),
                          multiValueLabel: (provided) => ({
                            ...provided,
                            color: "white",
                            padding: "4px 8px",
                            fontSize: "0.875rem",
                          }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color: "white",
                            padding: "4px",
                            cursor: "pointer",
                            ":hover": {
                              backgroundColor: "#2563eb",
                              color: "white",
                            },
                          }),
                          menu: (provided) => ({
                            ...provided,
                            borderRadius: "0.375rem",
                            marginTop: 4,
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? "#ebf8ff" : "white",
                            color: state.isFocused ? "#2563eb" : "#111827",
                            cursor: "pointer",
                            padding: "8px 12px",
                          }),
                          indicatorsContainer: (provided) => ({
                            ...provided,
                            display: "none",
                          }),
                        }}
                      />
                      {dossierErrors["informationLogement.projetPropose"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.projetPropose"]}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* INFORMATION DES AIDES TAB */}
              {activeTab === "aides" && (
                <motion.div
                  key="aides"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-lg shadow-lg mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="numeroDossierMPR" className="block text-sm font-medium text-gray-700">
                        Numéro de dossier MPR
                      </label>
                      <input
                        type="text"
                        id="numeroDossierMPR"
                        value={contact.maprNumero || ""}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationAides: {
                              ...dossier.informationAides,
                              numeroDossierMPR: e.target.value,
                            },
                          })
                        }
                        placeholder="Entrez le numéro MPR"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      {dossierErrors["informationAides.numeroDossierMPR"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.numeroDossierMPR"]}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="compteMPRExistant"
                        checked={dossier.informationAides.compteMPRExistant}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationAides: {
                              ...dossier.informationAides,
                              compteMPRExistant: e.target.checked,
                            },
                          })
                        }
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="compteMPRExistant" className="text-sm font-medium text-gray-700">
                        Compte MPR existant ?
                      </label>
                    </div>
                    {dossier.informationAides.compteMPRExistant && (
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="mpremail" className="block text-sm font-medium text-gray-700">
                            Accès Ma Prime Renov - Email
                          </label>
                          <input
                            type="email"
                            id="mpremail"
                            value={contact.mpremail || ""}
                            onChange={(e) =>
                              setDossier({
                                ...dossier,
                                informationAides: {
                                  ...dossier.informationAides,
                                  mpremail: e.target.value,
                                },
                              })
                            }
                            placeholder="Entrez l'email d'accès"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {dossierErrors["informationAides.mpremail"] && (
                            <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.mpremail"]}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="mprpassword" className="block text-sm font-medium text-gray-700">
                            Accès Ma Prime Renov - Mot de passe
                          </label>
                          <input
                            type="password"
                            id="mprpassword"
                            value={contact.mprpassword || ""}
                            onChange={(e) =>
                              setDossier({
                                ...dossier,
                                informationAides: {
                                  ...dossier.informationAides,
                                  mprpassword: e.target.value,
                                },
                              })
                            }
                            placeholder="Entrez le mot de passe"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {dossierErrors["informationAides.mprpassword"] && (
                            <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.mprpassword"]}</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <label htmlFor="nombrePersonne" className="block text-sm font-medium text-gray-700">
                        Nombre de personne
                      </label>
                      <input
                        type="number"
                        id="nombrePersonne"
                        value={dossier.informationAides.nombrePersonne || ""}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationAides: {
                              ...dossier.informationAides,
                              nombrePersonne: e.target.value,
                            },
                          })
                        }
                        placeholder="Ex: 4"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {dossierErrors["informationAides.nombrePersonne"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.nombrePersonne"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="codePostale" className="block text-sm font-medium text-gray-700">
                        Code postal
                      </label>
                      <input
                        type="text"
                        id="codePostale"
                        value={dossier.informationAides.codePostale || ""}
                        readOnly
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="zoneClimatique" className="block text-sm font-medium text-gray-700">
                        Zone
                      </label>
                      <input
                        type="text"
                        id="zoneClimatique"
                        value={contact.climateZone || ""}
                        readOnly
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2"
                      />
                      {dossierErrors["informationAides.zoneClimatique"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.zoneClimatique"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="rfr" className="block text-sm font-medium text-gray-700">
                        Revenue Fiscal de Référence
                      </label>
                      <input
                        type="text"
                        id="rfr"
                        value={contact.rfr || ""}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationAides: { ...dossier.informationAides, rfr: e.target.value },
                          })
                        }
                        placeholder="Entrez le RFR"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {dossierErrors["informationAides.rfr"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.rfr"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="mprColor" className="block text-sm font-medium text-gray-700">
                        Ma Prime Renov Couleur
                      </label>
                      <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2">
                        <span
                          className={`font-semibold ${
                            dossier.informationAides.mprColor === "vert"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {dossier.informationAides.mprColor}
                        </span>
                      </div>
                      {dossierErrors["informationAides.mprColor"] && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.mprColor"]}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Eligible :</span>
                      {contact.eligible ? (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                          Eligible
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
                          Non Eligible
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LE PROJET TAB */}
              {activeTab === "projet" && (
                <motion.div
                  key="projet"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-lg shadow-lg mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phaseProjet" className="block text-sm font-medium text-gray-700">
                        Phase du projet
                      </label>
                      <select
                        id="phaseProjet"
                        value={dossier.phaseProjet || ""}
                        onChange={(e) =>
                          setDossier({ ...dossier, phaseProjet: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Sélectionnez</option>
                        {phaseProjetOptions.map((option) => (
                          <option key={option.value} value={option.value || ""}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {dossierErrors.phaseProjet && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors.phaseProjet}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="typeTravaux" className="block text-sm font-medium text-gray-700">
                        Type de travaux
                      </label>
                      <select
                        id="typeTravaux"
                        value={dossier.typeTravaux || ""}
                        onChange={(e) =>
                          setDossier({ ...dossier, typeTravaux: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Sélectionnez</option>
                        {travauxOptions.map((option) => (
                          <option key={option.value} value={option.value || ""}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {dossierErrors.typeTravaux && (
                        <p className="mt-1 text-xs text-red-500">{dossierErrors.typeTravaux}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-end space-x-4">
              {currentTabIndex > 0 && (
                <Button variant="outline" onClick={goToPreviousTab} disabled={isSubmitting}>
                  Précédent
                </Button>
              )}
              {activeTab !== "projet" ? (
                <Button variant="primary" onClick={goToNextTab} disabled={isSubmitting}>
                  Suivant
                </Button>
              ) : (
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    "Envoyer"
                  )}
                </Button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
