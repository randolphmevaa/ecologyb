"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
import {
  PhoneIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
            transition={{ duration: 0.6 }}
            className="bg-[#ffffff]/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left side: Advisor Image */}
            <div className="relative md:w-1/3">
              <Image
                src={
                  advisor.avatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3"
                }
                alt={`${advisor.firstName} ${advisor.lastName}`}
                className="h-full w-full object-cover"
                width={400}
                height={400}
              />
              {/* Gradient overlay on the right */}
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#ffffff] to-transparent" />
            </div>
            {/* Right side: Advisor Details */}
            <div className="p-8 md:w-2/3 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-[#213f5b]">
                  {advisor.firstName} {advisor.lastName}
                </h2>
                <span className="inline-block mt-2 px-3 py-1 bg-[#213f5b] text-white text-xl rounded">
                  {advisor.role}
                </span>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {advisor.bio ||
                    "Votre expert en solutions énergétiques innovantes, prêt à vous guider vers une meilleure efficacité énergétique."}
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
              <div className="mt-8 flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setShowChatWidget(true)}
                  className="flex items-center justify-center px-8 py-3 bg-[#213f5b] text-white rounded-full shadow hover:bg-[#213f5b]/90 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                  <span className="text-lg">Discuter</span>
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
