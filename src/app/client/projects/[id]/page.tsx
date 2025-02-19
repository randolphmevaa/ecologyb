"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams  } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import UpdatedHeader from "./UpdatedHeader";
import PremiumTabs from "./PremiumTabs";
import InfoTab from "./InfoTab";
import PhotoTab from "./PhotoTab";
import ChatTab from "./ChatTab";
import SavTab from "./SavTab";
import DocumentsTab from "./DocumentsTab";
import ChatWidget from "@/components/ChatWidget"; // Adjust the path as needed

// Helper: extract current step number from dossier.etape string.
const getCurrentStep = (etape?: string): number => {
  if (!etape) return 1;
  const match = etape.match(/^(\d+)/);
  return match ? Number(match[1]) : 1;
};

// ------------------------
// Types
// ------------------------

interface Dossier {
  _id: string;
  surfaceChauffee: string;
  typeCompteurElectrique: string;
  anneeConstruction: string;
  typeDeLogement: string;
  profil: string;
  nombrePersonne: string;
  codePostal: string;
  mprColor: string;
  typeTravaux: string;
  contactId?: string;
  numero: string;
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam?: string;
  notes?: string;
  nombrePersonnes: string;
  informationLogement?: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
  };
  informationTravaux?: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
}

interface DossierFormData {
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam: string;
  notes: string;
  nombrePersonnes: string;
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
}

