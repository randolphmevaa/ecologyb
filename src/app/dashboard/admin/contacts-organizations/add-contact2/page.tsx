"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Select, { MultiValue } from "react-select";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";

// ----------------------
// Updated Interfaces
// ----------------------

interface Comment {
  text: string;
  timestamp: string;
}

interface Contact {
  imageUrl: File | null;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  mailingAddress: string;
  workAddressDifferent: boolean;
  workAddress: string;
  workDepartment: string;
  workPostalCode: string;
  workCity: string;
  workCountry: string;
  isNewAddress: boolean;
  phone: string;
  email: string;
  role: string; // Always "Client / Customer (Client Portal)"
  numeroDossier: string;
  department: string;
  gestionnaireSuivi: string;
  comments: Comment[];
}

interface Dossier {
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
  informationFiscale: {
    numeroFiscal: string;
    referenceAvis: string;
    revenuFiscalReference: string;
    dateNaissanceFiscale: string;
    nombrePersonnesFoyer: string;
    nombreAvis: string;
    revenuFiscalGlobal: string;
    totalPersonnesFoyer: string;
    departementBeneficiaire: string;
    numeroFiscalDeclarant2: string;
    precarite: string;
    maPrimeRenov: string;
  };
  phaseProjet: string;
  typeTravaux: string;
  contactId: string;
}

