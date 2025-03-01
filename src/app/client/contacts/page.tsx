"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
import {
  PhoneIcon,
  // MapIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import ChatWidget from "@/components/ChatWidget";

interface ClientInfo {
  contact: {
    contactId?: string;
    _id: string;
    // Additional properties as needed
  };
}

interface Dossier {
  assignedTeam: string;
  codePostal?: string;
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
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ClientContacts() {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [showChatWidget, setShowChatWidget] = useState(false);
  // const router = useRouter();

  // FAQ state with accordions open/closed
  const faqs: FAQ[] = [
    {
      question: "Comment bénéficier d'une consultation gratuite avec un expert ?",
      answer:
        "Cliquez sur le bouton 'Discuter' pour être mis en relation avec un conseiller qui vous guidera gratuitement vers la solution idéale.",
    },
    {
      question: "Quelles solutions énergétiques proposez-vous ?",
      answer:
        "Nous offrons une gamme complète allant des pompes à chaleur aux systèmes solaires combinés, conçus pour maximiser vos économies et réduire votre empreinte carbone.",
    },
    {
      question: "Comment estimer mes économies potentielles ?",
      answer:
        "Nos experts réalisent une analyse personnalisée pour vous aider à comprendre le retour sur investissement de chaque solution.",
    },
    {
      question: "Quels bénéfices environnementaux puis-je attendre ?",
      answer:
        "En adoptant nos solutions, vous contribuez à une consommation énergétique plus responsable et à la préservation de notre planète.",
    },
  ];
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Retrieve clientInfo from localStorage
    const storedInfo = localStorage.getItem("clientInfo");
    if (storedInfo) {
      const info = JSON.parse(storedInfo);
      setClientInfo(info);
      const contactId = info.contact.contactId || info.contact._id;
      fetch(`/api/dossiers?contactId=${contactId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setDossier(data[0]);
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
      <div className="flex h-screen items-center justify-center bg-[#ffffff]">
        <p className="text-lg font-semibold text-[#213f5b]">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#ffffff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <Header />
        <main
          className="flex-1 overflow-y-auto p-8 space-y-8"
          style={{
            background: "linear-gradient(to bottom, rgba(191,221,249,0.1), rgba(210,252,178,0.05))",
          }}
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl font-bold text-[#213f5b]">
              Votre Conseiller Personnel
            </h1>
            <p className="mt-3 text-xl text-gray-600">
              Contactez votre expert dédié pour découvrir les meilleures solutions
              énergétiques adaptées à vos besoins.
            </p>
          </motion.div>

          {/* Advisor Contact Card */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="w-full bg-white/98 backdrop-blur-lg border border-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
>
  {/* Left side: Advisor Image with fixed positioning for face visibility */}
  <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src={
          advisor.avatar ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3"
        }
        alt={`${advisor.firstName} ${advisor.lastName}`}
        className="h-full w-full object-cover object-top" // Changed from object-center to object-top
        width={400}
        height={400}
        priority
      />
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#213f5b]/40 via-[#213f5b]/10 to-transparent" />
    </div>
  </div>

  {/* Right side: Advisor Details with responsive width */}
  <div className="p-5 md:p-6 w-full md:w-2/3 flex flex-col justify-between space-y-3">
    <div>
      {/* Name and role section with responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-[#213f5b]">
          {advisor.firstName} {advisor.lastName}
        </h2>
        <span className="inline-block px-3 py-0.5 self-start sm:self-auto bg-[#213f5b]/90 text-white text-xs font-medium rounded-full">
          {advisor.role}
        </span>
      </div>

      {/* Bio section */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {advisor.bio ||
          "Votre expert en solutions énergétiques innovantes, prêt à vous guider vers une meilleure efficacité énergétique."}
      </p>

      {/* Contact information with responsive grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a href={`tel:${advisor.phone}`} className="flex items-center text-gray-700 hover:text-[#213f5b] transition-colors group">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#213f5b]/10 group-hover:bg-[#213f5b]/20 transition-colors mr-2 flex-shrink-0">
            <PhoneIcon className="h-4 w-4 text-[#213f5b]" />
          </div>
          <span className="text-sm truncate">{advisor.phone}</span>
        </a>
        <a href={`mailto:${advisor.email}`} className="flex items-center text-gray-700 hover:text-[#213f5b] transition-colors group">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#213f5b]/10 group-hover:bg-[#213f5b]/20 transition-colors mr-2 flex-shrink-0">
            <EnvelopeIcon className="h-4 w-4 text-[#213f5b]" />
          </div>
          <span className="text-sm truncate">{advisor.email}</span>
        </a>
        <div className="flex items-center text-gray-700 col-span-1 sm:col-span-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#213f5b]/10 mr-2 flex-shrink-0">
            <MapPinIcon className="h-4 w-4 text-[#213f5b]" />
          </div>
          <span className="text-sm">{advisor.location || dossier.codePostal}</span>
        </div>
      </div>
    </div>

    {/* Action buttons with responsive design */}
    <div className="flex flex-wrap gap-2 mt-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowChatWidget(true)}
        className="flex-1 min-w-0 flex items-center justify-center px-4 py-2 bg-[#213f5b] text-white text-sm rounded-md shadow-sm hover:bg-[#2d5174] transition-colors focus:outline-none focus:ring-2 focus:ring-[#213f5b]/50"
      >
        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="truncate">Discuter</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 min-w-0 flex items-center justify-center px-4 py-2 border border-[#213f5b] text-[#213f5b] text-sm rounded-md hover:bg-[#213f5b]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#213f5b]/50"
      >
        <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="truncate">Rendez-vous</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex-shrink-0"
      >
        <ShareIcon className="h-5 w-5" />
      </motion.button>
    </div>
  </div>
</motion.div>

          {/* FAQ Section as Accordions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-semibold text-[#213f5b] mb-6">
              Vos Questions, Nos Réponses
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#ffffff]/90 backdrop-blur-md border border-gray-200 rounded-2xl">
                  <button
                    className="w-full flex justify-between items-center px-6 py-4 focus:outline-none"
                    onClick={() =>
                      setOpenFAQ(openFAQ === index ? null : index)
                    }
                  >
                    <p className="text-lg font-medium text-[#213f5b]">
                      {faq.question}
                    </p>
                    {openFAQ === index ? (
                      <ChevronUpIcon className="h-6 w-6 text-[#213f5b]" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-[#213f5b]" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {openFAQ === index && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 overflow-hidden"
                        transition={{ duration: 0.3 }}
                      >
                        <p className="py-4 text-gray-600">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
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