interface User {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface DocumentApiResponse {
  _id: string;
  type: string;
  date: string;
  statut: string;
  filePath?: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  // const router = useRouter();

  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  // In client portal, editing is disabled so we don't allow modifications.
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "photo" | "chat" | "sav">("info");
  const [formData, setFormData] = useState<DossierFormData>({
    client: "",
    projet: "",
    solution: "",
    etape: "",
    valeur: "",
    assignedTeam: "",
    notes: "",
    nombrePersonnes: "",
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
  });
  const [userList, setUserList] = useState<User[]>([]);
  const [chatMessageCount] = useState(3);
  // New state: documentCount to show the number of documents with status "Manquant"
  const [documentCount, setDocumentCount] = useState(0);
  // New state: Control the floating ChatWidget.
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  // If URL contains a ?tab=documents parameter, switch to that tab and scroll down.
  useEffect(() => {
    if (searchParams.get("tab") === "documents") {
      setActiveTab("documents");
      setTimeout(() => {
        const documentsSection = document.getElementById("documents");
        documentsSection?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);

  // Fetch the dossier details based on the dynamic id.
  useEffect(() => {
    if (id) {
      fetch(`/api/dossiers/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDossier(data);
          // For client portal, formData remains read-only.
          setFormData({
            client: data.client,
            projet: data.projet,
            solution: data.solution,
            etape: data.etape,
            valeur: data.valeur,
            assignedTeam: data.assignedTeam || "",
            notes: data.notes || "",
            nombrePersonnes: data.nombrePersonnes,
            informationLogement: data.informationLogement || {
              typeDeLogement: "",
              surfaceHabitable: "",
              anneeConstruction: "",
              systemeChauffage: "",
            },
            informationTravaux: data.informationTravaux || {
              typeTravaux: "",
              typeUtilisation: "",
              surfaceChauffee: "",
              circuitChauffageFonctionnel: "",
            },
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du dossier :", error);
          setLoading(false);
        });
    }
  }, [id]);

  // Fetch a list of users (if needed for view-only display)
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des utilisateurs :", error)
      );
  }, []);

  // Fetch document count (status "Manquant") based on dossier.contactId.
  useEffect(() => {
    if (dossier?.contactId) {
      fetch(`/api/documents?contactId=${dossier.contactId}`)
        .then((res) => res.json())
        .then((data: DocumentApiResponse[]) => {
          const count = data.filter((doc) => doc.statut === "Manquant").length;
          setDocumentCount(count);
        })
        .catch((err) => console.error("Error fetching documents:", err));
    }
  }, [dossier?.contactId]);

  // In a client portal, editing is disabled so these handlers do nothing.
  const handleInputChange = (
    // e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {};
  const handleNestedInputChange = (
    // e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    // section: "informationLogement" | "informationTravaux"
  ) => {};
  const handleSave = () => {};
  const handleCancel = () => {};
  // For client portal, disable step click (progress bar is display-only)
  // const handleStepClick = () => {};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg font-semibold">Chargement...</p>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg font-semibold">Dossier non trouvé</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white relative">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          {/* Animated Background Shapes */}
          <div className="relative">
            <svg
              className="absolute left-0 top-0 w-72 h-72 opacity-50 z-0"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path fill="#bfddf9">
                <animate
                  attributeName="d"
                  dur="4s"
                  repeatCount="indefinite"
                  values="
                    M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z;
                    M420,290Q360,320,330,370Q300,420,260,410Q220,400,190,360Q160,320,150,270Q140,220,170,190Q200,160,250,150Q300,140,350,160Q400,180,420,210Q440,240,420,290Z;
                    M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z
                  "
                />
              </path>
            </svg>
            <svg
              className="absolute inset-0 w-full h-full z-0"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path fill="#bfddf9">
                <animate
                  attributeName="d"
                  dur="5s"
                  repeatCount="indefinite"
                  values="
                    M428.5,283.5Q371,317,338,367.5Q305,418,258.5,428.5Q212,439,166,412Q120,385,97.5,337.5Q75,290,86.5,240Q98,190,131,150.5Q164,111,214,97.5Q264,84,313.5,87Q363,90,406,123.5Q449,157,428.5,283.5Z;
                    M421.5,293.5Q371,337,327,379.5Q283,422,239.5,403Q196,384,160,363.5Q124,343,99.5,299Q75,255,86.5,205.5Q98,156,134,121.5Q170,87,221,90Q272,93,314.5,103.5Q357,114,407,153.5Q457,193,421.5,293.5Z;
                    M428.5,283.5Q371,317,338,367.5Q305,418,258.5,428.5Q212,439,166,412Q120,385,97.5,337.5Q75,290,86.5,240Q98,190,131,150.5Q164,111,214,97.5Q264,84,313.5,87Q363,90,406,123.5Q449,157,428.5,283.5Z
                  "
                />
              </path>
            </svg>
            <svg
              className="absolute right-0 bottom-0 w-80 h-80 opacity-40 z-0"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path fill="#d2fcb2">
                <animate
                  attributeName="d"
                  dur="4s"
                  repeatCount="indefinite"
                  values="
                    M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z;
                    M430,290Q390,330,350,370Q310,410,270,370Q230,330,190,290Q230,250,270,210Q310,170,350,210Q390,250,430,290Z;
                    M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z
                  "
                />
              </path>
            </svg>
            <svg
              className="absolute right-0 top-0 w-64 h-64 opacity-40 z-0"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path fill="#ffcccb">
                <animate
                  attributeName="d"
                  dur="4s"
                  repeatCount="indefinite"
                  values="
                    M400,80 Q440,140,380,220 Q320,300,280,220 Q240,140,280,80 Q320,20,380,60 Q440,100,400,80Z;
                    M410,90 Q450,150,390,230 Q330,310,290,230 Q250,150,290,90 Q330,30,390,70 Q450,110,410,90Z;
                    M400,80 Q440,140,380,220 Q320,300,280,220 Q240,140,280,80 Q320,20,380,60 Q440,100,400,80Z
                  "
                />
              </path>
            </svg>
            <svg
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 opacity-30 z-0"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path fill="#add8e6">
                <animate
                  attributeName="d"
                  dur="6s"
                  repeatCount="indefinite"
                  values="
                    M240,40 Q300,110,240,180 Q180,250,120,180 Q60,110,120,40 Q180,-30,240,40Z;
                    M250,50 Q310,120,250,190 Q190,260,130,190 Q70,120,130,50 Q190,-20,250,50Z;
                    M240,40 Q300,110,240,180 Q180,250,120,180 Q60,110,120,40 Q180,-30,240,40Z
                  "
                />
              </path>
            </svg>
            <svg
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-48 opacity-30 z-0"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path fill="#d8bfd8">
                <animate
                  attributeName="d"
                  dur="6s"
                  repeatCount="indefinite"
                  values="
                    M240,440 Q300,390,240,340 Q180,290,120,340 Q60,390,120,440 Q180,490,240,440Z;
                    M250,450 Q310,400,250,350 Q190,300,130,350 Q70,400,130,450 Q190,500,250,450Z;
                    M240,440 Q300,390,240,340 Q180,290,120,340 Q60,390,120,440 Q180,490,240,440Z
                  "
                />
              </path>
            </svg>

            {/* Content Overlay */}
            <div className="relative z-10">
              <div className="mb-6">
                <Link
                  href="/client/projects"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-2" />
                  Retour à la liste des projets
                </Link>
              </div>
              <UpdatedHeader contactId={dossier.contactId || ""} />
              {/* Read-only StepProgress – clicks are disabled */}
              <StepProgress currentStep={getCurrentStep(dossier.etape)} onStepClick={() => {}} />
            </div>
          </div>

          {/* Premium Tabs (read-only for client portal) */}
          <PremiumTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            chatMessageCount={chatMessageCount}
            documentCount={documentCount}
          />

          {activeTab === "info" && (
            <div id="info">
              <InfoTab
                dossier={dossier}
                formData={formData}
                isEditing={false} // Read-only mode
                setIsEditing={() => {}}
                handleInputChange={handleInputChange}
                handleNestedInputChange={handleNestedInputChange}
                userList={userList}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            </div>
          )}
          {activeTab === "documents" && (
            <div id="documents">
              <DocumentsTab contactId={dossier.contactId || ""} />
            </div>
          )}
          {activeTab === "photo" && (
            <div id="photo">
              <PhotoTab contactId={dossier.contactId || ""} />
            </div>
          )}
          {activeTab === "chat" && (
            <div id="chat" className="h-full">
              <ChatTab />
            </div>
          )}
          {activeTab === "sav" && (
            <div id="sav" className="h-full">
              <SavTab contactId={dossier.contactId || ""} />
            </div>
          )}
        </main>
      </div>

      {/* Floating Chat Widget Button */}
      <button
        onClick={() => setIsChatWidgetOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg"
      >
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
      </button>
      {isChatWidgetOpen && <ChatWidget onClose={() => setIsChatWidgetOpen(false)} />}
    </div>
  );
}

// ------------------------
// StepProgress Component (Display-only for Client Portal)
// ------------------------

interface StepProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    "Prise de contact",
    "En attente des documents",
    "Instruction du dossier",
    "Dossier Accepter",
    "Installation",
    "Contrôle",
    "Dossier clôturé",
  ];
  const stepWeights = [1, 1.25, 1.6, 1.5, 1.4, 2, 1];
  const totalWeight = stepWeights.reduce((sum, weight) => sum + weight, 0);
  const currentWeight = stepWeights.slice(0, currentStep).reduce((sum, weight) => sum + weight, 0);
  const progressPercent = (currentWeight / totalWeight) * 100;
  return (
    <div className="relative px-6 py-10 select-none">
      <div className="relative flex items-center justify-between pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 shadow-inner" />
        <motion.div
          className="absolute top-1/2 left-0 h-6 bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 rounded-full transform -translate-y-1/2 shadow-md"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          return (
            <div key={stepNumber} className="flex flex-col items-center relative">
              <motion.div
                className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-colors duration-300 shadow-xl ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : isCurrent
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <span className={`text-base font-semibold ${isCurrent ? "text-white" : "text-gray-500"}`}>
                    {stepNumber}
                  </span>
                )}
              </motion.div>
              <motion.div
                className={`mt-2 text-center text-xs font-medium ${
                  isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
