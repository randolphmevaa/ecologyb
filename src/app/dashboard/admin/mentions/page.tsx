"use client";

import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  // ArrowRightIcon,
  // ArrowLeftIcon,
  XMarkIcon,
  PencilIcon,
  // CheckIcon,
  // InformationCircleIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

/**
 * Page: Mentions légales sur devis
 * Mirrors the styling & layout from your "Administration" UI,
 * but specifically for editing mentions légales sur devis/factures,
 * now with improved input UI and a "Téléverser un PDF" section.
 */
export default function MentionsLegalesDevis() {
  // State for each of the mention fields
  const [mentions, setMentions] = useState({
    // The snippet you shared, stored in state
    escompte: "Escompte pour règlement anticipé: 0%",
    retard:
      "En cas de retard de paiement, une pénalité égale à 3 fois le taux d'intérêt légal sera exigible (Arrêté du 26 décembre 2021 - article L.441-10 du Code de Commerce)",
    indemnites:
      "Pour les professionnels, une indemnité forfaitaire de 40€ pour frais de recouvrement sera exigible (article D. 441-5 du Code de commerce)",
    aPropos: `À propos des mentions légales sur factures
Les mentions légales sur vos factures sont obligatoires selon la législation française. Elles doivent notamment inclure les informations sur les pénalités de retard, les conditions d'escompte et l'indemnité forfaitaire pour frais de recouvrement. Ces mentions permettent de protéger juridiquement votre entreprise en cas de litige et informent vos clients de leurs obligations.
`,
    autresMentions: `Autres mentions obligatoires

Entreprises en franchise de TVA
"TVA non applicable, art. 293 B du CGI"

Auto-entrepreneurs
"Dispensé d'immatriculation au registre du commerce et des sociétés (RCS) et au répertoire des métiers (RM)"

Médiateur à la consommation
"En cas de litige, vous pouvez déposer votre réclamation sur [site du médiateur]"

Société avec un capital social
"[Forme juridique] au capital de [montant] euros - [RCS et numéro]"
`,
  });

  // Store the initial text so we can reset easily if needed
  const defaultMentions = { ...mentions };

  // PDF upload states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>(""); // to show user

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  // Text changes
  const handleChange = (field: keyof typeof mentions, value: string) => {
    setMentions((prev) => ({ ...prev, [field]: value }));
  };

  // Reset text to defaults
  const handleReset = () => {
    setMentions({ ...defaultMentions });
    setPdfFile(null);
    setPdfFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Save changes
  const handleSave = () => {
    // In a real app, call your API or do something with pdfFile + mentions
    console.log("Mentions légales enregistrées:", mentions);
    if (pdfFile) {
      console.log("PDF file to upload:", pdfFile);
    }
    alert("Modifications enregistrées !");
  };

  // Cancel changes
  const handleCancel = () => {
    console.log("Annuler clicked");
    // Possibly revert or navigate away
    // setMentions({ ...defaultMentions });
    // setPdfFile(null);
    // setPdfFileName("");
  };

  // File input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setPdfFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- Render ---

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
      {/* Top Header (like your Administration page) */}
      <Header />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Big heading (similar to Administration page) */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#bfddf9] to-[#d2fcb2] rounded-full" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">
                Mentions légales sur devis
              </h1>
              <p className="text-[#213f5b] opacity-75 pl-2">
                Mode édition activé. Vous pouvez modifier les mentions légales.
              </p>
              <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Card: Mentions légales des factures */}
          <motion.div
            className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-[0_15px_35px_-15px_rgba(33,63,91,0.15)] border border-[#f0f0f0] p-6 md:p-8 mb-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 border-b border-[#eaeaea] pb-2">
              <h2 className="text-xl font-bold text-[#213f5b] mb-1">
                Mentions légales des factures
              </h2>
              <p className="text-sm text-[#213f5b] opacity-75">
                Vous pouvez personnaliser les mentions obligatoires de vos
                factures
              </p>
            </div>

            {/* Mentions obligatoires de bas de page */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#213f5b] mb-4">
                Mentions obligatoires de bas de page
              </h3>

              <Button
                variant="outline"
                onClick={handleReset}
                className="mb-4 border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] hover:text-[#213f5b] transition-colors px-4 py-2 rounded-xl"
              >
                Réinitialiser
              </Button>

              {/* Escompte */}
              <div className="mb-5">
                <label
                  htmlFor="escompte"
                  className="block font-medium text-sm mb-1 text-[#213f5b]"
                >
                  Escompte pour règlement anticipé
                </label>
                <textarea
                  id="escompte"
                  rows={2}
                  value={mentions.escompte}
                  onChange={(e) => handleChange("escompte", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm
                             focus:outline-none focus:ring-1 focus:ring-[#bfddf9] focus:border-[#bfddf9]
                             hover:border-[#bfddf9] transition-colors"
                />
              </div>

              {/* Pénalités de retard */}
              <div className="mb-5">
                <label
                  htmlFor="retard"
                  className="block font-medium text-sm mb-1 text-[#213f5b]"
                >
                  Pénalités de retard
                </label>
                <textarea
                  id="retard"
                  rows={3}
                  value={mentions.retard}
                  onChange={(e) => handleChange("retard", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm
                             focus:outline-none focus:ring-1 focus:ring-[#bfddf9] focus:border-[#bfddf9]
                             hover:border-[#bfddf9] transition-colors"
                />
              </div>

              {/* Indemnités de recouvrement */}
              <div className="mb-5">
                <label
                  htmlFor="indemnites"
                  className="block font-medium text-sm mb-1 text-[#213f5b]"
                >
                  Indemnités de recouvrement
                </label>
                <textarea
                  id="indemnites"
                  rows={2}
                  value={mentions.indemnites}
                  onChange={(e) => handleChange("indemnites", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm
                             focus:outline-none focus:ring-1 focus:ring-[#bfddf9] focus:border-[#bfddf9]
                             hover:border-[#bfddf9] transition-colors"
                />
              </div>
            </div>

            {/* A propos des mentions légales */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-[#213f5b] mb-4">
                À propos des mentions légales sur factures
              </h4>
              <textarea
                rows={6}
                value={mentions.aPropos}
                onChange={(e) => handleChange("aPropos", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm
                           focus:outline-none focus:ring-1 focus:ring-[#bfddf9] focus:border-[#bfddf9]
                           hover:border-[#bfddf9] transition-colors"
              />
            </div>

            {/* Autres mentions obligatoires */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-[#213f5b] mb-4">
                Autres mentions obligatoires
              </h4>
              <textarea
                rows={10}
                value={mentions.autresMentions}
                onChange={(e) => handleChange("autresMentions", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm
                           focus:outline-none focus:ring-1 focus:ring-[#bfddf9] focus:border-[#bfddf9]
                           hover:border-[#bfddf9] transition-colors"
              />
            </div>

            {/* PDF Upload Section */}
            <div className="mb-6 border-t border-[#eaeaea] pt-4">
              <h4 className="text-lg font-semibold text-[#213f5b] mb-2 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-[#213f5b]" />
                Téléverser un PDF (facultatif)
              </h4>
              <p className="text-sm text-[#213f5b] opacity-75 mb-3">
                Joignez un document PDF à vos mentions légales si nécessaire.
              </p>

              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {!pdfFile && (
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-[#bfddf9] hover:border-[#213f5b] rounded-xl p-6 cursor-pointer transition-colors"
                  onClick={handleUploadClick}
                >
                  <DocumentArrowUpIcon className="h-12 w-12 text-[#213f5b] mb-2" />
                  <p className="text-sm text-[#213f5b]">
                    Cliquez ou glissez votre PDF ici
                  </p>
                </div>
              )}

              {pdfFile && (
                <div className="flex items-center justify-between border border-[#eaeaea] bg-[#f8fafc] p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-[#213f5b]" />
                    <span className="text-sm text-[#213f5b] font-medium">
                      {pdfFileName}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleUploadClick}
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg text-sm px-3 py-1 flex items-center"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Changer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRemoveFile}
                      className="border-red-300 text-red-500 hover:bg-red-100 transition-colors rounded-lg text-sm px-3 py-1 flex items-center"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bottom Action Buttons */}
          <motion.div
            className="rounded-2xl bg-white backdrop-blur-sm bg-opacity-95 shadow-[0_15px_35px_-15px_rgba(33,63,91,0.15)] border border-[#f0f0f0] p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-sm text-[#213f5b] opacity-80">
              Mode édition actif. <br className="block sm:hidden" />
              <span className="sm:ml-1">
                Vous pouvez modifier le contenu et téléverser un PDF.
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] hover:text-[#213f5b] transition-colors px-5 py-2.5 rounded-xl"
              >
                Annuler
              </Button>

              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] text-white hover:from-[#152a3d] hover:to-[#2d5e8e] transition-colors px-7 py-3 rounded-xl shadow-md hover:shadow-lg"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
