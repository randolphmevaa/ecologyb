// src/app/dashboard/admin/contacts-organizations/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";

// Define an interface for the Leaflet Icon prototype.
interface IconDefaultPrototype {
  _getIconUrl?: () => string;
}

// Dynamically import components that depend on Leaflet.
const ContactTable = dynamic(() => import("./ContactTable"), { ssr: false });
const OrganizationMap = dynamic(() => import("./OrganizationMap"), { ssr: false });

export default function ContactsPage() {
  // Configure Leaflet only on the client side.
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Use the custom interface instead of 'any'
        delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
        });
      });
    }
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <motion.div
        className="relative border-r border-[#bfddf9]/30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar can go here */}
      </motion.div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-10 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <motion.h1
            className="text-3xl font-bold text-[#1a365d]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Contacts & Organisations
          </motion.h1>
          <div className="grid grid-cols-1 gap-10">
            <ContactTable />
            <OrganizationMap />
          </div>
        </main>
      </div>
    </div>
  );
}