// For user dropdown from /api/users
interface User {
  _id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

// Define an interface for address suggestions returned by the API
interface AddressSuggestion {
  properties: {
    label: string;
    id?: string;
    context: string;
    postcode: string;
  };
}

// Define an interface for the contact payload we send to the API
interface ContactPayload extends Contact {
  maprNumero: string;
  mpremail: string;
  mprpassword: string;
  climateZone: string;
  rfr: string;
  eligible: boolean;
  contactId: string;
}

// Options for "Projet proposé" multi-select
const projetOptions = [
  { value: "Pompes a chaleur", label: "Pompes a chaleur" },
  { value: "Chauffe-eau solaire individuel", label: "Chauffe-eau solaire individuel" },
  { value: "Chauffe-eau thermodynamique", label: "Chauffe-eau thermodynamique" },
  { value: "Système Solaire Combiné", label: "Système Solaire Combiné" },
  { value: "Poêle à granulés", label: "Poêle à granulés" },
  { value: "Panneaux photovoltaïques", label: "Panneaux photovoltaïques" },
];

// Options for "Type de logement"
const typeLogementOptions = [
  { value: "Maison", label: "Maison" },
  { value: "Appartement", label: "Appartement" },
  { value: "Autre", label: "Autre" },
];

// Options for "Profil" dropdown (for logement)
const profileLogementOptions = [
  { value: "proprietaireOccupant", label: "Propriétaire Occupant" },
  { value: "proprietaireBailleur", label: "Propriétaire Bailleur" },
  { value: "locataire", label: "Locataire" },
  { value: "sci", label: "SCI" },
  { value: "residenceSecondaire", label: "Résidence Secondaire" },
];

// Options for "Type de travaux" in "Le projet"
const travauxOptions = [
  { value: "Mono-geste", label: "Mono-geste" },
  { value: "Financement", label: "Financement" },
  { value: "Rénovation d'ampleur", label: "Rénovation d'ampleur" },
  { value: "Panneaux photovoltaique", label: "Panneaux photovoltaique" },
];

// Options for "Phase du projet"
const phaseProjetOptions = [
  { value: "1 Prise de contact", label: "Étape 1 - Prise de contact" },
  { value: "2 En attente des documents", label: "Étape 2 - En attente des documents" },
  { value: "3 Instruction du dossier", label: "Étape 3 - Instruction du dossier" },
  { value: "4 Dossier Accepter", label: "Étape 4 - Dossier Accepter" },
  { value: "5 Installation", label: "Étape 5 - Installation" },
  { value: "6 Contrôle", label: "Étape 6 - Contrôle" },
  { value: "7 Dossier clôturé", label: "Étape 7 - Dossier clôturé" },
];

// ----------------------
// Component
// ----------------------

export default function AddContactDossierPage() {
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState("client");
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const tabs = [
    { key: "avisImposition", label: "Avis d'imposition" },
    { key: "client", label: "Information client" },
    { key: "habitation", label: "Information de l'habitation" },
    { key: "aides", label: "Information des aides" },
    { key: "projet", label: "Commentaires" },
  ];

  // ----------------------
  // State definitions
  // ----------------------
  const [contact, setContact] = useState<Contact>({
    imageUrl: null,
    lastName: "",
    firstName: "",
    dateOfBirth: "",
    mailingAddress: "",
    workAddressDifferent: false,
    workAddress: "",
    workDepartment: "",
    workPostalCode: "",
    workCity: "",
    workCountry: "France",
    isNewAddress: false,
    phone: "",
    email: "",
    role: "Client / Customer (Client Portal)",
    numeroDossier: "",
    department: "",
    gestionnaireSuivi: "",
    comments: [],
  });
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof Contact, string>>>({});

  const [dossier, setDossier] = useState<Dossier>({
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
    informationFiscale: {
      numeroFiscal: "",
      referenceAvis: "",
      revenuFiscalReference: "",
      dateNaissanceFiscale: "",
      nombrePersonnesFoyer: "",
      nombreAvis: "",
      revenuFiscalGlobal: "",
      totalPersonnesFoyer: "",
      departementBeneficiaire: "",
      numeroFiscalDeclarant2: "",
      precarite: "",
      maPrimeRenov: "",
    },
    phaseProjet: "",
    typeTravaux: "",
    contactId: "",
  });
  const [dossierErrors, setDossierErrors] = useState<{ [key: string]: string }>({});

  // New state variable to preview the created contactId
  const [createdContactId, setCreatedContactId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  // ----- FIXED: Specify a type instead of any ----- //
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAvisModal, setShowAvisModal] = useState(false);
  const [avisModalStep, setAvisModalStep] = useState(1); // 1: upload, 2: verify info
  const [uploadedAvisFile, setUploadedAvisFile] = useState<File | null>(null);
  // const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [extractedAvisInfo, setExtractedAvisInfo] = useState({
    nomDeclarant: "",
    prenomDeclarant: "",
    adresse: "",
    codePostal: "",
    departement: "",
    ville: "",
    numeroFiscal: "",
    referenceAvisFiscal: "",
    revenuFiscalReference: "",
    nombreParts: "",
    nombrePersonnesFoyer: ""
  });

  const openAvisModal = () => {
    setShowAvisModal(true);
    setAvisModalStep(1);
    setUploadedAvisFile(null);
  };
  
  // const closeAvisModal = () => {
  //   setShowAvisModal(false);
  // };
  
  const handleAvisFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Clean up previous object URL if any
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      // Store file type
      setFileType(file.type);
      setUploadedAvisFile(file);
      setFilePreviewUrl(previewUrl);
      
      console.log('File uploaded:', file.name, file.type, previewUrl);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Clean up previous object URL if any
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      
      const file = e.dataTransfer.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      // Store file type
      setFileType(file.type);
      setUploadedAvisFile(file);
      setFilePreviewUrl(previewUrl);
      
      console.log('File dropped:', file.name, file.type, previewUrl);
    }
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // You can add visual feedback here if desired
    // For example, adding a class that changes the border color
  };

  const closeAvisModal = () => {
    setShowAvisModal(false);
    // Clean up any object URLs to prevent memory leaks
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };
  
  const goToVerifyStep = () => {
    if (uploadedAvisFile) {
      // In a real implementation, you would process the file here
      // For this example, we'll simulate extracted data
      setExtractedAvisInfo({
        nomDeclarant: "Doe",
        prenomDeclarant: "John",
        adresse: "123 Rue Example",
        codePostal: "75001",
        departement: "75",
        ville: "Paris",
        numeroFiscal: "1234567890",
        referenceAvisFiscal: "98765432109",
        revenuFiscalReference: "35000",
        nombreParts: "2",
        nombrePersonnesFoyer: "3"
      });
      setAvisModalStep(2);
    }
  };

  const insertAvisInfo = () => {
    // Update the dossier state with extracted information
    setDossier(prev => ({
      ...prev,
      informationFiscale: {
        ...prev.informationFiscale,
        numeroFiscal: extractedAvisInfo.numeroFiscal,
        referenceAvis: extractedAvisInfo.referenceAvisFiscal,
        revenuFiscalReference: extractedAvisInfo.revenuFiscalReference,
        nombrePersonnesFoyer: extractedAvisInfo.nombrePersonnesFoyer,
        departementBeneficiaire: extractedAvisInfo.departement,
      },
      informationAides: {
        ...prev.informationAides,
        rfr: extractedAvisInfo.revenuFiscalReference,
        nombrePersonne: extractedAvisInfo.nombrePersonnesFoyer,
      }
    }));
    
    // Update contact information
    setContact(prev => ({
      ...prev,
      lastName: extractedAvisInfo.nomDeclarant || prev.lastName,
      firstName: extractedAvisInfo.prenomDeclarant || prev.firstName,
      department: extractedAvisInfo.departement || prev.department,
      mailingAddress: extractedAvisInfo.adresse ? 
        `${extractedAvisInfo.adresse}, ${extractedAvisInfo.codePostal} ${extractedAvisInfo.ville}` : 
        prev.mailingAddress
    }));
    
    closeAvisModal();
  };

  const departements = [
    { value: "01", label: "Ain (01)" },
    { value: "02", label: "Aisne (02)" },
    { value: "03", label: "Allier (03)" },
    { value: "04", label: "Alpes-de-Haute-Provence (04)" },
    { value: "05", label: "Hautes-Alpes (05)" },
    { value: "06", label: "Alpes-Maritimes (06)" },
    { value: "07", label: "Ardèche (07)" },
    { value: "08", label: "Ardennes (08)" },
    { value: "09", label: "Ariège (09)" },
    { value: "10", label: "Aube (10)" },
    { value: "11", label: "Aude (11)" },
    { value: "12", label: "Aveyron (12)" },
    { value: "13", label: "Bouches-du-Rhône (13)" },
    { value: "14", label: "Calvados (14)" },
    { value: "15", label: "Cantal (15)" },
    { value: "16", label: "Charente (16)" },
    { value: "17", label: "Charente-Maritime (17)" },
    { value: "18", label: "Cher (18)" },
    { value: "19", label: "Corrèze (19)" },
    { value: "2A", label: "Corse-du-Sud (2A)" },
    { value: "2B", label: "Haute-Corse (2B)" },
    { value: "21", label: "Côte-d'Or (21)" },
    { value: "22", label: "Côtes-d'Armor (22)" },
    { value: "23", label: "Creuse (23)" },
    { value: "24", label: "Dordogne (24)" },
    { value: "25", label: "Doubs (25)" },
    { value: "26", label: "Drôme (26)" },
    { value: "27", label: "Eure (27)" },
    { value: "28", label: "Eure-et-Loir (28)" },
    { value: "29", label: "Finistère (29)" },
    { value: "30", label: "Gard (30)" },
    { value: "31", label: "Haute-Garonne (31)" },
    { value: "32", label: "Gers (32)" },
    { value: "33", label: "Gironde (33)" },
    { value: "34", label: "Hérault (34)" },
    { value: "35", label: "Ille-et-Vilaine (35)" },
    { value: "36", label: "Indre (36)" },
    { value: "37", label: "Indre-et-Loire (37)" },
    { value: "38", label: "Isère (38)" },
    { value: "39", label: "Jura (39)" },
    { value: "40", label: "Landes (40)" },
    { value: "41", label: "Loir-et-Cher (41)" },
    { value: "42", label: "Loire (42)" },
    { value: "43", label: "Haute-Loire (43)" },
    { value: "44", label: "Loire-Atlantique (44)" },
    { value: "45", label: "Loiret (45)" },
    { value: "46", label: "Lot (46)" },
    { value: "47", label: "Lot-et-Garonne (47)" },
    { value: "48", label: "Lozère (48)" },
    { value: "49", label: "Maine-et-Loire (49)" },
    { value: "50", label: "Manche (50)" },
    { value: "51", label: "Marne (51)" },
    { value: "52", label: "Haute-Marne (52)" },
    { value: "53", label: "Mayenne (53)" },
    { value: "54", label: "Meurthe-et-Moselle (54)" },
    { value: "55", label: "Meuse (55)" },
    { value: "56", label: "Morbihan (56)" },
    { value: "57", label: "Moselle (57)" },
    { value: "58", label: "Nièvre (58)" },
    { value: "59", label: "Nord (59)" },
    { value: "60", label: "Oise (60)" },
    { value: "61", label: "Orne (61)" },
    { value: "62", label: "Pas-de-Calais (62)" },
    { value: "63", label: "Puy-de-Dôme (63)" },
    { value: "64", label: "Pyrénées-Atlantiques (64)" },
    { value: "65", label: "Hautes-Pyrénées (65)" },
    { value: "66", label: "Pyrénées-Orientales (66)" },
    { value: "67", label: "Bas-Rhin (67)" },
    { value: "68", label: "Haut-Rhin (68)" },
    { value: "69", label: "Rhône (69)" },
    { value: "70", label: "Haute-Saône (70)" },
    { value: "71", label: "Saône-et-Loire (71)" },
    { value: "72", label: "Sarthe (72)" },
    { value: "73", label: "Savoie (73)" },
    { value: "74", label: "Haute-Savoie (74)" },
    { value: "75", label: "Paris (75)" },
    { value: "76", label: "Seine-Maritime (76)" },
    { value: "77", label: "Seine-et-Marne (77)" },
    { value: "78", label: "Yvelines (78)" },
    { value: "79", label: "Deux-Sèvres (79)" },
    { value: "80", label: "Somme (80)" },
    { value: "81", label: "Tarn (81)" },
    { value: "82", label: "Tarn-et-Garonne (82)" },
    { value: "83", label: "Var (83)" },
    { value: "84", label: "Vaucluse (84)" },
    { value: "85", label: "Vendée (85)" },
    { value: "86", label: "Vienne (86)" },
    { value: "87", label: "Haute-Vienne (87)" },
    { value: "88", label: "Vosges (88)" },
    { value: "89", label: "Yonne (89)" },
    { value: "90", label: "Territoire de Belfort (90)" },
    { value: "91", label: "Essonne (91)" },
    { value: "92", label: "Hauts-de-Seine (92)" },
    { value: "93", label: "Seine-Saint-Denis (93)" },
    { value: "94", label: "Val-de-Marne (94)" },
    { value: "95", label: "Val-d'Oise (95)" },
    // Overseas departments (DOM):
    { value: "971", label: "Guadeloupe (971)" },
    { value: "972", label: "Martinique (972)" },
    { value: "973", label: "Guyane (973)" },
    { value: "974", label: "La Réunion (974)" },
    { value: "976", label: "Mayotte (976)" }
  ];
  

  // ----------------------
  // Effects
  // ----------------------
  // Generate a unique contactId on component mount

  useEffect(() => {
    if (extractedAvisInfo.nomDeclarant || extractedAvisInfo.prenomDeclarant) {
      setContact(prev => ({
        ...prev,
        lastName: extractedAvisInfo.nomDeclarant || prev.lastName,
        firstName: extractedAvisInfo.prenomDeclarant || prev.firstName
      }));
    }
  }, [extractedAvisInfo.nomDeclarant, extractedAvisInfo.prenomDeclarant]);

  // Sync tax notice address to client address
  useEffect(() => {
    if (extractedAvisInfo.adresse) {
      const fullAddress = `${extractedAvisInfo.adresse}, ${extractedAvisInfo.codePostal} ${extractedAvisInfo.ville}`;
      setContact(prev => ({
        ...prev,
        mailingAddress: fullAddress
      }));
      
      // Also update the department if available
      if (extractedAvisInfo.departement) {
        setContact(prev => ({
          ...prev,
          department: extractedAvisInfo.departement
        }));
      }
    }
  }, [extractedAvisInfo.adresse, extractedAvisInfo.codePostal, extractedAvisInfo.ville, extractedAvisInfo.departement]);

  // Sync tax data between informationFiscale and informationAides
  useEffect(() => {
    if (dossier.informationFiscale.revenuFiscalReference) {
      setDossier(prev => ({
        ...prev,
        informationAides: {
          ...prev.informationAides,
          rfr: dossier.informationFiscale.revenuFiscalReference
        }
      }));
    }
    
    if (dossier.informationFiscale.nombrePersonnesFoyer) {
      setDossier(prev => ({
        ...prev,
        informationAides: {
          ...prev.informationAides,
          nombrePersonne: dossier.informationFiscale.nombrePersonnesFoyer
        }
      }));
    }
  }, [dossier.informationFiscale.revenuFiscalReference, dossier.informationFiscale.nombrePersonnesFoyer]);

  // Sync fiscal data to contact
  useEffect(() => {
    if (dossier.informationFiscale.dateNaissanceFiscale) {
      setContact(prev => ({
        ...prev,
        dateOfBirth: dossier.informationFiscale.dateNaissanceFiscale
      }));
    }
  }, [dossier.informationFiscale.dateNaissanceFiscale]);

  // Sync from contact data to fiscal if changed there first
  useEffect(() => {
    // Update extractedAvisInfo if contact details are changed directly
    if (contact.lastName && !extractedAvisInfo.nomDeclarant) {
      setExtractedAvisInfo(prev => ({
        ...prev,
        nomDeclarant: contact.lastName
      }));
    }
    
    if (contact.firstName && !extractedAvisInfo.prenomDeclarant) {
      setExtractedAvisInfo(prev => ({
        ...prev,
        prenomDeclarant: contact.firstName
      }));
    }
    
    if (contact.dateOfBirth && !dossier.informationFiscale.dateNaissanceFiscale) {
      setDossier(prev => ({
        ...prev,
        informationFiscale: {
          ...prev.informationFiscale,
          dateNaissanceFiscale: contact.dateOfBirth
        }
      }));
    }
  }, [contact.lastName, contact.firstName, contact.dateOfBirth]);

  useEffect(() => {
    const generatedId = crypto.randomUUID();
    setCreatedContactId(generatedId);
    setDossier((prev) => ({ ...prev, contactId: generatedId }));
  }, []);

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

  useEffect(() => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setContact((prev) => ({ ...prev, numeroDossier: `ECO-${year}-${randomNum}` }));
  }, []);

  useEffect(() => {
    const rfrValue = parseFloat(dossier.informationAides.rfr);
    const eligible = !isNaN(rfrValue) && rfrValue >= 30000;
    setDossier((prev) => ({
      ...prev,
      informationAides: { ...prev.informationAides, eligible },
    }));
  }, [dossier.informationAides.rfr]);

  // Auto-set mprColor in French based on nombrePersonne and rfr
  useEffect(() => {
    const num = parseInt(dossier.informationAides.nombrePersonne);
    const rfrValue = parseFloat(dossier.informationAides.rfr);
    if (!isNaN(num) && !isNaN(rfrValue)) {
      const color = num >= 3 && rfrValue >= 30000 ? "vert" : "rouge";
      setDossier((prev) => ({
        ...prev,
        informationAides: { ...prev.informationAides, mprColor: color },
      }));
    }
  }, [dossier.informationAides.nombrePersonne, dossier.informationAides.rfr]);

  // Address Autocomplete
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

  // ----- FIXED: Specify parameter type instead of any ----- //
  const selectAddressSuggestion = (suggestion: AddressSuggestion) => {
    const label = suggestion.properties.label;
    const context = suggestion.properties.context;
    let department = "";
    if (context) {
      department = context.split(",")[0];
    }
    const postcode = suggestion.properties.postcode || "";
    // Map department to zone climatique (example logic)
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

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Validation functions
  const validateContactField = (field: keyof Contact, value: Contact[typeof field]): string => {
    if (!value && field !== "imageUrl") return "Ce champ est requis";
    if (field === "email" && value && typeof value === "string" && !/^\S+@\S+\.\S+$/.test(value))
      return "Veuillez entrer un email valide";
    return "";
  };

  const handleContactBlur = (field: keyof Contact, value: Contact[typeof field]) => {
    const error = validateContactField(field, value);
    setContactErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Comment Handling
  const [commentInput, setCommentInput] = useState("");
  const addComment = () => {
    if (commentInput.trim() !== "") {
      const newComment: Comment = {
        text: commentInput.trim(),
        timestamp: new Date().toLocaleString(),
      };
      setContact((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));
      setCommentInput("");
    }
  };

  // Image Upload
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
  //     setContact({ ...contact, imageUrl: e.dataTransfer.files[0] });
  //   }
  // };
  // const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Unified Submit Handler
  const handleUnifiedSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate Contact fields
    const contactRequiredFields: (keyof Contact)[] = [
      "lastName",
      "firstName",
      "dateOfBirth",
      "mailingAddress",
      "phone",
      "email",
      "department",
      "gestionnaireSuivi",
    ];
    const newContactErrors: Partial<Record<keyof Contact, string>> = {};
    contactRequiredFields.forEach((field) => {
      const error = validateContactField(field, contact[field]);
      if (error) newContactErrors[field] = error;
    });
    setContactErrors(newContactErrors);

    // Validate Dossier fields
    const newDossierErrors: { [key: string]: string } = {};
    const logementFields: (keyof Dossier["informationLogement"])[] = [
      "systemeChauffage",
      "surfaceHabitable",
      "typeCompteurElectrique",
      "projetPropose",
      "anneeConstruction",
      "typeLogement",
      "profileLogement",
    ];
    logementFields.forEach((field) => {
      if (field === "projetPropose") {
        if (!dossier.informationLogement.projetPropose || dossier.informationLogement.projetPropose.length === 0)
          newDossierErrors[`informationLogement.${field}`] = "Ce champ est requis";
      } else if (!dossier.informationLogement[field]) {
        newDossierErrors[`informationLogement.${field}`] = "Ce champ est requis";
      }
    });
    const aidesFields: (keyof Dossier["informationAides"])[] = [
      // "numeroDossierMPR",
      "nombrePersonne",
      "codePostale",
      "zoneClimatique",
      "rfr",
      "mprColor",
    ];
    aidesFields.forEach((field) => {
      if (!dossier.informationAides[field])
        newDossierErrors[`informationAides.${field}`] = "Ce champ est requis";
    });
    if (dossier.informationAides.compteMPRExistant) {
      if (!dossier.informationAides.mpremail) newDossierErrors["informationAides.mpremail"] = "Ce champ est requis";
      if (!dossier.informationAides.mprpassword) newDossierErrors["informationAides.mprpassword"] = "Ce champ est requis";
    }
    const projetFields: (keyof Pick<Dossier, "phaseProjet" | "typeTravaux">)[] = ["phaseProjet", "typeTravaux"];
    projetFields.forEach((field) => {
      if (!dossier[field]) newDossierErrors[field] = "Ce champ est requis";
    });
    setDossierErrors(newDossierErrors);

    if (Object.keys(newContactErrors).length > 0 || Object.keys(newDossierErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // Build payload for API/contacts with the generated contactId
      const contactPayload: ContactPayload = {
        ...contact,
        role: "Client / Customer (Client Portal)",
        maprNumero: dossier.informationAides.numeroDossierMPR,
        mpremail: dossier.informationAides.mpremail,
        mprpassword: dossier.informationAides.mprpassword,
        climateZone: dossier.informationAides.zoneClimatique,
        rfr: dossier.informationAides.rfr,
        eligible: dossier.informationAides.eligible,
        contactId: createdContactId, // Include the generated ID
      };

      const formData = new FormData();
      Object.entries(contactPayload).forEach(([key, value]) => {
        if (key === "imageUrl" && value) formData.append(key, value as File);
        else if (key === "comments") formData.append(key, JSON.stringify(value));
        else formData.append(key, value as string | Blob);
      });

      // Post to API/contacts
      await fetch("/api/contacts", {
        method: "POST",
        body: formData,
      });

      // Build payload for API/dossiers
      const dossierPayload = {
        contactId: createdContactId,
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

      await fetch("/api/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dossierPayload),
      });

      // Post each comment to API/commentaires
      for (const comment of contact.comments) {
        const commentairePayload = {
          contactId: createdContactId,
          auteur: `${contact.firstName} ${contact.lastName}`.trim(),
          date: comment.timestamp,
          commentaire: comment.text,
          linkedTo: contact.numeroDossier,
        };
        await fetch("/api/commentaires", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentairePayload),
        });
      }

      setIsSubmitting(false);
      router.back();
    } catch (error) {
      console.error("Error submitting unified form:", error);
      setIsSubmitting(false);
    }
  };

  // Navigation for tab buttons
  const currentTabIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) setActiveTab(tabs[currentTabIndex + 1].key);
  };
  const goToPreviousTab = () => {
    if (currentTabIndex > 0) setActiveTab(tabs[currentTabIndex - 1].key);
  };

  // Prepare react-select value for "Projet proposé"
  const projetSelectValue = projetOptions.filter((option) =>
    dossier.informationLogement.projetPropose.includes(option.value)
  );

  // Define your options outside the component or in the same file
