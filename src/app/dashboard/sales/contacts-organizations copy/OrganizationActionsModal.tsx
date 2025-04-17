// OrganizationActionsModal.tsx
"use client";

import React from "react";
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

// Define the Organization interface (extend as needed)
export interface Organization {
  id: number;
  name: string;
  email?: string;
  phone: string;
  billingStreet: string;
  billingCity: string;
  // Add any additional fields required for organizations
  suivi: boolean;
}

interface OrganizationActionsModalProps {
  organization: Organization;
  onClose: () => void;
}

export function OrganizationActionsModal({
  // organization,
  onClose,
}: OrganizationActionsModalProps) {
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
          className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Actions pour cette organisation</h2>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <ul className="space-y-2">
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Modifier cette organisation");
                  onClose();
                }}
              >
                <PencilIcon className="h-4 w-4" />
                Modifier cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Changer l'image de l'organisation");
                  onClose();
                }}
              >
                <PhotoIcon className="h-4 w-4" />
                Changer l&apos;image de l&apos;organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Supprimer cette organisation");
                  onClose();
                }}
              >
                <TrashIcon className="h-4 w-4" />
                Supprimer cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Cloner cette organisation");
                  onClose();
                }}
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                Cloner cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Ajouter à la liste marketing");
                  onClose();
                }}
              >
                <ClipboardDocumentListIcon className="h-4 w-4" />
                Ajouter à la liste marketing
              </button>
            </li>
            <li>
              {/* For organizations you might want a different conversion action.
                  Here we mimic the contact modal by converting the organization to a contact. */}
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Convertir cette organisation en contact");
                  onClose();
                }}
              >
                <UserPlusIcon className="h-4 w-4" />
                Convertir cette organisation en contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Imprimer cette organisation");
                  onClose();
                }}
              >
                <PrinterIcon className="h-4 w-4" />
                Imprimer cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Ajouter de nouvelles tâches pour cette organisation");
                  onClose();
                }}
              >
                <ClipboardDocumentCheckIcon className="h-4 w-4" />
                Ajouter de nouvelles tâches pour cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Ajouter un nouvel événement pour cette organisation");
                  onClose();
                }}
              >
                <CalendarIcon className="h-4 w-4" />
                Ajouter un nouvel événement pour cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Ajouter un ensemble d'activités pour cette organisation");
                  onClose();
                }}
              >
                <Squares2X2Icon className="h-4 w-4" />
                Ajouter un ensemble d&apos;activités pour cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Ajouter une nouvelle opportunité pour cette organisation");
                  onClose();
                }}
              >
                <BriefcaseIcon className="h-4 w-4" />
                Ajouter une nouvelle opportunité pour cette organisation
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Ajouter un nouveau projet pour cette organisation");
                  onClose();
                }}
              >
                <FolderIcon className="h-4 w-4" />
                Ajouter un nouveau projet pour cette organisation
              </button>
            </li>
            <li>
              {/* Optionally you can add another conversion action if needed */}
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  console.log("Convertir cette organisation en contact");
                  onClose();
                }}
              >
                <OrgBuildingIcon className="h-4 w-4" />
                Convertir cette organisation en contact
              </button>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
