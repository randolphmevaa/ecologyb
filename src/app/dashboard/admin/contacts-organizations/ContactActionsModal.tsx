// ContactActionsModal.tsx
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

/**
 * The canonical Contact interface used throughout your app.
 */
export interface Contact {
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
}

interface ContactActionsModalProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactActionsModal({ onClose }: ContactActionsModalProps) {
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
            <h2 className="text-xl font-bold">Actions pour ce contact</h2>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <ul className="space-y-2">
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Edit this contact"); onClose(); }}
              >
                <PencilIcon className="h-4 w-4" />
                Modifier ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Change contact image"); onClose(); }}
              >
                <PhotoIcon className="h-4 w-4" />
                Changer l&apos;image du contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Delete this contact"); onClose(); }}
              >
                <TrashIcon className="h-4 w-4" />
                Supprimer ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Clone this contact"); onClose(); }}
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                Cloner ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Add to marketing list"); onClose(); }}
              >
                <ClipboardDocumentListIcon className="h-4 w-4" />
                Ajouter à la liste marketing
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Change contact to lead"); onClose(); }}
              >
                <UserPlusIcon className="h-4 w-4" />
                Transformer ce contact en prospect
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Print this contact"); onClose(); }}
              >
                <PrinterIcon className="h-4 w-4" />
                Imprimer ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Add new tasks for contact"); onClose(); }}
              >
                <ClipboardDocumentCheckIcon className="h-4 w-4" />
                Ajouter de nouvelles tâches pour ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Add new event for contact"); onClose(); }}
              >
                <CalendarIcon className="h-4 w-4" />
                Ajouter un nouvel événement pour ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Add activity set for contact"); onClose(); }}
              >
                <Squares2X2Icon className="h-4 w-4" />
                Ajouter un ensemble d&apos;activités pour ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Add new opportunity for contact"); onClose(); }}
              >
                <BriefcaseIcon className="h-4 w-4" />
                Ajouter une nouvelle opportunité pour ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Add new project for contact"); onClose(); }}
              >
                <FolderIcon className="h-4 w-4" />
                Ajouter un nouveau projet pour ce contact
              </button>
            </li>
            <li>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => { console.log("Convert contact to organization"); onClose(); }}
              >
                <OrgBuildingIcon className="h-4 w-4" />
                Convertir ce contact en organisation
              </button>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
