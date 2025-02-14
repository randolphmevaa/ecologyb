"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";

interface Contact {
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  titre: string;
  tags: string;
  suivi: boolean;
  emailOptedOut: boolean;
  homePhone: string;
  mobilePhone: string;
  otherPhone: string;
  assistantPhone: string;
  assistantName: string;
  fax: string;
  linkedIn: string;
  facebook: string;
  twitter: string;
  mailingAddress: string;
  otherAddress: string;
  dateToRemember: string;
  dateOfBirth: string;
  description: string;
  department: string;
  climateZone: string;
  heatingType: string;
  rfr: string;
  imageUrl: File | null;
  secteur: string;
  maprEmail: string;
  maprNumero: string;
  mprPassword: string;
}

interface Dossier {
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam: string;
  notes: string;
  informationLogement: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
  };
  informationTravaux: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
  contactId: string;
}

interface Team {
  id: string;
  name: string;
}

export default function AddContactDossierPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("contact");

  const [contact, setContact] = useState<Contact>({
    prefix: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    titre: "",
    tags: "",
    suivi: false,
    emailOptedOut: false,
    homePhone: "",
    mobilePhone: "",
    otherPhone: "",
    assistantPhone: "",
    assistantName: "",
    fax: "",
    linkedIn: "",
    facebook: "",
    twitter: "",
    mailingAddress: "",
    otherAddress: "",
    dateToRemember: "",
    dateOfBirth: "",
    description: "",
    department: "",
    climateZone: "",
    heatingType: "",
    rfr: "",
    imageUrl: null,
    secteur: "",
    maprEmail: "",
    maprNumero: "",
    mprPassword: "",
  });

  const [contactErrors, setContactErrors] = useState<
    Partial<Record<keyof Contact, string>>
  >({});

  const [dossier, setDossier] = useState<Dossier>({
    client: "",
    projet: "",
    solution: "",
    etape: "",
    valeur: "",
    assignedTeam: "",
    notes: "",
    informationLogement: {
      typeDeLogement: "",
      surfaceHabitable: "",
      anneeConstruction: "",
      systemeChauffage: "",
    },
    informationTravaux: {
      typeTravaux: "",
      typeUtilisation: "",
      surfaceChauffee: "",
      circuitChauffageFonctionnel: "",
    },
    contactId: "",
  });

  const [dossierErrors, setDossierErrors] = useState<
    Partial<Record<keyof Dossier, string>>
  >({});

  // ====================
  // CONTACT FORM STATE
  // ====================
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // ====================
  // DOSSIER FORM STATE
  // ====================
  const [dossierSubmitting, setDossierSubmitting] = useState(false);

  // ====================
  // FETCH TEAMS FOR ASSIGNED TEAM DROPDOWN
  // ====================
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/users");
        const data: Team[] = await res.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
    fetchTeams();
  }, []);

  // ====================
  // CLOSE PAGE ON ESCAPE
  // ====================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // ====================
  // VALIDATION FUNCTIONS
  // ====================
  const validateContactField = (
    field: keyof Contact,
    value: Contact[typeof field]
  ): string => {
    const optionalFields: (keyof Contact)[] = [
      "assistantName",
      "fax",
      "twitter",
      "otherAddress",
      "imageUrl",
    ];
    if (!value && !optionalFields.includes(field)) {
      return "Ce champ est requis";
    }
    if (
      field === "email" &&
      value &&
      typeof value === "string" &&
      !/^\S+@\S+\.\S+$/.test(value)
    ) {
      return "Veuillez entrer un email valide";
    }
    return "";
  };

  const handleContactBlur = (field: keyof Contact, value: Contact[typeof field]) => {
    const error = validateContactField(field, value);
    setContactErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateDossierField = (
    field: keyof Dossier,
    value: Dossier[typeof field]
  ): string => {
    if (!value) {
      return "Ce champ est requis";
    }
    return "";
  };

  const handleDossierBlur = (field: keyof Dossier, value: Dossier[typeof field]) => {
    const error = validateDossierField(field, value);
    setDossierErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ====================
  // IMAGE UPLOAD (DRAG & DROP)
  // ====================
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setContact({ ...contact, imageUrl: e.dataTransfer.files[0] });
    }
  };
  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // ====================
  // SUBMIT HANDLERS
  // ====================
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required contact fields
    const fieldsToValidate: (keyof Contact)[] = [
      "prefix",
      "firstName",
      "lastName",
      "email",
      "phone",
      "role",
      "titre",
      "tags",
      "mailingAddress",
    ];
    const newErrors: Partial<Record<keyof Contact, string>> = {};
    fieldsToValidate.forEach((field) => {
      const error = validateContactField(field, contact[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setContactErrors(newErrors);
      return;
    }

    setContactSubmitting(true);

    // Prepare FormData so we can handle file uploads (if an image was provided)
    const formData = new FormData();
    Object.entries(contact).forEach(([key, value]) => {
      if (key === "tags") {
        // Convert comma-separated tags into an array
        formData.append(key, JSON.stringify((value as string).split(",").map((t: string) => t.trim())));
      } else if (key === "imageUrl" && value) {
        formData.append(key, value as File);
      } else {
        formData.append(key, value as string | Blob);
      }
    });

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Contact created:", data);
      setContactSubmitting(false);
      router.back();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setContactSubmitting(false);
    }
  };

  const handleDossierSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required dossier fields
    const fieldsToValidate: (keyof Dossier)[] = [
      "client",
      "projet",
      "solution",
      "etape",
      "valeur",
      "assignedTeam",
    ];
    const newErrors: Partial<Record<keyof Dossier, string>> = {};
    fieldsToValidate.forEach((field) => {
      const error = validateDossierField(field, dossier[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setDossierErrors(newErrors);
      return;
    }

    setDossierSubmitting(true);
    try {
      const response = await fetch("/api/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dossier),
      });
      const data = await response.json();
      console.log("Dossier created:", data);
      setDossierSubmitting(false);
      router.back();
    } catch (error) {
      console.error("Error submitting dossier form:", error);
      setDossierSubmitting(false);
    }
  };

  // ====================
  // RENDER
  // ====================
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar (currently a placeholder; add content as needed) */}
      <motion.div
        className="relative border-r border-[#bfddf9]/30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar content can be added here */}
      </motion.div>

      {/* Main container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />

        <main className="flex-1 overflow-y-auto p-8 space-y-10 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">

        {/* Page Title */}
        <header className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl lg:text-4xl font-extrabold text-[#1a365d]"
            >
              Ajouter un client
            </motion.h1>
          </header>

          {/* Wrap main content in a grid */}
          <div className="">
          <motion.div
            className="flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-full">
              {/* Tab Navigation */}
              <div className="mb-6 flex space-x-4 border-b">
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`pb-2 ${
                    activeTab === "contact"
                      ? "border-b-2 border-indigo-500 text-indigo-500"
                      : "text-gray-500"
                  }`}
                >
                  Contact
                </button>
                <button
                  onClick={() => setActiveTab("dossier")}
                  className={`pb-2 ${
                    activeTab === "dossier"
                      ? "border-b-2 border-indigo-500 text-indigo-500"
                      : "text-gray-500"
                  }`}
                >
                  Dossier
                </button>
              </div>

              {activeTab === "contact" ? (
                <form onSubmit={handleContactSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prefix */}
                    <div>
                      <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">
                        Préfixe
                      </label>
                      <select
                        id="prefix"
                        value={contact.prefix}
                        onChange={(e) =>
                          setContact({ ...contact, prefix: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("prefix", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="Mr">Mr</option>
                        <option value="Mme">Mme</option>
                        <option value="Mlle">Mlle</option>
                      </select>
                      {contactErrors.prefix && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.prefix}</p>
                      )}
                    </div>
                    {/* First Name */}
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
                        onBlur={(e) =>
                          handleContactBlur("firstName", e.target.value)
                        }
                        placeholder="Entrez le prénom"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {contactErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.firstName}</p>
                      )}
                    </div>
                    {/* Last Name */}
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
                        onBlur={(e) =>
                          handleContactBlur("lastName", e.target.value)
                        }
                        placeholder="Entrez le nom"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {contactErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.lastName}</p>
                      )}
                    </div>
                    {/* Email */}
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
                        onBlur={(e) =>
                          handleContactBlur("email", e.target.value)
                        }
                        placeholder="Entrez l'email"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {contactErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.email}</p>
                      )}
                    </div>
                    {/* Phone */}
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
                        onBlur={(e) =>
                          handleContactBlur("phone", e.target.value)
                        }
                        placeholder="Entrez le numéro de téléphone"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {contactErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.phone}</p>
                      )}
                    </div>
                    {/* Role */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rôle
                      </label>
                      <select
                        id="role"
                        value={contact.role}
                        onChange={(e) =>
                          setContact({ ...contact, role: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("role", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      >
                        <option value="">Sélectionnez un rôle</option>
                        <option value="Sales Representative / Account Executive">
                          Représentant commercial / Chargé de compte
                        </option>
                        <option value="Project / Installation Manager">
                          Chef de projet / Responsable installation
                        </option>
                        <option value="Technician / Installer">Technicien / Installateur</option>
                        <option value="Customer Support / Service Representative">
                          Support client / Représentant du service
                        </option>
                        <option value="Client / Customer (Client Portal)">Client (portail client)</option>
                        <option value="Super Admin">Super administrateur</option>
                      </select>
                      {contactErrors.role && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.role}</p>
                      )}
                    </div>
                    {/* Titre */}
                    <div>
                      <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
                        Titre
                      </label>
                      <input
                        type="text"
                        id="titre"
                        value={contact.titre}
                        onChange={(e) =>
                          setContact({ ...contact, titre: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("titre", e.target.value)
                        }
                        placeholder="Entrez le titre"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {contactErrors.titre && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.titre}</p>
                      )}
                    </div>
                    {/* Tags */}
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags (séparés par des virgules)
                      </label>
                      <input
                        type="text"
                        id="tags"
                        value={contact.tags}
                        onChange={(e) =>
                          setContact({ ...contact, tags: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("tags", e.target.value)
                        }
                        placeholder="Conseil, Stratégie"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {contactErrors.tags && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.tags}</p>
                      )}
                    </div>
                    {/* Suivi */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="suivi"
                        checked={contact.suivi}
                        onChange={(e) =>
                          setContact({ ...contact, suivi: e.target.checked })
                        }
                      />
                      <label htmlFor="suivi" className="text-sm text-gray-700">
                        Suivi
                      </label>
                    </div>
                    {/* Email Opted Out */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emailOptedOut"
                        checked={contact.emailOptedOut}
                        onChange={(e) =>
                          setContact({ ...contact, emailOptedOut: e.target.checked })
                        }
                      />
                      <label htmlFor="emailOptedOut" className="text-sm text-gray-700">
                        Email Opted Out
                      </label>
                    </div>
                    {/* Home Phone */}
                    <div>
                      <label htmlFor="homePhone" className="block text-sm font-medium text-gray-700">
                        Téléphone domicile
                      </label>
                      <input
                        type="text"
                        id="homePhone"
                        value={contact.homePhone}
                        onChange={(e) =>
                          setContact({ ...contact, homePhone: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("homePhone", e.target.value)
                        }
                        placeholder="Entrez le téléphone domicile"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Mobile Phone */}
                    <div>
                      <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <input
                        type="text"
                        id="mobilePhone"
                        value={contact.mobilePhone}
                        onChange={(e) =>
                          setContact({ ...contact, mobilePhone: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("mobilePhone", e.target.value)
                        }
                        placeholder="Entrez le mobile"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Other Phone */}
                    <div>
                      <label htmlFor="otherPhone" className="block text-sm font-medium text-gray-700">
                        Autre téléphone
                      </label>
                      <input
                        type="text"
                        id="otherPhone"
                        value={contact.otherPhone}
                        onChange={(e) =>
                          setContact({ ...contact, otherPhone: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("otherPhone", e.target.value)
                        }
                        placeholder="Entrez un autre téléphone"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Assistant Phone */}
                    <div>
                      <label htmlFor="assistantPhone" className="block text-sm font-medium text-gray-700">
                        Téléphone assistant
                      </label>
                      <input
                        type="text"
                        id="assistantPhone"
                        value={contact.assistantPhone}
                        onChange={(e) =>
                          setContact({ ...contact, assistantPhone: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("assistantPhone", e.target.value)
                        }
                        placeholder="Entrez le téléphone de l'assistant"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Assistant Name */}
                    <div>
                      <label htmlFor="assistantName" className="block text-sm font-medium text-gray-700">
                        Nom de l&apos;assistant
                      </label>
                      <input
                        type="text"
                        id="assistantName"
                        value={contact.assistantName}
                        onChange={(e) =>
                          setContact({ ...contact, assistantName: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("assistantName", e.target.value)
                        }
                        placeholder="Entrez le nom de l'assistant"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Fax */}
                    <div>
                      <label htmlFor="fax" className="block text-sm font-medium text-gray-700">
                        Fax
                      </label>
                      <input
                        type="text"
                        id="fax"
                        value={contact.fax}
                        onChange={(e) =>
                          setContact({ ...contact, fax: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("fax", e.target.value)
                        }
                        placeholder="Entrez le fax"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* LinkedIn */}
                    <div>
                      <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        id="linkedIn"
                        value={contact.linkedIn}
                        onChange={(e) =>
                          setContact({ ...contact, linkedIn: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("linkedIn", e.target.value)
                        }
                        placeholder="linkedin.com/in/..."
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Facebook */}
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <input
                        type="text"
                        id="facebook"
                        value={contact.facebook}
                        onChange={(e) =>
                          setContact({ ...contact, facebook: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("facebook", e.target.value)
                        }
                        placeholder="facebook.com/..."
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Twitter */}
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                        Twitter
                      </label>
                      <input
                        type="text"
                        id="twitter"
                        value={contact.twitter}
                        onChange={(e) =>
                          setContact({ ...contact, twitter: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("twitter", e.target.value)
                        }
                        placeholder="twitter.com/..."
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Mailing Address */}
                    <div>
                      <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700">
                        Adresse postale
                      </label>
                      <input
                        type="text"
                        id="mailingAddress"
                        value={contact.mailingAddress}
                        onChange={(e) =>
                          setContact({ ...contact, mailingAddress: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("mailingAddress", e.target.value)
                        }
                        placeholder="Entrez l'adresse postale"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {contactErrors.mailingAddress && (
                        <p className="text-red-500 text-xs mt-1">{contactErrors.mailingAddress}</p>
                      )}
                    </div>
                    {/* Other Address */}
                    <div>
                      <label htmlFor="otherAddress" className="block text-sm font-medium text-gray-700">
                        Autre adresse
                      </label>
                      <input
                        type="text"
                        id="otherAddress"
                        value={contact.otherAddress}
                        onChange={(e) =>
                          setContact({ ...contact, otherAddress: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("otherAddress", e.target.value)
                        }
                        placeholder="Entrez une autre adresse"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Date to Remember */}
                    <div>
                      <label htmlFor="dateToRemember" className="block text-sm font-medium text-gray-700">
                        Date à retenir
                      </label>
                      <input
                        type="date"
                        id="dateToRemember"
                        value={contact.dateToRemember}
                        onChange={(e) =>
                          setContact({ ...contact, dateToRemember: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("dateToRemember", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Date of Birth */}
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
                        onBlur={(e) =>
                          handleContactBlur("dateOfBirth", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={contact.description}
                        onChange={(e) =>
                          setContact({ ...contact, description: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("description", e.target.value)
                        }
                        placeholder="Entrez la description"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Department */}
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Département
                      </label>
                      <input
                        type="text"
                        id="department"
                        value={contact.department}
                        onChange={(e) =>
                          setContact({ ...contact, department: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("department", e.target.value)
                        }
                        placeholder="Entrez le département"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Climate Zone */}
                    <div>
                      <label htmlFor="climateZone" className="block text-sm font-medium text-gray-700">
                        Zone climatique
                      </label>
                      <input
                        type="text"
                        id="climateZone"
                        value={contact.climateZone}
                        onChange={(e) =>
                          setContact({ ...contact, climateZone: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("climateZone", e.target.value)
                        }
                        placeholder="Entrez la zone climatique"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Heating Type */}
                    <div>
                      <label htmlFor="heatingType" className="block text-sm font-medium text-gray-700">
                        Type de chauffage
                      </label>
                      <input
                        type="text"
                        id="heatingType"
                        value={contact.heatingType}
                        onChange={(e) =>
                          setContact({ ...contact, heatingType: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("heatingType", e.target.value)
                        }
                        placeholder="Entrez le type de chauffage"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* RFR */}
                    <div>
                      <label htmlFor="rfr" className="block text-sm font-medium text-gray-700">
                        RFR
                      </label>
                      <input
                        type="text"
                        id="rfr"
                        value={contact.rfr}
                        onChange={(e) =>
                          setContact({ ...contact, rfr: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("rfr", e.target.value)
                        }
                        placeholder="Entrez le RFR"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* Image Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Image (facultatif)</label>
                      <div
                        onDrop={handleImageDrop}
                        onDragOver={handleImageDragOver}
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                        className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-md cursor-pointer"
                      >
                        {contact.imageUrl ? (
                          <p>{contact.imageUrl.name}</p>
                        ) : (
                          <p>Glissez-déposez une image ou cliquez pour sélectionner</p>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setContact({ ...contact, imageUrl: e.target.files[0] });
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                    {/* Secteur */}
                    <div>
                      <label htmlFor="secteur" className="block text-sm font-medium text-gray-700">
                        Secteur
                      </label>
                      <input
                        type="text"
                        id="secteur"
                        value={contact.secteur}
                        onChange={(e) =>
                          setContact({ ...contact, secteur: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("secteur", e.target.value)
                        }
                        placeholder="Entrez le secteur"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* MAPR Email */}
                    <div>
                      <label htmlFor="maprEmail" className="block text-sm font-medium text-gray-700">
                        MAPR Email
                      </label>
                      <input
                        type="text"
                        id="maprEmail"
                        value={contact.maprEmail}
                        onChange={(e) =>
                          setContact({ ...contact, maprEmail: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("maprEmail", e.target.value)
                        }
                        placeholder="Entrez le MAPR Email"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* MAPR Numero */}
                    <div>
                      <label htmlFor="maprNumero" className="block text-sm font-medium text-gray-700">
                        MAPR Numero
                      </label>
                      <input
                        type="text"
                        id="maprNumero"
                        value={contact.maprNumero}
                        onChange={(e) =>
                          setContact({ ...contact, maprNumero: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("maprNumero", e.target.value)
                        }
                        placeholder="Entrez le MAPR Numero"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                    {/* MPR Password */}
                    <div>
                      <label htmlFor="mprPassword" className="block text-sm font-medium text-gray-700">
                        MPR Password
                      </label>
                      <input
                        type="text"
                        id="mprPassword"
                        value={contact.mprPassword}
                        onChange={(e) =>
                          setContact({ ...contact, mprPassword: e.target.value })
                        }
                        onBlur={(e) =>
                          handleContactBlur("mprPassword", e.target.value)
                        }
                        placeholder="Entrez le MPR Password"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => router.back()} disabled={contactSubmitting}>
                      Annuler
                    </Button>
                    <Button type="submit" variant="primary" disabled={contactSubmitting}>
                      {contactSubmitting ? (
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
                        "Ajouter Contact"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleDossierSubmit} noValidate>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Client */}
                    <div>
                      <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                        Client
                      </label>
                      <input
                        type="text"
                        id="client"
                        value={dossier.client}
                        onChange={(e) =>
                          setDossier({ ...dossier, client: e.target.value })
                        }
                        onBlur={(e) =>
                          handleDossierBlur("client", e.target.value)
                        }
                        placeholder="Nom du client"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {dossierErrors.client && (
                        <p className="text-red-500 text-xs mt-1">{dossierErrors.client}</p>
                      )}
                    </div>
                    {/* Projet */}
                    <div>
                      <label htmlFor="projet" className="block text-sm font-medium text-gray-700">
                        Projet
                      </label>
                      <input
                        type="text"
                        id="projet"
                        value={dossier.projet}
                        onChange={(e) =>
                          setDossier({ ...dossier, projet: e.target.value })
                        }
                        onBlur={(e) =>
                          handleDossierBlur("projet", e.target.value)
                        }
                        placeholder="Nom du projet"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {dossierErrors.projet && (
                        <p className="text-red-500 text-xs mt-1">{dossierErrors.projet}</p>
                      )}
                    </div>
                    {/* Solution */}
                    <div>
                      <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                        Solution
                      </label>
                      <select
                        id="solution"
                        value={dossier.solution}
                        onChange={(e) =>
                          setDossier({ ...dossier, solution: e.target.value })
                        }
                        onBlur={(e) =>
                          handleDossierBlur("solution", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      >
                        <option value="">Sélectionnez une solution</option>
                        <option value="Pompes a chaleur">Pompes a chaleur</option>
                        <option value="Chauffe-eau solaire individuel">Chauffe-eau solaire individuel</option>
                        <option value="Chauffe-eau thermodynamique">Chauffe-eau thermodynamique</option>
                        <option value="Système Solaire Combiné">Système Solaire Combiné</option>
                      </select>
                      {dossierErrors.solution && (
                        <p className="text-red-500 text-xs mt-1">{dossierErrors.solution}</p>
                      )}
                    </div>
                    {/* Étape */}
                    <div>
                      <label htmlFor="etape" className="block text-sm font-medium text-gray-700">
                        Étape
                      </label>
                      <select
                        id="etape"
                        value={dossier.etape}
                        onChange={(e) =>
                          setDossier({ ...dossier, etape: e.target.value })
                        }
                        onBlur={(e) =>
                          handleDossierBlur("etape", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      >
                        <option value="">Sélectionnez une étape</option>
                        <option value="1Prise de contact">1 – Prise de contact</option>
                        <option value="2En attente des documents">2 – En attente des documents</option>
                        <option value="3Instruction du dossier">3 – Instruction du dossier</option>
                        <option value="4Dossier Accepter">4 – Dossier accepté</option>
                        <option value="5Installation">5 – Installation</option>
                        <option value="6Controle">6 – Contrôle</option>
                        <option value="7Dossier cloturer">7 – Dossier clôturé</option>
                      </select>
                      {dossierErrors.etape && (
                        <p className="text-red-500 text-xs mt-1">{dossierErrors.etape}</p>
                      )}
                    </div>
                    {/* Valeur */}
                    <div>
                      <label htmlFor="valeur" className="block text-sm font-medium text-gray-700">
                        Valeur
                      </label>
                      <input
                        type="number"
                        id="valeur"
                        value={dossier.valeur}
                        onChange={(e) =>
                          setDossier({ ...dossier, valeur: e.target.value })
                        }
                        onBlur={(e) =>
                          handleDossierBlur("valeur", e.target.value)
                        }
                        placeholder="Entrez la valeur"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {dossierErrors.valeur && (
                        <p className="text-red-500 text-xs mt-1">{dossierErrors.valeur}</p>
                      )}
                    </div>
                    {/* Assigned Team */}
                    <div>
                      <label htmlFor="assignedTeam" className="block text-sm font-medium text-gray-700">
                        Équipe assignée
                      </label>
                      <select
                        id="assignedTeam"
                        value={dossier.assignedTeam}
                        onChange={(e) =>
                          setDossier({ ...dossier, assignedTeam: e.target.value })
                        }
                        onBlur={(e) =>
                          handleDossierBlur("assignedTeam", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      >
                        <option value="">Sélectionnez une équipe</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      {dossierErrors.assignedTeam && (
                        <p className="text-red-500 text-xs mt-1">{dossierErrors.assignedTeam}</p>
                      )}
                    </div>
                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        value={dossier.notes}
                        onChange={(e) =>
                          setDossier({ ...dossier, notes: e.target.value })
                        }
                        onBlur={(e) =>
                          handleDossierBlur("notes", e.target.value)
                        }
                        placeholder="Entrez des notes"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                      />
                      {dossierErrors.notes && (
                        <p className="text-red-500 text-xs mt-1">{dossierErrors.notes}</p>
                      )}
                    </div>
                    {/* Information Logement */}
                    <fieldset className="border p-4">
                      <legend className="text-lg font-medium text-gray-700">Information Logement</legend>
                      {/* Type de Logement */}
                      <div>
                        <label htmlFor="typeDeLogement" className="block text-sm font-medium text-gray-700">
                          Type de Logement
                        </label>
                        <select
                          id="typeDeLogement"
                          value={dossier.informationLogement.typeDeLogement}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationLogement: { ...dossier.informationLogement, typeDeLogement: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        >
                          <option value="">Sélectionnez un type</option>
                          <option value="maison">Maison</option>
                          <option value="appartement">Appartement</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      {/* Surface Habitable */}
                      <div>
                        <label htmlFor="surfaceHabitable" className="block text-sm font-medium text-gray-700">
                          Surface Habitable
                        </label>
                        <input
                          type="number"
                          id="surfaceHabitable"
                          value={dossier.informationLogement.surfaceHabitable}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationLogement: { ...dossier.informationLogement, surfaceHabitable: e.target.value },
                            })
                          }
                          placeholder="Ex: 180"
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        />
                      </div>
                      {/* Année Construction */}
                      <div>
                        <label htmlFor="anneeConstruction" className="block text-sm font-medium text-gray-700">
                          Année de Construction
                        </label>
                        <input
                          type="number"
                          id="anneeConstruction"
                          value={dossier.informationLogement.anneeConstruction}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationLogement: { ...dossier.informationLogement, anneeConstruction: e.target.value },
                            })
                          }
                          placeholder="Ex: 1978"
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        />
                      </div>
                      {/* Système Chauffage */}
                      <div>
                        <label htmlFor="systemeChauffage" className="block text-sm font-medium text-gray-700">
                          Système de Chauffage
                        </label>
                        <input
                          type="text"
                          id="systemeChauffage"
                          value={dossier.informationLogement.systemeChauffage}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationLogement: { ...dossier.informationLogement, systemeChauffage: e.target.value },
                            })
                          }
                          placeholder="Entrez le système de chauffage"
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        />
                      </div>
                    </fieldset>
                    {/* Information Travaux */}
                    <fieldset className="border p-4">
                      <legend className="text-lg font-medium text-gray-700">Information Travaux</legend>
                      {/* Type Travaux */}
                      <div>
                        <label htmlFor="typeTravaux" className="block text-sm font-medium text-gray-700">
                          Type de Travaux
                        </label>
                        <input
                          type="text"
                          id="typeTravaux"
                          value={dossier.informationTravaux.typeTravaux}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationTravaux: { ...dossier.informationTravaux, typeTravaux: e.target.value },
                            })
                          }
                          placeholder="Entrez le type de travaux"
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        />
                      </div>
                      {/* Type Utilisation */}
                      <div>
                        <label htmlFor="typeUtilisation" className="block text-sm font-medium text-gray-700">
                          Type d&apos;Utilisation
                        </label>
                        <input
                          type="text"
                          id="typeUtilisation"
                          value={dossier.informationTravaux.typeUtilisation}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationTravaux: { ...dossier.informationTravaux, typeUtilisation: e.target.value },
                            })
                          }
                          placeholder="Entrez le type d'utilisation"
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        />
                      </div>
                      {/* Surface Chauffée */}
                      <div>
                        <label htmlFor="surfaceChauffee" className="block text-sm font-medium text-gray-700">
                          Surface Chauffée
                        </label>
                        <input
                          type="number"
                          id="surfaceChauffee"
                          value={dossier.informationTravaux.surfaceChauffee}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationTravaux: { ...dossier.informationTravaux, surfaceChauffee: e.target.value },
                            })
                          }
                          placeholder="Ex: 180"
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        />
                      </div>
                      {/* Circuit Chauffage Fonctionnel */}
                      <div>
                        <label htmlFor="circuitChauffageFonctionnel" className="block text-sm font-medium text-gray-700">
                          Circuit Chauffage Fonctionnel
                        </label>
                        <select
                          id="circuitChauffageFonctionnel"
                          value={dossier.informationTravaux.circuitChauffageFonctionnel}
                          onChange={(e) =>
                            setDossier({
                              ...dossier,
                              informationTravaux: { ...dossier.informationTravaux, circuitChauffageFonctionnel: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 p-2"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="Oui">Oui</option>
                          <option value="Non">Non</option>
                        </select>
                      </div>
                    </fieldset>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => router.back()} disabled={dossierSubmitting}>
                      Annuler
                    </Button>
                    <Button type="submit" variant="primary" disabled={dossierSubmitting}>
                      {dossierSubmitting ? (
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
                        "Ajouter Dossier"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          </div>

        </main>

      </div>

      
    </div>
  );
}
