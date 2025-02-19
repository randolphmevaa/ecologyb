"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PhoneIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import ChatWidget from "@/components/ChatWidget";

interface ClientInfo {
  contact: {
    contactId?: string;
    _id: string;
    // Add other properties as needed
  };
  // Add additional client info properties here
}

interface Dossier {
  assignedTeam: string;
  codePostal?: string;
  // Add other dossier properties as needed
}

interface Advisor {
  firstName: string;
  lastName: string;
  role: string;
  bio?: string;
  phone: string;
  email: string;
  location?: string;
  avatar?: string;
  // Add additional advisor properties here
}


export default function ClientContacts() {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve clientInfo from localStorage
    const storedInfo = localStorage.getItem("clientInfo");
    if (storedInfo) {
      const info = JSON.parse(storedInfo);
      setClientInfo(info);
      // Get the contactId from clientInfo.contact (fallback to _id)
      const contactId = info.contact.contactId || info.contact._id;
      // Fetch dossier data based on the contactId
      fetch(`/api/dossiers?contactId=${contactId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            // For simplicity, use the first dossier returned
            setDossier(data[0]);
            // Fetch advisor data using the dossier's assignedTeam field
            if (data[0].assignedTeam) {
              fetch(`/api/users?id=${data[0].assignedTeam}`)
                .then((res) => res.json())
                .then((userData) => setAdvisor(userData))
                .catch((err) =>
                  console.error("Error fetching advisor data:", err)
                );
            }
          }
        })
        .catch((err) => console.error("Error fetching dossier:", err));
    }
  }, []);

  if (!clientInfo || !dossier || !advisor) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800">
              Votre Conseiller Personnel
            </h1>
            <p className="mt-3 text-xl text-gray-600">
              Contactez votre conseiller dédié pour toutes vos questions sur nos solutions énergétiques.
            </p>
          </motion.div>

          {/* Advisor Contact Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-shrink-0">
              <Image 
                src={advisor.avatar || "/default-avatar.png"} 
                alt={`${advisor.firstName} ${advisor.lastName}`} 
                className="h-32 w-32 rounded-full object-cover border-4 border-green-600" 
                width={128}
                height={128}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-800">
                {advisor.firstName} {advisor.lastName}
              </h2>
              <p className="text-2xl text-green-600 font-medium mt-1">
                {advisor.role}
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {advisor.bio ||
                  "Votre expert en solutions énergétiques spécialisées, prêt à vous conseiller sur nos offres."}
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-5 w-5 mr-3" />
                  <span className="text-lg">{advisor.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapIcon className="h-5 w-5 mr-3" />
                  <span className="text-lg">{advisor.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-3" />
                  <span className="text-lg">
                    {advisor.location || dossier.codePostal}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => setShowChatWidget(true)}
                className="flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                <span className="text-lg">Discuter</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => router.push("/advisor-profile")}
                className="flex items-center justify-center px-8 py-3 border border-green-600 text-green-600 rounded-full shadow hover:bg-green-50 transition-colors"
              >
                <span className="text-lg">Voir Profil</span>
              </motion.button>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Questions Fréquentes
            </h3>
            <div className="space-y-6">
              <motion.div 
                className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <p className="text-gray-800 text-lg">
                  <span className="font-medium">Q:</span> Comment puis-je planifier un rendez-vous ?
                </p>
                <p className="text-gray-600 text-base mt-2">
                  <span className="font-medium">R:</span> Cliquez sur le bouton &quot;Discuter&quot; pour prendre rendez-vous avec votre conseiller.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <p className="text-gray-800 text-lg">
                  <span className="font-medium">Q:</span> Quels types de solutions proposez-vous ?
                </p>
                <p className="text-gray-600 text-base mt-2">
                  <span className="font-medium">R:</span> Nous proposons des solutions telles que les Pompes à chaleur, Chauffe-eau solaires individuels, Chauffe-eau thermodynamiques et Systèmes solaires combinés.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
      {/* Chat Widget Popup */}
      {showChatWidget && (
        <ChatWidget onClose={() => setShowChatWidget(false)} />
      )}
    </div>
  );
}