const chauffageOptions = [
  { value: 'gaz', label: 'Gaz' },
  { value: 'fioul', label: 'Fioul' },
  { value: 'electrique', label: 'Electrique' },
  { value: 'pompe-a-chaleur', label: 'Pompe à chaleur' },
  { value: 'chaudiere-a-bois', label: 'Chaudière à bois' },
  { value: 'chaudiere-a-granules', label: 'Chaudière à granulés' },
];

// Helper function to calculate the MPR color based on the provided rules
const calculateMprColor = (
  rfrStr: string,
  nombrePersonneStr: string,
  department: string
): string => {
  const rfr = parseFloat(rfrStr);
  const persons = parseInt(nombrePersonneStr, 10);
  if (isNaN(rfr) || isNaN(persons)) return "";

  // Define the list of departments for Ile de France
  const ileDeFranceDepartments = ["91", "92", "93", "94", "95", "75", "77", "78"];
  const isIDF = ileDeFranceDepartments.includes(department);

  let thresholds: [number, number, number];

  if (isIDF) {
    // Ile de France thresholds for 1 to 5 persons: [blueMax, yellowMax, purpleMax]
    const thresholdsMap: Record<number, [number, number, number]> = {
      1: [23768, 28933, 40404],
      2: [34884, 42463, 59394],
      3: [41893, 51000, 71060],
      4: [48914, 59549, 83637],
      5: [55961, 68123, 95758],
    };
    if (persons <= 5) {
      thresholds = thresholdsMap[persons];
    } else {
      // For each additional person beyond 5, add the extra amounts.
      const extra = persons - 5;
      const base = thresholdsMap[5];
      thresholds = [
        base[0] + extra * 7038,
        base[1] + extra * 8568,
        base[2] + extra * 12122,
      ];
    }
  } else {
    // Other regions thresholds for 1 to 5 persons
    const thresholdsMap: Record<number, [number, number, number]> = {
      1: [17173, 22015, 30844],
      2: [25115, 32197, 45340],
      3: [30206, 38719, 54592],
      4: [35285, 45234, 63844],
      5: [40388, 51775, 73098],
    };
    if (persons <= 5) {
      thresholds = thresholdsMap[persons];
    } else {
      const extra = persons - 5;
      const base = thresholdsMap[5];
      thresholds = [
        base[0] + extra * 5094,
        base[1] + extra * 6525,
        base[2] + extra * 9524,
      ];
    }
  }

  // thresholds now contains [blueMax, yellowMax, purpleMax]
  if (rfr <= thresholds[0]) return "Bleu";
  else if (rfr <= thresholds[1]) return "Jaune";
  else if (rfr <= thresholds[2]) return "Violet";
  else return "Rose";
};

