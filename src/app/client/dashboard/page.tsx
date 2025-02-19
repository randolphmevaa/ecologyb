"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  SunIcon,
  BoltIcon,
  Squares2X2Icon,
  FireIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import ChatWidget from "@/components/ChatWidget";

const solutions = [
  {
    name: "Pompes à chaleur",
    description:
      "Optimisez votre consommation énergétique avec nos pompes à chaleur de haute performance.",
    icon: FireIcon,
  },
  {
    name: "Chauffe-eau solaire individuel",
    description:
      "Profitez de l'énergie solaire pour chauffer votre eau de manière efficace et économique.",
    icon: SunIcon,
  },
  {
    name: "Chauffe-eau thermodynamique",
    description:
      "Une solution innovante combinant pompe à chaleur et chauffe-eau pour une performance maximale.",
    icon: BoltIcon,
  },
  {
    name: "Système Solaire Combiné",
    description:
      "Intégrez plusieurs solutions solaires pour une efficacité énergétique globale.",
    icon: Squares2X2Icon,
  },
];

export default function ClientDashboard() {
  const [showChatWidget, setShowChatWidget] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 relative">
      {/* Global Header */}
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800">
            Bienvenue dans votre Espace Client
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Découvrez nos solutions spécialisées en énergie pour optimiser votre confort et réduire vos coûts.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.name}
                className="p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#bfddf9]/30 bg-white hover:border-[#d2fcb2]/50 hover:bg-gradient-to-br hover:from-white hover:to-[#bfddf9]/10 cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Icon className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-800 text-center">
                    {solution.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 text-center">
                    {solution.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer / Support Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm">
            Pour toute assistance, n’hésitez pas à contacter notre support dédié.
          </p>
        </motion.div>
      </main>

      {/* Fixed Button to Open Chat Widget */}
      <button
        onClick={() => setShowChatWidget(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
      >
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
      </button>

      {/* Chat Widget Popup */}
      {showChatWidget && (
        <ChatWidget onClose={() => setShowChatWidget(false)} />
      )}
    </div>
  );
}
