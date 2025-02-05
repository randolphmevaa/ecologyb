"use client";

import { Header } from "@/components/Header";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  PhoneIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function ClientContacts() {
  // Example advisor data; in a real application, you might fetch this data
  const advisor = {
    name: "Jean Dupont",
    title: "Conseiller Énergétique",
    email: "jean.dupont@energiecrm.com",
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
    avatar: "/advisor-avatar.png",
    bio: "Votre expert en solutions énergétiques spécialisées, prêt à vous conseiller sur nos offres de Pompes à chaleur, Chauffe-eau solaires individuels, Chauffe-eau thermodynamiques et Systèmes solaires combinés.",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Consistent Header */}
      <Header user={{ name: "Client", avatar: "/client-avatar.png" }} />

      <main className="max-w-5xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Mon Conseiller</h1>
          <p className="mt-2 text-lg text-gray-600">
            Contactez votre conseiller dédié pour toutes vos questions sur nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Advisor Contact Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row items-center gap-6"
        >
          <div className="flex-shrink-0">
            <Image 
              src={advisor.avatar} 
              alt={advisor.name} 
              className="h-32 w-32 rounded-full object-cover border-4 border-green-600" 
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">{advisor.name}</h2>
            <p className="text-lg text-green-600 font-medium">{advisor.title}</p>
            <p className="mt-2 text-gray-600">{advisor.bio}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>{advisor.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapIcon className="h-5 w-5 mr-2" />
                <span>{advisor.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{advisor.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Discuter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="flex items-center justify-center px-6 py-3 border border-green-600 text-green-600 rounded-full shadow hover:bg-green-50 transition-colors"
            >
              Voir Profil
            </motion.button>
          </div>
        </motion.div>

        {/* FAQ Section (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Questions Fréquentes</h3>
          <div className="space-y-4">
            <motion.div 
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-gray-700">
                <span className="font-medium">Q:</span> Comment puis-je planifier un rendez-vous ?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-medium">R:</span> Cliquez sur le bouton &quot;Discuter&quot; pour prendre rendez-vous avec votre conseiller.
              </p>
            </motion.div>
            <motion.div 
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-gray-700">
                <span className="font-medium">Q:</span> Quels types de solutions proposez-vous ?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-medium">R:</span> Nos solutions incluent les Pompes à chaleur, Chauffe-eau solaires individuels, Chauffe-eau thermodynamiques et Systèmes solaires combinés.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
