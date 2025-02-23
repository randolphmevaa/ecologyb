"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  UserIcon,
  CloudIcon,
  NewspaperIcon,
  XMarkIcon,
  // ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ChatWidget from "@/components/ChatWidget";



// Fix leaflet icons


// Multi‑step progress bar steps
const progressSteps = [
  "Prise de contact",
  "En attente des documents",
  "Instruction du dossier",
  "Dossier Accepter",
  "Installation",
  "Contrôle",
  "Dossier clôturé",
];

export default function ClientDashboard() {
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const clientName = "Jean Dupont";
  // currentStep is 0-indexed; here 2 means "Instruction du dossier"
  const currentStep = 2;
  const overallProgress = ((currentStep + 1) / progressSteps.length) * 100;

  const accountManager = {
    name: "Marie Dupont",
    title: "Chargée de compte",
    email: "marie.dupont@ecologyb.com",
    phone: "+33 1 23 45 67 89",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  const weatherData = {
    temp: 22,
    condition: "Ensoleillé",
    feelsLike: 20,
    wind: "10 km/h",
    icon: "https://www.svgrepo.com/show/78390/sun.svg",
  };

  const newsItems = [
    {
      title: "Nouveau contrat signé avec la ville de Lyon",
      content:
        "Ecology'b vient de signer un contrat majeur pour moderniser l'infrastructure énergétique de Lyon.",
    },
    {
      title: "Mise à jour des normes énergétiques 2024",
      content:
        "Les nouvelles normes vont révolutionner la manière d'optimiser les solutions renouvelables.",
    },
    {
      title: "Webinaire sur l'optimisation énergétique",
      content:
        "Rejoignez notre webinaire le 15/09 pour découvrir les dernières innovations.",
    },
  ];

  const companyInfo = {
    name: "Ecology'b",
    slogan: "L'énergie verte pour tous",
    description:
      "Ecology'b est à la pointe de l'innovation en énergies renouvelables. Nous proposons des solutions durables et personnalisées pour faciliter la transition énergétique de nos clients, tout en assurant performance et fiabilité. Notre engagement est de rendre l'énergie verte accessible à tous, en mettant l'accent sur l'excellence du service et l'innovation continue.",
    contact: "contact@ecologyb.fr | 04 75 00 00 00",
  };

  useEffect(() => {
    // This code will only run on the client
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="flex h-screen bg-white relative">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12 pb-8 text-center space-y-4"
        >
          {/* <motion.div
            className="inline-block bg-gradient-to-r from-[#213f5b] to-[#2a4d6e] p-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-full px-4 py-1">
              <Image
                src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png"
                alt="Ecology'b Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          </motion.div> */}
          <h1 className="text-5xl font-semibold text-[#213f5b] mb-2 tracking-tight">
            Bienvenue, {clientName}
          </h1>
          <p className="text-xl text-[#2a4d6e] font-light">
            Votre accompagnement vers la transition énergétique
          </p>
        </motion.div>

        {/* Project Page Button */}
        <motion.div
          className="flex justify-end mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button className="bg-[#213f5b] hover:bg-[#1a334d] text-white px-6 py-3 rounded-full font-medium flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg">
            <span>Voir le projet complet</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Enhanced Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Premium Progress Bar */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 backdrop-blur-lg bg-opacity-70"
              whileHover={{ scale: 1.005 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                Avancement du projet
              </h2>
              <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                </motion.div>
              </div>
              <div className="flex justify-between items-center mt-8">
                {progressSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStep
                          ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {index <= currentStep ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          key="check"
                        >
                          ✓
                        </motion.div>
                      ) : (
                        index + 1
                      )}
                    </motion.div>
                    <p className="mt-3 text-xs text-center w-24 font-medium text-gray-600">
                      {step}
                    </p>
                    {index === currentStep && (
                      <motion.div
                        className="absolute -top-8 -right-4"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping" />
                          <div className="relative w-3 h-3 bg-blue-600 rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 backdrop-blur-lg bg-opacity-70"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <NewspaperIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Actualités du secteur
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Découvrez les dernières innovations en matière d&apos;énergie
                      renouvelable et les nouvelles réglementations en vigueur.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 backdrop-blur-lg bg-opacity-70"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CloudIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Prévisions énergétiques
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Analyse prédictive de votre consommation pour les prochains
                      jours.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Enhanced Account Manager Card */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 backdrop-blur-lg bg-opacity-70"
              whileHover={{ scale: 1.005 }}
            >
              <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                Votre conseiller
              </h2>
              <div className="flex items-center space-x-4">
                <motion.div
                  className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={accountManager.image}
                    alt="Chargé de compte"
                    layout="fill"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {accountManager.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {accountManager.title}
                  </p>
                  <div className="mt-2 space-y-1">
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                      <UserIcon className="h-4 w-4" />
                      <span className="text-sm">Profil complet</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <InformationCircleIcon className="h-4 w-4" />
                      <span className="text-sm">Contact rapide</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Premium Weather Card */}
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl"
              whileHover={{ scale: 1.005 }}
            >
              <div className="absolute inset-0 bg-noise opacity-10" />
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-center text-white/80 mb-8">
                  <h3 className="font-medium">Météo actuelle</h3>
                  <span className="text-sm">
                    {new Date().toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-6xl font-bold text-white">
                      {weatherData.temp}°
                    </span>
                    <p className="text-lg text-white/90">
                      {weatherData.condition}
                    </p>
                  </div>
                  <motion.div
                    className="relative w-20 h-20"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <Image
                      src={weatherData.icon}
                      alt={weatherData.condition}
                      layout="fill"
                      className="drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced News Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Actualités récentes
            </h2>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
              <span className="font-medium">Voir tout</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <motion.article
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                whileHover={{ y: -8 }}
              >
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-100 transition-colors" />
                <NewspaperIcon className="h-8 w-8 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.content}</p>
                <div className="mt-4 flex items-center space-x-2 text-blue-600">
                  <span className="text-sm font-medium">Lire la suite</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Enhanced About Section */}
        <section className="my-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#bfddf9] to-[#d2fcb2] opacity-30 rounded-3xl -rotate-1" />
          <motion.div
            className="relative bg-white rounded-3xl p-12 shadow-xl border border-gray-100 backdrop-blur-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-[#213f5b]">
                  Notre engagement écologique
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {companyInfo.description}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-[#213f5b] font-medium">
                    {companyInfo.contact}
                  </span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-[#213f5b] shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Énergie verte"
                  layout="fill"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#213f5b]/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{companyInfo.name}</h3>
                  <p className="text-lg">{companyInfo.slogan}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Enhanced Advertising Modal */}
        <AnimatePresence>
          {showPromo && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setShowPromo(false)}
              />
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-3xl border border-gray-100 relative max-w-md mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <button
                  onClick={() => setShowPromo(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-600" />
                </button>
                <div className="text-center space-y-6">
                  <div className="p-4 rounded-2xl inline-block">
                    <Image
                      src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png"
                      alt="Ecology'b Logo"
                      width={160}
                      height={60}
                      className="h-12 w-auto mx-auto"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[#213f5b]">
                    Parrainez un ami, gagnez ensemble
                  </h3>
                  <p className="text-gray-600">
                    Bénéficiez de 10% de réduction sur votre prochaine facture
                    pour chaque parrainage réussi. Contribuez à diffuser l&apos;énergie
                    verte tout en économisant.
                  </p>
                  <button className="w-full bg-[#213f5b] hover:bg-[#1a334d] text-white px-6 py-3 rounded-full font-medium flex items-center justify-center space-x-2 transition-all duration-300">
                    <span>Démarrer le parrainage</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>

      {/* Enhanced Chat Button */}
      {!showChatWidget && (
        <motion.button
          onClick={() => setShowChatWidget(true)}
          className="fixed bottom-8 right-8 bg-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all z-50 border border-gray-200 backdrop-blur-lg bg-opacity-80"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
        </motion.button>
      )}

      {/* Chat Widget */}
      {showChatWidget && <ChatWidget onClose={() => setShowChatWidget(false)} />}
    </div>
  );
}
