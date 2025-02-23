"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/solid";

// 1. Ensure proper imports and dependency management
interface Contact {
  numeroDossier: string;
  mailingAddress?: string;
  firstName?: string;
  lastName?: string;
  maprNumero?: string;
}

export default function ClientHeader({ contactId }: { contactId: string }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);

  // 2. Add error handling for API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/contacts/${contactId}`);
        const data = await res.json();
        setContact(data);
        setTimeout(() => setMapLoaded(true), 500);
      } catch (error) {
        console.error("Failed to fetch contact:", error);
      }
    };

    fetchData();
  }, [contactId]);

  // 3. Improved loading state
  if (!contact) return (
    <div className="h-[580px] bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] animate-pulse shadow-2xl" />
  );

  const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  const initials = (contact.firstName?.[0] || '') + (contact.lastName?.[0] || '');
  const address = contact.mailingAddress || "60 Rue François 1er, Paris";

  // 4. Enhanced UI with better error boundaries
  return (
    <div className="relative isolate group">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="relative bg-white/97 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100/90 shadow-2xl shadow-gray-100/30 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-10 p-10">
          {/* Left Panel */}
          <div className="space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <motion.div 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  className="text-xs font-semibold text-gray-500/90 uppercase tracking-[0.2em]"
                >
                  Client Profile
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
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/90 shadow-xs"
              >
                <div className="text-xs text-gray-500/85 mb-2">Dossier Number</div>
                <div className="font-mono text-xl text-gray-900/95 tracking-tighter">
                  {contact.numeroDossier}
                </div>
              </motion.div>
            </div>

            <motion.div 
              whileHover={{ transformPerspective: 1000, rotateY: 1 }}
              className="p-7 bg-gradient-to-br from-gray-50/95 to-white rounded-2xl border border-gray-100/90 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-start gap-5">
                <div className="p-3 bg-blue-500/10 rounded-xl shadow-inner">
                  <MapPinIcon className="w-7 h-7 text-blue-500/90" />
                </div>
                <div>
                  <div className="text-sm text-gray-500/90 mb-2">Property Location</div>
                  <div className="text-gray-900/95 font-medium leading-snug text-pretty">
                    {address}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="pt-8 border-t border-gray-100/90">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-5 bg-gray-50/80 rounded-2xl"
              >
                <div>
                  <div className="text-sm text-gray-500/90 mb-1">MAPR Identifier</div>
                  <div className="font-medium text-gray-900/95 tracking-tight">
                    {contact.maprNumero || 'Not Assigned'}
                  </div>
                </div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100/95 to-blue-200/80 flex items-center justify-center border border-gray-100/90 shadow-xs">
                    <span className="text-2xl font-medium text-gray-700/95">{initials}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Map Section */}
          <div className="relative h-[580px] rounded-[2rem] overflow-hidden border border-gray-100/90 shadow-inner bg-gray-50/50">
            <AnimatePresence>
              {!isMapLoaded && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-50/80 backdrop-blur-xl flex items-center justify-center"
                >
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
                    Loading geospatial data...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=k&z=18&output=embed`}
              onLoad={() => setMapLoaded(true)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
