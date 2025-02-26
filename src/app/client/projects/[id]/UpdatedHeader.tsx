"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon, PhoneIcon, UserIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface Contact {
  numeroDossier: string;
  mailingAddress?: string;
  firstName?: string;
  lastName?: string;
  maprNumero?: string;
  phone?: string;
}

export default function ClientHeader({ contactId }: { contactId: string }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/contacts/${contactId}`);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setContact(data);
        setTimeout(() => setMapLoaded(true), 500);
      } catch (error) {
        console.error("Échec du chargement des informations client:", error);
        setMapError(true);
      }
    };

    fetchData();
  }, [contactId]);

  // État de chargement amélioré avec un effet de scintillement
  if (!contact) return (
    <div className="h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="p-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-10 h-full">
        <div className="space-y-10">
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-20 mt-8 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-full bg-gray-100 rounded-[2rem] animate-pulse"></div>
      </div>
    </div>
  );

  const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  const initials = (contact.firstName?.[0] || '') + (contact.lastName?.[0] || '');
  const address = contact.mailingAddress || "60 Rue François 1er, Paris";
  const phone = contact.phone || "01 23 45 67 89";

  return (
    <div className="relative isolate group">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="relative bg-white/97 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100/90 shadow-2xl shadow-blue-100/30 overflow-hidden"
      >
        {/* Effet de brillance qui se déplace sur le card */}
        <motion.div 
          initial={{ x: -500, opacity: 0.5 }}
          animate={{ 
            x: 1000,
            opacity: [0.2, 0.4, 0.2],
            transition: { 
              repeat: Infinity, 
              duration: 5,
              ease: "linear",
              repeatDelay: 10
            }
          }}
          className="absolute -inset-10 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent skew-x-12 pointer-events-none"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-10 p-10">
          {/* Panneau Gauche */}
          <div className="space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <motion.div 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  className="text-xs font-semibold text-gray-500/90 uppercase tracking-[0.2em]"
                >
                  Profil Client
                </motion.div>
                <h1 className="text-5xl font-medium tracking-tight text-gray-900/95 leading-[1.1]">
                  {fullName.split(' ').map((part, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="inline-block mr-3"
                    >
                      {part}
                    </motion.span>
                  ))}
                </h1>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.02, boxShadow: "0 5px 30px rgba(0, 0, 0, 0.05)" }}
                className="bg-gradient-to-br from-blue-50/70 to-white rounded-2xl p-4 border border-blue-100/60 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-blue-400/90" />
                  <div className="text-xs text-gray-500/85">Numéro de Dossier</div>
                </div>
                <div className="font-mono text-xl text-gray-900/95 tracking-tighter mt-1">
                  {contact.numeroDossier}
                </div>
              </motion.div>
            </div>

            {/* Adresse */}
            <motion.div 
              whileHover={{ scale: 1.01, boxShadow: "0 5px 30px rgba(0, 0, 0, 0.05)" }}
              className="p-7 bg-gradient-to-br from-gray-50/95 to-white rounded-2xl border border-gray-100/90 shadow-sm relative overflow-hidden"
            >
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-xl" />
              <div className="flex items-start gap-5 relative">
                <div className="p-3 bg-blue-500/10 rounded-xl shadow-inner">
                  <MapPinIcon className="w-7 h-7 text-blue-500/90" />
                </div>
                <div>
                  <div className="text-sm text-gray-500/90 mb-2">Adresse du Domicile</div>
                  <div className="text-gray-900/95 font-medium leading-snug text-pretty">
                    {address}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Téléphone - Amélioré sans bouton Appeler */}
            <motion.div 
              whileHover={{ scale: 1.01, boxShadow: "0 5px 30px rgba(0, 0, 0, 0.05)" }}
              className="p-7 bg-gradient-to-br from-blue-50/70 to-white rounded-2xl border border-blue-100/60 shadow-sm relative overflow-hidden"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-xl" />
              <div className="flex items-start gap-5 relative">
                <div className="p-3 bg-blue-500/10 rounded-xl shadow-inner">
                  <PhoneIcon className="w-7 h-7 text-blue-500/90" />
                </div>
                <div>
                  <div className="text-sm text-gray-500/90 mb-2">Numéro de Téléphone</div>
                  <div className="text-gray-900/95 font-medium leading-snug text-pretty text-xl">
                    {phone}
                  </div>
                  {/* <div className="text-xs text-gray-400 mt-1">Contact principal</div> */}
                </div>
              </div>
            </motion.div>

            {/* MaPrimeRénov' Identifier - Amélioré avec logo */}
            <div className="pt-8 border-t border-gray-100/90">
              <motion.div 
                whileHover={{ scale: 1.01, boxShadow: "0 5px 30px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                className="p-5 bg-gradient-to-br from-gray-50/90 to-white rounded-2xl border border-gray-100/90 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Logo MaPrimeRénov' stylisé */}
                    <Image src="/Group 9.svg" alt="MaPrimeRénov Logo" className="w-12 h-12 flex-shrink-0" />

                    
                    <div>
                      <div className="text-sm text-gray-500/90 mb-1">Identifiant MaPrimeRénov&apos;</div>
                      <div className="font-medium text-gray-900/95 tracking-tight">
                        {contact.maprNumero || 'Non assigné'}
                      </div>
                      {/* <div className="text-xs text-gray-400 mt-0.5">Programme officiel</div> */}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100/95 to-blue-200/80 flex items-center justify-center border border-gray-100/90 shadow-sm">
                      <UserIcon className="w-6 h-6 text-blue-500/90 absolute opacity-20" />
                      <span className="text-2xl font-medium text-gray-700/95 relative">{initials}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Section Carte */}
          <div className="relative h-[600px] rounded-[2rem] overflow-hidden border border-gray-100/90 shadow-inner bg-gray-50/50 group">
            <AnimatePresence>
              {!isMapLoaded && !mapError && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-50/80 backdrop-blur-xl flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
                    <span>Chargement des données géospatiales...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {mapError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 max-w-md">
                  <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Carte indisponible</h3>
                  <p className="text-gray-500">Impossible de charger la carte pour cette adresse. Veuillez vérifier l&apos;adresse ou réessayer plus tard.</p>
                  <p className="mt-4 text-gray-400 text-sm">{address}</p>
                </div>
              </div>
            ) : (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=k&z=18&output=embed&language=fr`}
                onLoad={() => setMapLoaded(true)}
              />
            )}
            
            {/* Overlay de contrôle sur la carte */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-6 right-6 left-6 bg-white/90 backdrop-blur-md rounded-xl p-4 border border-gray-100/90 shadow-lg hidden lg:block opacity-80 group-hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <MapPinIcon className="w-6 h-6 text-blue-500/90" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Adresse actuelle</div>
                  <div className="text-sm font-medium text-gray-900/95 truncate max-w-xs">
                    {address}
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-auto text-xs px-3 py-1.5 bg-blue-500/90 text-white rounded-lg shadow-sm"
                >
                  Modifier
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}