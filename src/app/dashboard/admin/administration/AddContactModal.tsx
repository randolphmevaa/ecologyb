"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { INewUser } from "@/types/INewUser";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (newUser: INewUser) => void;
}

export function AddContactModal({ isOpen, onClose, onUserAdded }: AddContactModalProps) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      return "Ce champ est requis";
    }
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      return "Veuillez entrer un email valide";
    }
    return "";
  };

  const handleBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {
      prenom: validateField("prenom", prenom),
      nom: validateField("nom", nom),
      email: validateField("email", email),
      telephone: validateField("telephone", telephone),
      role: validateField("role", role),
      gender: validateField("gender", gender),
    };
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    const endpoint = role === "Client / Customer (Client Portal)" ? "/api/contacts" : "/api/users";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: prenom,
          lastName: nom,
          email,
          phone: telephone,
          role,
          gender, // Save selected gender
        }),
      });
      const data = await response.json();
      console.log(data);
      setIsSubmitting(false);
      onUserAdded(data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <FocusLock>
          <motion.div
            className="relative bg-white rounded-xl shadow-2xl z-10 w-full max-w-lg p-8 mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                Ajouter un client
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Fermer la fenêtre modale"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-5">
                {/* Prénom */}
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    onBlur={(e) => handleBlur("prenom", e.target.value)}
                    placeholder="Entrez le prénom"
                    required
                    autoFocus
                    className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.prenom ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                </div>

                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onBlur={(e) => handleBlur("nom", e.target.value)}
                    placeholder="Entrez le nom"
                    required
                    className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.nom ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    placeholder="Entrez l'email"
                    required
                    className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    onBlur={(e) => handleBlur("telephone", e.target.value)}
                    placeholder="Entrez le numéro de téléphone"
                    required
                    className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.telephone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                </div>

                {/* Rôle */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onBlur={(e) => handleBlur("role", e.target.value)}
                    required
                    className={`mt-1 block w-full rounded-md border p-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
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
                    <option value="Client / Customer (Client Portal)">
                      Client (portail client)
                    </option>
                    <option value="Super Admin">Super administrateur</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Genre
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    onBlur={(e) => handleBlur("gender", e.target.value)}
                    required
                    className={`mt-1 block w-full rounded-md border p-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Sélectionnez un genre</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Annuler
                </Button>
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
                    "Ajouter"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </FocusLock>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