// --- In your component ---

// Update the MPR color whenever RFR, number of persons, or department changes
useEffect(() => {
  const color = calculateMprColor(
    dossier.informationAides.rfr,
    dossier.informationAides.nombrePersonne,
    contact.department // assuming department is set in the contact state
  );
  setDossier((prev) => ({
    ...prev,
    informationAides: {
      ...prev.informationAides,
      mprColor: color,
    },
  }));
}, [dossier.informationAides.rfr, dossier.informationAides.nombrePersonne, contact.department]);

// --- In your component ---

// Update the MPR color whenever RFR, number of persons, or department changes
useEffect(() => {
  const color = calculateMprColor(
    dossier.informationAides.rfr,
    dossier.informationAides.nombrePersonne,
    contact.department // assuming department is set in the contact state
  );
  setDossier((prev) => ({
    ...prev,
    informationAides: {
      ...prev.informationAides,
      mprColor: color,
    },
  }));
}, [dossier.informationAides.rfr, dossier.informationAides.nombrePersonne, contact.department]);


  // Map the selected values to the corresponding react-select options
  const selectedOptions = chauffageOptions.filter(option =>
    dossier.informationLogement.systemeChauffage.includes(option.value)
  );

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
              Ajouter un client
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
                    <motion.div layoutId="underline" className="absolute left-0 right-0 -bottom-1 h-1 bg-indigo-600 rounded" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleUnifiedSubmit} noValidate>
          <AnimatePresence>
            {/* IMPOT TAB */}
            {activeTab === "avisImposition" && (
              <motion.div 
                key="avisImposition" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="bg-white p-6 rounded-lg shadow-lg mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Numéro fiscal */}
                  <div>
                    <label htmlFor="numeroFiscal" className="block text-sm font-medium text-gray-700">
                      Numéro fiscal
                    </label>
                    <input
                      type="text"
                      id="numeroFiscal"
                      value={dossier.informationFiscale.numeroFiscal}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, numeroFiscal: e.target.value },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Référence de l'avis */}
                  <div>
                    <label htmlFor="referenceAvis" className="block text-sm font-medium text-gray-700">
                      Référence de l&apos;avis
                    </label>
                    <input
                      type="text"
                      id="referenceAvis"
                      value={dossier.informationFiscale.referenceAvis}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, referenceAvis: e.target.value },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Revenu fiscal de référence */}
                  <div>
                    <label htmlFor="revenuFiscalReference" className="block text-sm font-medium text-gray-700">
                      Revenu fiscal de référence
                    </label>
                    <input
                      type="text"
                      id="revenuFiscalReference"
                      value={dossier.informationFiscale.revenuFiscalReference}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, revenuFiscalReference: value },
                          informationAides: { ...dossier.informationAides, rfr: value }
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Date de naissance */}
                  <div>
                    <label htmlFor="dateNaissanceFiscale" className="block text-sm font-medium text-gray-700">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="dateNaissanceFiscale"
                      value={dossier.informationFiscale.dateNaissanceFiscale}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, dateNaissanceFiscale: value }
                        });
                        setContact({
                          ...contact,
                          dateOfBirth: value
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Nombre de personnes du foyer dans l'avis */}
                  <div>
                    <label htmlFor="nombrePersonnesFoyer" className="block text-sm font-medium text-gray-700">
                      Nombre de personne(s) du foyer dans l&apos;avis
                    </label>
                    <input
                      type="number"
                      id="nombrePersonnesFoyer"
                      value={dossier.informationFiscale.nombrePersonnesFoyer}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, nombrePersonnesFoyer: value },
                          informationAides: { ...dossier.informationAides, nombrePersonne: value }
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Nombre d'avis */}
                  <div>
                    <label htmlFor="nombreAvis" className="block text-sm font-medium text-gray-700">
                      Nombre d&apos;avis
                    </label>
                    <input
                      type="number"
                      id="nombreAvis"
                      value={dossier.informationFiscale.nombreAvis}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, nombreAvis: e.target.value },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Revenu fiscal de référence globale */}
                  <div>
                    <label htmlFor="revenuFiscalGlobal" className="block text-sm font-medium text-gray-700">
                      Revenu fiscal de référence globale
                    </label>
                    <input
                      type="text"
                      id="revenuFiscalGlobal"
                      value={dossier.informationFiscale.revenuFiscalGlobal}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, revenuFiscalGlobal: e.target.value },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Total de personnes dans le foyer */}
                  <div>
                    <label htmlFor="totalPersonnesFoyer" className="block text-sm font-medium text-gray-700">
                      Total de personne(s) dans le foyer
                    </label>
                    <input
                      type="number"
                      id="totalPersonnesFoyer"
                      value={dossier.informationFiscale.totalPersonnesFoyer}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, totalPersonnesFoyer: e.target.value },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Département du bénéficiaire */}
                  <div>
                    <label htmlFor="departementBeneficiaire" className="block text-sm font-medium text-gray-700">
                      Département du bénéficiaire
                    </label>
                    <select
                      id="departementBeneficiaire"
                      value={dossier.informationFiscale.departementBeneficiaire}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, departementBeneficiaire: value }
                        });
                        setContact({
                          ...contact,
                          department: value
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionnez</option>
                      {departements.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Numéro fiscal déclarant n°2 */}
                  <div>
                    <label htmlFor="numeroFiscalDeclarant2" className="block text-sm font-medium text-gray-700">
                      Numéro fiscal déclarant n°2
                    </label>
                    <input
                      type="text"
                      id="numeroFiscalDeclarant2"
                      value={dossier.informationFiscale.numeroFiscalDeclarant2}
                      onChange={(e) =>
                        setDossier({
                          ...dossier,
                          informationFiscale: { ...dossier.informationFiscale, numeroFiscalDeclarant2: e.target.value },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Buttons container */}
                  <div className="md:col-span-2 mt-4 flex space-x-4">
                    <Button 
                      variant="primary" 
                      type="button" 
                      onClick={openAvisModal}
                      className="w-full md:w-1/2"
                    >
                      Vérifier un avis d&apos;imposition
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      type="button"
                      className="w-full md:w-1/2"
                    >
                      Ajouter un avis
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INFORMATION CLIENT TAB */}
            {activeTab === "client" && (
              <motion.div key="client" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <div className="grid grid-cols-1 gap-6">
                  {/* Nom & Prénom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        value={contact.lastName} 
                        onChange={(e) => {
                          const value = e.target.value;
                          setContact({ ...contact, lastName: value });
                          // Update the extractedAvisInfo as well for two-way binding
                          setExtractedAvisInfo(prev => ({ ...prev, nomDeclarant: value }));
                        }} 
                        onBlur={(e) => handleContactBlur("lastName", e.target.value)} 
                        placeholder="Entrez le nom" 
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                      {contactErrors.lastName && <p className="mt-1 text-xs text-red-500">{contactErrors.lastName}</p>}
                    </div>
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        value={contact.firstName} 
                        onChange={(e) => {
                          const value = e.target.value;
                          setContact({ ...contact, firstName: value });
                          // Update the extractedAvisInfo as well for two-way binding
                          setExtractedAvisInfo(prev => ({ ...prev, prenomDeclarant: value }));
                        }} 
                        onBlur={(e) => handleContactBlur("firstName", e.target.value)} 
                        placeholder="Entrez le prénom" 
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                      {contactErrors.firstName && <p className="mt-1 text-xs text-red-500">{contactErrors.firstName}</p>}
                    </div>
                  </div>
                  {/* Date de naissance - sync with fiscal date */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date de naissance</label>
                    <input 
                      type="date" 
                      id="dateOfBirth" 
                      value={contact.dateOfBirth} 
                      onChange={(e) => {
                        const value = e.target.value;
                        setContact({ ...contact, dateOfBirth: value });
                        // Sync with fiscal date
                        setDossier(prev => ({
                          ...prev,
                          informationFiscale: { ...prev.informationFiscale, dateNaissanceFiscale: value }
                        }));
                      }} 
                      onBlur={(e) => handleContactBlur("dateOfBirth", e.target.value)} 
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    {contactErrors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{contactErrors.dateOfBirth}</p>}
                  </div>
                  {/* Adresse */}
                  <div className="relative">
                    <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700">Adresse</label>
                    <input 
                      type="text" 
                      id="mailingAddress" 
                      value={contact.mailingAddress} 
                      onChange={(e) => {
                        handleAddressChange(e);
                        // If there's a synchronized address field in extractedAvisInfo, we could update it here
                        const address = e.target.value;
                        if (address && address.includes(',')) {
                          const parts = address.split(',');
                          const streetAddress = parts[0].trim();
                          let postalAndCity = '';
                          if (parts.length > 1) {
                            postalAndCity = parts[1].trim();
                          }
                          
                          // Try to extract postal code if present
                          const postalMatch = postalAndCity.match(/\b\d{5}\b/);
                          const postalCode = postalMatch ? postalMatch[0] : '';
                          
                          // Assume the rest is the city
                          const city = postalAndCity.replace(postalCode, '').trim();
                          
                          setExtractedAvisInfo(prev => ({
                            ...prev,
                            adresse: streetAddress,
                            codePostal: postalCode,
                            ville: city
                          }));
                        }
                      }} 
                      placeholder="Entrez l'adresse" 
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    {addressSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                        {addressSuggestions.map((suggestion) => (
                          <li key={suggestion.properties.id || suggestion.properties.label} onClick={() => selectAddressSuggestion(suggestion)} className="cursor-pointer px-3 py-2 hover:bg-indigo-100">
                            {suggestion.properties.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Téléphone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input type="tel" id="phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} onBlur={(e) => handleContactBlur("phone", e.target.value)} placeholder="Entrez le numéro de téléphone" className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    {contactErrors.phone && <p className="mt-1 text-xs text-red-500">{contactErrors.phone}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} onBlur={(e) => handleContactBlur("email", e.target.value)} placeholder="Entrez l'email" className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    {contactErrors.email && <p className="mt-1 text-xs text-red-500">{contactErrors.email}</p>}
                  </div>
                  {/* Numéro de dossier (read-only) */}
                  <div>
                    <label htmlFor="numeroDossier" className="block text-sm font-medium text-gray-700">Numéro de dossier</label>
                    <input type="text" id="numeroDossier" value={contact.numeroDossier} readOnly className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2" />
                  </div>
                  {/* Département (no longer read-only) */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Département</label>
                    <select
                      id="department"
                      value={contact.department}
                      onChange={(e) => {
                        const value = e.target.value;
                        setContact({ ...contact, department: value });
                        // Update fiscal department
                        setDossier(prev => ({
                          ...prev,
                          informationFiscale: { 
                            ...prev.informationFiscale, 
                            departementBeneficiaire: value 
                          }
                        }));
                        setExtractedAvisInfo(prev => ({
                          ...prev,
                          departement: value
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionnez</option>
                      {departements.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                    {contactErrors.department && <p className="mt-1 text-xs text-red-500">{contactErrors.department}</p>}
                  </div>
                  {/* Gestionnaire de suivi */}
                  <div>
                    <label htmlFor="gestionnaireSuivi" className="block text-sm font-medium text-gray-700">
                      Gestionnaire de suivi
                    </label>
                    <select
                      id="gestionnaireSuivi"
                      value={contact.gestionnaireSuivi}
                      onChange={(e) => setContact({ ...contact, gestionnaireSuivi: e.target.value })}
                      onBlur={(e) => handleContactBlur("gestionnaireSuivi", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionnez un gestionnaire</option>
                      {users.map((user) => {
                        const name = user.firstName || user.lastName
                          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                          : user.email;
                        
                        const roleTranslations: { 
                          [key in "Sales Representative / Account Executive" | "Project / Installation Manager" | "Technician / Installer" | "Customer Support / Service Representative" | "Super Admin"]: string 
                        } = {
                          "Sales Representative / Account Executive": "Représentant commercial / Chargé de compte",
                          "Project / Installation Manager": "Régie",
                          "Technician / Installer": "Technicien / Installateur",
                          "Customer Support / Service Representative": "Support client / Représentant du service",
                          "Super Admin": "Super administrateur"
                        };
                        
                        const translatedRole = user.role 
                          ? (roleTranslations[user.role as keyof typeof roleTranslations] || user.role)
                          : "";
                        
                        return (
                          <option key={user._id} value={user._id}>
                            {name} {translatedRole && `(${translatedRole})`}
                          </option>
                        );
                      })}
                    </select>
                    {contactErrors.gestionnaireSuivi && (
                      <p className="mt-1 text-xs text-red-500">{contactErrors.gestionnaireSuivi}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* INFORMATION DE L'HABITATION TAB */}
            {activeTab === "habitation" && (
              <motion.div key="habitation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type de logement */}
                  <div>
                    <label htmlFor="typeLogement" className="block text-sm font-medium text-gray-700">Type de logement</label>
                    <select id="typeLogement" value={dossier.informationLogement.typeLogement} onChange={(e) => setDossier({ ...dossier, informationLogement: { ...dossier.informationLogement, typeLogement: e.target.value } })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Sélectionnez</option>
                      {typeLogementOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {dossierErrors["informationLogement.typeLogement"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.typeLogement"]}</p>}
                  </div>
                  {/* Type de travaux (dropdown) */}
                  <div>
                    <label htmlFor="typeTravaux" className="block text-sm font-medium text-gray-700">Type de travaux</label>
                    <select id="typeTravaux" value={dossier.typeTravaux} onChange={(e) => setDossier({ ...dossier, typeTravaux: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Sélectionnez</option>
                      {travauxOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {dossierErrors.typeTravaux && <p className="mt-1 text-xs text-red-500">{dossierErrors.typeTravaux}</p>}
                  </div>
                  {/* Profil */}
                  <div>
                    <label htmlFor="profileLogement" className="block text-sm font-medium text-gray-700">
                      Profil
                    </label>
                    <select
                      id="profileLogement"
                      value={dossier.informationLogement.profileLogement}
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
                  {/* Système de chauffage */}
                  <div>
                    <label htmlFor="systemeChauffage" className="block text-sm font-medium text-gray-700">
                      Système de chauffage
                    </label>
                    <Select
                      id="systemeChauffage"
                      isMulti
                      options={chauffageOptions}
                      value={selectedOptions}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
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
                  {/* Surface habitable */}
                  <div>
                    <label htmlFor="surfaceHabitable" className="block text-sm font-medium text-gray-700">Surface habitable (m²)</label>
                    <input type="number" id="surfaceHabitable" value={dossier.informationLogement.surfaceHabitable} onChange={(e) => setDossier({ ...dossier, informationLogement: { ...dossier.informationLogement, surfaceHabitable: e.target.value } })} placeholder="Ex: 180" className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    {dossierErrors["informationLogement.surfaceHabitable"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.surfaceHabitable"]}</p>}
                  </div>
                  {/* Type de compteur électrique */}
                  <div>
                    <label htmlFor="typeCompteurElectrique" className="block text-sm font-medium text-gray-700">Type de compteur électrique</label>
                    <select id="typeCompteurElectrique" value={dossier.informationLogement.typeCompteurElectrique} onChange={(e) => setDossier({ ...dossier, informationLogement: { ...dossier.informationLogement, typeCompteurElectrique: e.target.value } })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Sélectionnez</option>
                      <option value="Monophasé">Monophasé</option>
                      <option value="Triphasé">Triphasé</option>
                    </select>
                    {dossierErrors["informationLogement.typeCompteurElectrique"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.typeCompteurElectrique"]}</p>}
                  </div>
                  {/* Année de construction */}
                  <div>
                    <label htmlFor="anneeConstruction" className="block text-sm font-medium text-gray-700">Année de construction</label>
                    <input type="number" id="anneeConstruction" value={dossier.informationLogement.anneeConstruction} onChange={(e) => setDossier({ ...dossier, informationLogement: { ...dossier.informationLogement, anneeConstruction: e.target.value } })} placeholder="Ex: 1998" className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    {dossierErrors["informationLogement.anneeConstruction"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationLogement.anneeConstruction"]}</p>}
                  </div>
                  {/* Projet proposé (Multi-select) */}
                  <div>
                    <label htmlFor="projetPropose" className="block text-sm font-medium text-gray-700">
                      Projet proposé
                    </label>
                    <Select
                      isMulti
                      options={projetOptions}
                      value={projetSelectValue}
                      onChange={(
                        selectedOptions: MultiValue<{ value: string; label: string }>
                      ) => {
                        const values = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
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
                          borderRadius: '0.375rem',
                          borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
                          boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.25)' : provided.boxShadow,
                          '&:hover': {
                            borderColor: '#2563eb',
                          },
                          padding: 4,
                          minHeight: 'auto',
                        }),
                        // Stack selected options vertically
                        valueContainer: (provided) => ({
                          ...provided,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '6px 8px',
                        }),
                        // Adjust styling for each selected option (chip) so it fits its content
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: '#3b82f6',
                          borderRadius: '0.375rem',
                          // Remove the fixed width so the chip sizes to its content
                          alignSelf: 'flex-start',
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: 'white',
                          padding: '4px 8px',
                          fontSize: '0.875rem',
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: 'white',
                          padding: '4px',
                          cursor: 'pointer',
                          ':hover': {
                            backgroundColor: '#2563eb',
                            color: 'white',
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          borderRadius: '0.375rem',
                          marginTop: 4,
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused ? '#ebf8ff' : 'white',
                          color: state.isFocused ? '#2563eb' : '#111827',
                          cursor: 'pointer',
                          padding: '8px 12px',
                        }),
                        indicatorsContainer: (provided) => ({
                          ...provided,
                          display: 'none',
                        }),
                      }}
                    />
                    {dossierErrors["informationLogement.projetPropose"] && (
                      <p className="mt-1 text-xs text-red-500">
                        {dossierErrors["informationLogement.projetPropose"]}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* INFORMATION DES AIDES TAB */}
            {activeTab === "aides" && (
              <motion.div key="aides" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Numéro de dossier MPR */}
                  <div>
                    <label htmlFor="numeroDossierMPR" className="block text-sm font-medium text-gray-700">Numéro de dossier MPR</label>
                    <input type="text" id="numeroDossierMPR" value={dossier.informationAides.numeroDossierMPR} onChange={(e) => setDossier({ ...dossier, informationAides: { ...dossier.informationAides, numeroDossierMPR: e.target.value } })} placeholder="Entrez le numéro MPR" className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    {dossierErrors["informationAides.numeroDossierMPR"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.numeroDossierMPR"]}</p>}
                  </div>
                  {/* Compte MPR existant ? */}
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="compteMPRExistant" checked={dossier.informationAides.compteMPRExistant} onChange={(e) => setDossier({ ...dossier, informationAides: { ...dossier.informationAides, compteMPRExistant: e.target.checked } })} className="h-5 w-5 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="compteMPRExistant" className="text-sm font-medium text-gray-700">Compte MPR existant ?</label>
                  </div>
                  {/* Conditionally show MPR Access fields */}
                  {dossier.informationAides.compteMPRExistant && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="mpremail" className="block text-sm font-medium text-gray-700">
                        Accès Ma Prime Renov - Email
                      </label>
                      <input
                        type="email"
                        id="mpremail"
                        value={dossier.informationAides.mpremail}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationAides: { ...dossier.informationAides, mpremail: e.target.value },
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
                        value={dossier.informationAides.mprpassword}
                        onChange={(e) =>
                          setDossier({
                            ...dossier,
                            informationAides: { ...dossier.informationAides, mprpassword: e.target.value },
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
                  {/* Nombre de personne */}
                  <div>
                    <label htmlFor="nombrePersonne" className="block text-sm font-medium text-gray-700">Nombre de personne</label>
                    <input 
                      type="number" 
                      id="nombrePersonne" 
                      value={dossier.informationAides.nombrePersonne} 
                      onChange={(e) => {
                        const value = e.target.value;
                        setDossier({ 
                          ...dossier, 
                          informationAides: { ...dossier.informationAides, nombrePersonne: value },
                          informationFiscale: { ...dossier.informationFiscale, nombrePersonnesFoyer: value }
                        });
                      }} 
                      placeholder="Ex: 4" 
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    {dossierErrors["informationAides.nombrePersonne"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.nombrePersonne"]}</p>}
                  </div>
                  {/* Code postal (read-only) */}
                  <div>
                    <label htmlFor="codePostale" className="block text-sm font-medium text-gray-700">Code postal</label>
                    <input type="text" id="codePostale" value={dossier.informationAides.codePostale} readOnly className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2" />
                  </div>
                  {/* Zone climatique (read-only) */}
                  <div>
                    <label htmlFor="zoneClimatique" className="block text-sm font-medium text-gray-700">Zone</label>
                    <input type="text" id="zoneClimatique" value={dossier.informationAides.zoneClimatique} readOnly className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2" />
                    {dossierErrors["informationAides.zoneClimatique"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.zoneClimatique"]}</p>}
                  </div>
                  {/* Revenue Fiscal de Référence */}
                  <div>
                    <label htmlFor="rfr" className="block text-sm font-medium text-gray-700">Revenue Fiscal de Référence</label>
                    <input 
                      type="text" 
                      id="rfr" 
                      value={dossier.informationAides.rfr} 
                      onChange={(e) => {
                        const value = e.target.value;
                        setDossier({ 
                          ...dossier, 
                          informationAides: { ...dossier.informationAides, rfr: value },
                          informationFiscale: { ...dossier.informationFiscale, revenuFiscalReference: value }
                        });
                      }} 
                      placeholder="Entrez le RFR" 
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    {dossierErrors["informationAides.rfr"] && <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.rfr"]}</p>}
                  </div>
                  {/* MPR Color (read-only with visual indicator) */}
                  <div>
                    <label htmlFor="mprColor" className="block text-sm font-medium text-gray-700">
                      Ma Prime Renov Couleur
                    </label>
                    <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2">
                      <span
                        className={`font-semibold ${
                          dossier.informationAides.mprColor === "Bleu"
                            ? "text-blue-700"
                            : dossier.informationAides.mprColor === "Jaune"
                            ? "text-yellow-700"
                            : dossier.informationAides.mprColor === "Violet"
                            ? "text-purple-700"
                            : dossier.informationAides.mprColor === "Rose"
                            ? "text-pink-700"
                            : "text-gray-700"
                        }`}
                      >
                        {dossier.informationAides.mprColor}
                      </span>
                    </div>
                    {dossierErrors["informationAides.mprColor"] && (
                      <p className="mt-1 text-xs text-red-500">{dossierErrors["informationAides.mprColor"]}</p>
                    )}
                  </div>
                  {/* Eligible Badge */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">Eligible :</span>
                    {dossier.informationAides.eligible ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Eligible</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">Non Eligible</span>
                    )}
                  </div>
                  {/* Phase du projet */}
                  <div>
                    <label htmlFor="phaseProjet" className="block text-sm font-medium text-gray-700">Phase du projet</label>
                    <select id="phaseProjet" value={dossier.phaseProjet} onChange={(e) => setDossier({ ...dossier, phaseProjet: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Sélectionnez</option>
                      {phaseProjetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {dossierErrors.phaseProjet && <p className="mt-1 text-xs text-red-500">{dossierErrors.phaseProjet}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LE PROJET TAB */}
            {activeTab === "projet" && (
              <motion.div key="projet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Commentaires */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Commentaires</label>
                    <div className="border border-gray-300 rounded-lg p-4 h-40 overflow-y-auto bg-blue-50">
                      {contact.comments.map((comment, index) => (
                        <div key={index} className="mb-2">
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <p className="text-sm text-gray-800">{comment.text}</p>
                            <span className="block text-xs text-gray-500 text-right">{comment.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex">
                      <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Ajouter un commentaire..." className="flex-1 rounded-l-md border border-gray-300 bg-white shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <Button type="button" variant="primary" onClick={addComment}>Ajouter</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Modal for Avis d'Imposition Verification */}
            {showAvisModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>

                  {/* Modal content */}
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Vérifier un avis d&apos;imposition
                          </h3>
                          
                          {avisModalStep === 1 ? (
                          <div className="mt-4">
                            <p className="text-sm text-gray-700 mb-2">
                              Veuillez importer votre avis d&apos;imposition pdf ou photo.
                            </p>
                            <p className="text-xs text-gray-600 mb-4">
                              Seulement la première page de votre avis d&apos;imposition est nécessaire pour la vérification.
                            </p>
                            
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                              <p className="text-xs text-yellow-800">
                                <strong>Attention:</strong> Assurez-vous d&apos;insérer un document de qualité optimale. 
                                Le lecteur de documents Qhare permet de lire tous type de fichiers (photos, pdf) 
                                mais si la qualité du document est trop altérée, ou si le fichier est trop mal cadré, 
                                certaines informations seront susceptibles de ne pas être pré remplies lors du scan par le système.
                              </p>
                            </div>
                            
                            <div 
                              className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                              onDragOver={handleFileDragOver}
                              onDrop={handleFileDrop}
                            >
                              <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Télécharger un fichier</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleAvisFileUpload} />
                                  </label>
                                  <p className="pl-1">ou glisser-déposer</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG jusqu&apos;à 10MB</p>
                                
                                {uploadedAvisFile && (
                                  <p className="mt-2 text-sm text-green-600">
                                    Fichier sélectionné: {uploadedAvisFile.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          ) : (
                            <div className="mt-4">
                              <p className="text-sm text-gray-700 mb-4">
                                Veuillez remplir les champs manquants
                              </p>
                              
                              <div className="flex flex-col md:flex-row gap-6">
                                {/* Left column - Form fields */}
                                <div className="md:w-1/2">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label htmlFor="nomDeclarant" className="block text-sm font-medium text-gray-700">
                                        Nom du déclarant
                                      </label>
                                      <input
                                        type="text"
                                        id="nomDeclarant"
                                        value={extractedAvisInfo.nomDeclarant}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, nomDeclarant: value});
                                          // Sync with contact
                                          setContact(prev => ({...prev, lastName: value}));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="prenomDeclarant" className="block text-sm font-medium text-gray-700">
                                        Prénom du déclarant
                                      </label>
                                      <input
                                        type="text"
                                        id="prenomDeclarant"
                                        value={extractedAvisInfo.prenomDeclarant}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, prenomDeclarant: value});
                                          // Sync with contact
                                          setContact(prev => ({...prev, firstName: value}));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div className="sm:col-span-2">
                                      <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                        Adresse
                                      </label>
                                      <input
                                        type="text"
                                        id="adresse"
                                        value={extractedAvisInfo.adresse}
                                        onChange={(e) => setExtractedAvisInfo({...extractedAvisInfo, adresse: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700">
                                        Code postal
                                      </label>
                                      <input
                                        type="text"
                                        id="codePostal"
                                        value={extractedAvisInfo.codePostal}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, codePostal: value});
                                          // Update code postal in aides
                                          setDossier(prev => ({
                                            ...prev, 
                                            informationAides: { ...prev.informationAides, codePostale: value }
                                          }));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                                        Ville
                                      </label>
                                      <input
                                        type="text"
                                        id="ville"
                                        value={extractedAvisInfo.ville}
                                        onChange={(e) => setExtractedAvisInfo({...extractedAvisInfo, ville: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="departement" className="block text-sm font-medium text-gray-700">
                                        Département
                                      </label>
                                      <input
                                        type="text"
                                        id="departement"
                                        value={extractedAvisInfo.departement}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, departement: value});
                                          // Sync with contact and fiscal
                                          setContact(prev => ({...prev, department: value}));
                                          setDossier(prev => ({
                                            ...prev,
                                            informationFiscale: { 
                                              ...prev.informationFiscale, 
                                              departementBeneficiaire: value 
                                            }
                                          }));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="numeroFiscal" className="block text-sm font-medium text-gray-700">
                                        Numéro Fiscal
                                      </label>
                                      <input
                                        type="text"
                                        id="numeroFiscal"
                                        value={extractedAvisInfo.numeroFiscal}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, numeroFiscal: value});
                                          setDossier(prev => ({
                                            ...prev,
                                            informationFiscale: { ...prev.informationFiscale, numeroFiscal: value }
                                          }));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="referenceAvisFiscal" className="block text-sm font-medium text-gray-700">
                                        Référence avis Fiscal
                                      </label>
                                      <input
                                        type="text"
                                        id="referenceAvisFiscal"
                                        value={extractedAvisInfo.referenceAvisFiscal}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, referenceAvisFiscal: value});
                                          setDossier(prev => ({
                                            ...prev,
                                            informationFiscale: { ...prev.informationFiscale, referenceAvis: value }
                                          }));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="revenuFiscalReference" className="block text-sm font-medium text-gray-700">
                                        Revenu fiscal de référence
                                      </label>
                                      <input
                                        type="text"
                                        id="revenuFiscalReference"
                                        value={extractedAvisInfo.revenuFiscalReference}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, revenuFiscalReference: value});
                                          // Sync with fiscal and aides
                                          setDossier(prev => ({
                                            ...prev,
                                            informationFiscale: { ...prev.informationFiscale, revenuFiscalReference: value },
                                            informationAides: { ...prev.informationAides, rfr: value }
                                          }));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="nombreParts" className="block text-sm font-medium text-gray-700">
                                        Nombre de parts
                                      </label>
                                      <input
                                        type="text"
                                        id="nombreParts"
                                        value={extractedAvisInfo.nombreParts}
                                        onChange={(e) => setExtractedAvisInfo({...extractedAvisInfo, nombreParts: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="nombrePersonnesFoyer" className="block text-sm font-medium text-gray-700">
                                        Nombre de personnes dans le foyer
                                      </label>
                                      <input
                                        type="text"
                                        id="nombrePersonnesFoyer"
                                        value={extractedAvisInfo.nombrePersonnesFoyer}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setExtractedAvisInfo({...extractedAvisInfo, nombrePersonnesFoyer: value});
                                          // Sync with fiscal and aides
                                          setDossier(prev => ({
                                            ...prev,
                                            informationFiscale: { ...prev.informationFiscale, nombrePersonnesFoyer: value },
                                            informationAides: { ...prev.informationAides, nombrePersonne: value }
                                          }));
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Right column - Document preview */}
                                <div className="md:w-1/2 mt-6 md:mt-0">
                                  <div className="border border-gray-300 rounded-md p-2 h-full">
                                    <div className="flex flex-col h-full">
                                      <p className="text-sm font-medium text-gray-700 mb-2">Aperçu du document</p>
                                      <div className="relative bg-gray-100 flex-grow flex items-center justify-center overflow-hidden rounded" style={{ minHeight: '500px' }}>
                                        {filePreviewUrl ? (
                                          fileType.startsWith('image/') ? (
                                            // For image files
                                            <img 
                                              src={filePreviewUrl} 
                                              alt="Aperçu de l'avis d'imposition" 
                                              className="max-w-full max-h-full object-contain"
                                            />
                                          ) : fileType === 'application/pdf' ? (
                                            // For PDF files
                                            <object
                                              data={filePreviewUrl}
                                              type="application/pdf"
                                              width="100%"
                                              height="100%"
                                              className="w-full h-full min-h-[500px]"
                                            >
                                              <p>Le navigateur ne peut pas afficher ce PDF. <a href={filePreviewUrl} target="_blank" rel="noreferrer">Cliquez ici pour l&apos;ouvrir</a></p>
                                            </object>
                                          ) : (
                                            // For other file types
                                            <div className="text-center p-4">
                                              <p className="text-gray-800 font-medium">Fichier sélectionné: {uploadedAvisFile?.name}</p>
                                              <p className="text-gray-500 text-sm mt-2">Le type de fichier ({fileType}) ne peut pas être prévisualisé.</p>
                                              <a 
                                                href={filePreviewUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                              >
                                                Ouvrir le fichier
                                              </a>
                                            </div>
                                          )
                                        ) : (
                                          <p className="text-gray-500 text-sm">Aucun document disponible</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      {avisModalStep === 1 ? (
                        <Button 
                          variant="primary" 
                          type="button" 
                          onClick={goToVerifyStep}
                          disabled={!uploadedAvisFile}
                        >
                          Suivant
                        </Button>
                      ) : (
                        <Button 
                          variant="primary" 
                          type="button" 
                          onClick={insertAvisInfo}
                        >
                          Insérer les informations
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={closeAvisModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

            {/* Final Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              {currentTabIndex > 0 && <Button variant="outline" onClick={goToPreviousTab} disabled={isSubmitting}>Précédent</Button>}
              {activeTab !== "projet" ? (
                <Button variant="primary" onClick={goToNextTab} disabled={isSubmitting}>Suivant</Button>
              ) : (
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
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
