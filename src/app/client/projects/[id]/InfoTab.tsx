"use client";

import { useState, useEffect } from "react";

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

  // Fetch the assigned team (charge de compte) details if available.
  useEffect(() => {
    if (dossier.assignedTeam) {
      fetch(`/api/users?id=${dossier.assignedTeam}`)
        .then((res) => res.json())
        .then((data: User) => {
          setAssignedTeamUser(data);
        })
        .catch((err) => {
          console.error("Error fetching assigned team user:", err);
        });
    }
  }, [dossier.assignedTeam]);

  return (
    <div
      className="p-8 bg-white rounded-2xl shadow-2xl border border-transparent bg-clip-padding"
      style={{
        backgroundImage:
          "linear-gradient(white, white), linear-gradient(135deg, #bfddf9, #d2fcb2)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Détails du Projet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Projet</p>
            <p className="mt-1 text-xl font-semibold text-gray-700">
              {Array.isArray(dossier.projet)
                ? dossier.projet.join(", ")
                : dossier.projet}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Solution</p>
            <p className="mt-1 text-xl font-semibold text-gray-700">{dossier.solution}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Surface Chauffée</p>
            <p className="mt-1 text-xl font-semibold text-gray-700">
              {dossier.surfaceChauffee} m²
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Type de Compteur</p>
            <p className="mt-1 text-xl font-semibold text-gray-700">
              {dossier.typeCompteurElectrique}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Année de Construction
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-700">
              {dossier.anneeConstruction}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Type de Logement
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-700">
              {dossier.typeDeLogement}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Profil</p>
            <p className="mt-1 text-xl font-semibold text-gray-700">
              {dossier.profil}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Nombre de Personnes
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-700">
              {dossier.nombrePersonne}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Code Postal
          </p>
          <p className="mt-1 text-xl font-semibold text-gray-700">
            {dossier.codePostal}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Couleur MPR
          </p>
          <p className="mt-1 text-xl font-semibold text-gray-700">
            {dossier.mprColor}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500 uppercase tracking-wider">
          Étape du dossier
        </p>
        <p className="mt-1 text-2xl font-semibold text-gray-700">
          {dossier.etape}
        </p>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500 uppercase tracking-wider">
          Type de Travaux
        </p>
        <p className="mt-1 text-2xl font-semibold text-gray-700">
          {dossier.typeTravaux}
        </p>
      </div>

      {/* Assigned Team (Charge de compte) Section */}
      {assignedTeamUser && (
        <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
            Chargé de compte
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {assignedTeamUser.firstName.charAt(0)}
                {assignedTeamUser.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-700">
                {assignedTeamUser.firstName} {assignedTeamUser.lastName}
              </p>
              <p className="text-sm text-gray-500">{assignedTeamUser.role}</p>
              <p className="text-sm text-gray-500">{assignedTeamUser.email}</p>
              <p className="text-sm text-gray-500">{assignedTeamUser.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
