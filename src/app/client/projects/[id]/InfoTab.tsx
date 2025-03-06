"use client";

import {  CalendarIcon, EnvelopeIcon, HomeIcon, LightBulbIcon, PhoneIcon, UserCircleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { motion } from "framer-motion";
import Image from "next/image";

interface Dossier {
  _id: string;
  contactId?: string;
  numero: string;
  assignedTeam?: string;
  projet: string[] | string;
  surfaceChauffee: string;
  typeCompteurElectrique: string;
  solution: string;
  anneeConstruction: string;
  typeDeLogement: string;
  profil: string;
  nombrePersonne: string;
  codePostal: string;
  mprColor: string;
  etape: string;
  typeTravaux: string;
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
  gender: string;
  _id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  realPassword: string;
}

interface InfoTabUser {
  _id?: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  realPassword?: string;
}

interface InfoTabProps {
  dossier: Dossier;
  formData: DossierFormData;
  // For client portal, editing is disabled.
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleNestedInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: "informationLogement" | "informationTravaux"
  ) => void;
  userList: InfoTabUser[]; // Updated type from any[] to User[]
  handleSave: () => void;
  handleCancel: () => void;
}

export default function InfoTab({ dossier }: InfoTabProps) {
  const [assignedTeamUser, setAssignedTeamUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (dossier.assignedTeam) {
      fetch(`/api/users?id=${dossier.assignedTeam}`)
        .then((res) => res.json())
        .then((data: User) => setAssignedTeamUser(data))
        .catch(console.error);
    }
  }, [dossier.assignedTeam]);

  const getSolutionColor = (solution: string) => {
    const colors: { [key: string]: string } = {
      "Pompes à chaleur": "bg-blue-100 text-blue-800",
      "Chauffe-eau solaire individuel": "bg-yellow-100 text-yellow-800",
      "Chauffe-eau thermodynamique": "bg-green-100 text-green-800",
      "Système Solaire Combiné": "bg-purple-100 text-purple-800"
    };
    return colors[solution] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-8 bg-white rounded-[2rem] shadow-2xl border-2 border-transparent bg-clip-padding overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(white, white), linear-gradient(135deg, #bfddf950, #d2fcb250)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="relative z-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Détails du Projet</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                #{dossier.numero}
              </span>
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <motion.button
          onClick={() => router.push("/client/contacts")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-600 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Demander un nouveau projet
          </motion.button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <DetailCard
              icon={<LightBulbIcon className="w-6 h-6" />}
              title="Solutions Énergétiques"
            >
              <div className="flex flex-wrap gap-2">
                {dossier.solution.split(', ').map((solution) => (
                  <span
                    key={solution}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${getSolutionColor(solution)}`}
                  >
                    {solution}
                  </span>
                ))}
              </div>
            </DetailCard>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem 
                icon={<HomeIcon className="w-5 h-5" />}
                label="Surface Chauffée"
                value={`${dossier.surfaceChauffee} m²`}
              />
              <DetailItem
                icon={<WrenchScrewdriverIcon className="w-5 h-5" />}
                label="Type Compteur"
                value={dossier.typeCompteurElectrique}
              />
              <DetailItem
                icon={<CalendarIcon className="w-5 h-5" />}
                label="Année Construction"
                value={dossier.anneeConstruction}
              />
              <DetailItem
                icon={<UserCircleIcon className="w-5 h-5" />}
                label="Type Logement"
                value={dossier.typeDeLogement}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DetailCard
              icon={<div className="w-6 h-6" />} // Spacer
              title="Détails Complémentaires"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* <InfoPair label="Profil" value={dossier.profil} />
                <InfoPair label="Personnes" value={dossier.nombrePersonne} />
                <InfoPair label="Code Postal" value={dossier.codePostal} /> */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">MPR:</span>
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: getColorHex(dossier.mprColor) }}
                    />
                    <span className="font-medium">{dossier.mprColor}</span>
                  </div>
                </div>
              </div>
            </DetailCard>

            <div className="space-y-4">
              <StatusCard 
                title="Étape du dossier"
                value={dossier.etape}
                color="bg-blue-100 text-blue-800"
              />
              <StatusCard
                title="Type de Travaux"
                value={dossier.typeTravaux}
                color="bg-green-100 text-green-800"
              />
            </div>
          </div>
        </div>

        {/* Assigned Team Section */}
        {assignedTeamUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Chargé de Compte
            </h3>
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <Image
                    src={
                      assignedTeamUser.gender === 'Homme'
                        ? "https://www.advancia-teleservices.com/wp-content/uploads/2023/11/Centre-dappels-tunisie.jpg"
                        : "https://www.hotesse-interim.fr/ressources/images/ab4fec7ce0ed.jpg"
                    }
                    alt={`${assignedTeamUser.firstName} ${assignedTeamUser.lastName}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-1">
                  {assignedTeamUser.firstName} {assignedTeamUser.lastName}
                </h4>
                <p className="text-sm font-medium text-blue-600 mb-3">{assignedTeamUser.role}</p>
                <div className="flex flex-wrap gap-4">
                  <ContactLink
                    icon={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
                    value={assignedTeamUser.email}
                    type="email"
                  />
                  <ContactLink
                    icon={<PhoneIcon className="w-4 h-4 text-gray-400" />}
                    value={assignedTeamUser.phone}
                    type="tel"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Helper Components
const DetailCard = ({ icon, title, children }: { 
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const DetailItem = ({ icon, label, value }: { 
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="p-4 bg-gray-50 rounded-xl border border-gray-200"
  >
    <div className="flex items-center gap-2 text-gray-500 mb-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </motion.div>
);

const StatusCard = ({ title, value, color }: { 
  title: string;
  value: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className={`p-4 rounded-xl ${color} backdrop-blur-sm`}
  >
    <p className="text-sm font-medium text-gray-700">{title}</p>
    <p className="text-xl font-bold mt-1">{value}</p>
  </motion.div>
);

const ContactLink = ({ 
  icon, 
  value, 
  type,
  className = "" // Default to empty string
}: { 
  icon: React.ReactNode;
  value: string;
  type: 'email' | 'tel';
  className?: string; // Optional className prop
}) => (
  <a
    href={`${type}:${value}`}
    className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
  >
    {icon}
    <span className="text-sm font-medium">{value}</span>
  </a>
);

// Color mapping helper
const getColorHex = (mprColor: string) => {
  const colors: { [key: string]: string } = {
    Bleu: '#3b82f6',
    Jaune: '#eab308',
    Violet: '#8b5cf6',
    Rose: '#ec4899'
  };
  return colors[mprColor] || '#6b7280';
};
