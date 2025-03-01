"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftIcon, ChatBubbleOvalLeftIcon, CheckIcon, DocumentDuplicateIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  // UserIcon,
  // CloudIcon,
  NewspaperIcon,
  XMarkIcon,
  // ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  // ExclamationCircleIcon,
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
  const [showPromo, setShowPromo] = useState(() => {
    return localStorage.getItem('promoDismissed') !== 'true';
  });
  const [progressionGlobale ] = useState<number>(50); // example percentage
  const etapesProgression: string[] = progressSteps; // you can use your progressSteps here
  const [etapeActuelle ] = useState<number>(2); // example: current step index
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const clientName = "Jean Dupont";
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);


  const documents = [
    { id: 1, nom: "Contrat signé", statut: "manquant" },
    { id: 2, nom: "Pièce d'identité", statut: "manquant" },
    { id: 3, nom: "Attestation", statut: "approuvé" }
  ];

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

  const logos = [
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e127bb448192250758f_5-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e106c719b8d8987889c_1-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e0e104124092fcd025b_3-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e0ff66aba8d2cab97b0_2-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e10c36c9cc7022cf83b_4-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e127bb448192250758f_5-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e106c719b8d8987889c_1-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e0e104124092fcd025b_3-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e0ff66aba8d2cab97b0_2-p-500.png",
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/66264e10c36c9cc7022cf83b_4-p-500.png",
    
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateActiveLogo = () => {
      const containerRect = container.getBoundingClientRect();
      // Calculate container's center (horizontally)
      const containerCenter = containerRect.left + containerRect.width / 2;
      let closestIndex: number | null = null;
      let closestDistance = Infinity;

      // Loop over each logo ref and determine which is closest to the center
      logoRefs.current.forEach((logo, index) => {
        if (logo) {
          const rect = logo.getBoundingClientRect();
          const logoCenter = rect.left + rect.width / 2;
          const distance = Math.abs(containerCenter - logoCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);
      requestAnimationFrame(updateActiveLogo);
    };

    requestAnimationFrame(updateActiveLogo);
  }, []);

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

  // When showPromo becomes false, persist that state in localStorage
  useEffect(() => {
    if (!showPromo) {
      localStorage.setItem('promoDismissed', 'true');
    }
  }, [showPromo]);

  return (
    <div className="flex h-screen bg-white relative">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">

      <div className="relative">
        {/* Shape 1 - Top Left (4s animation) */}
        <svg
          className="absolute left-0 top-0 w-72 h-72 opacity-50 z-0"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#bfddf9">
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z;
                M420,290Q360,320,330,370Q300,420,260,410Q220,400,190,360Q160,320,150,270Q140,220,170,190Q200,160,250,150Q300,140,350,160Q400,180,420,210Q440,240,420,290Z;
                M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z
              "
            />
          </path>
        </svg>

        {/* Shape 4 - Bottom Right (4s animation) */}
        <svg
          className="absolute right-0 bottom-0 w-80 h-80 opacity-40 z-0"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#d2fcb2">
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z;
                M430,290Q390,330,350,370Q310,410,270,370Q230,330,190,290Q230,250,270,210Q310,170,350,210Q390,250,430,290Z;
                M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z
              "
            />
          </path>
        </svg>

        {/* Shape 5 - Center Top (6s animation) */}
        <svg
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 opacity-30 z-0"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#add8e6">
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values="
                M240,40 Q300,110,240,180 Q180,250,120,180 Q60,110,120,40 Q180,-30,240,40Z;
                M250,50 Q310,120,250,190 Q190,260,130,190 Q70,120,130,50 Q190,-20,250,50Z;
                M240,40 Q300,110,240,180 Q180,250,120,180 Q60,110,120,40 Q180,-30,240,40Z
              "
            />
          </path>
        </svg>

        {/* New Shape 7 - Left Center (5s animation) */}
        <svg
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-56 h-56 opacity-40 z-0"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#ffe4b5">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="
                M100,250 Q150,200,200,250 Q150,300,100,250 Z;
                M110,260 Q160,210,210,260 Q160,310,110,260 Z;
                M100,250 Q150,200,200,250 Q150,300,100,250 Z
              "
            />
          </path>
        </svg>

        {/* New Shape 8 - Right Center (5s animation) */}
        <svg
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-56 h-56 opacity-40 z-0"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#98fb98">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="
                M400,250 Q350,200,300,250 Q350,300,400,250 Z;
                M410,260 Q360,210,310,260 Q360,310,410,260 Z;
                M400,250 Q350,200,300,250 Q350,300,400,250 Z
              "
            />
          </path>
        </svg>

      </div>

    <div className="relative">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 z-0">

        {/* Shape 4 - Bottom Right (4s animation) */}
        <svg
          className="absolute right-0 bottom-0 w-80 h-80 opacity-40"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#d2fcb2">
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z;
                M430,290Q390,330,350,370Q310,410,270,370Q230,330,190,290Q230,250,270,210Q310,170,350,210Q390,250,430,290Z;
                M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z
              "
            />
          </path>
        </svg>

        {/* New Shape - Top Right (4s animation) */}
        <svg
          className="absolute right-0 top-0 w-64 h-64 opacity-40"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#ffcccb">
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M400,80 Q440,140,380,220 Q320,300,280,220 Q240,140,280,80 Q320,20,380,60 Q440,100,400,80Z;
                M410,90 Q450,150,390,230 Q330,310,290,230 Q250,150,290,90 Q330,30,390,70 Q450,110,410,90Z;
                M400,80 Q440,140,380,220 Q320,300,280,220 Q240,140,280,80 Q320,20,380,60 Q440,100,400,80Z
              "
            />
          </path>
        </svg>

      </div>

    {/* Welcome Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-12 pb-8 text-center space-y-4 relative z-10"
    >
      <h1 className="text-5xl font-semibold text-[#213f5b] mb-2 tracking-tight">
        Bienvenue, {clientName}
      </h1>
      <p className="text-xl text-[#2a4d6e] font-light">
        Votre accompagnement vers la transition énergétique
      </p>
    </motion.div>
    </div>


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
            {/* Premium Progress Tracker */}
            <motion.div 
              className="bg-white rounded-3xl p-8 shadow-xl border border-[#bfddf9]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(145deg, #ffffff 60%, rgba(191, 221, 249, 0.2))"
              }}
            >
              {/* En-tête - Plus élégant avec des éléments visuels */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#213f5b]"
                    whileHover={{ rotate: 5 }}
                  >
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#213f5b]">
                      Suivi du Projet
                    </h2>
                    <p className="text-sm text-[#213f5b]/70">
                      Dernière mise à jour: Aujourd&apos;hui à 14:30
                    </p>
                  </div>
                </div>
                <motion.div 
                  className="px-4 py-2 rounded-xl bg-[#213f5b]/5 flex items-center gap-2"
                  whileHover={{ backgroundColor: "rgba(33, 63, 91, 0.1)" }}
                >
                  <span className="text-base font-semibold text-[#213f5b]">
                    {Math.round(progressionGlobale)}% complété
                  </span>
                  <div className="w-3 h-3 rounded-full bg-[#d2fcb2] shadow-[0_0_10px_rgba(210,252,178,0.6)]" />
                </motion.div>
              </div>

              {/* Barre de progression - Design amélioré */}
              <div className="relative h-7 rounded-full overflow-hidden bg-[#bfddf9]/20 backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#213f5b] to-[#bfddf9]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressionGlobale}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Effet brillant amélioré */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: -200 }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                
                {/* Indicateur flottant */}
                <motion.div
                  className="absolute right-2 top-0 bottom-0 my-auto h-fit bg-white shadow-lg px-4 py-1 rounded-full text-xs font-bold text-[#213f5b] flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-2 h-2 bg-[#d2fcb2] rounded-full mr-2" />
                  {Math.round(progressionGlobale)}%
                </motion.div>
              </div>

              {/* Timeline des étapes - Visuellement améliorée */}
              <div className="relative mt-16 mb-12 px-4">
                {/* Ligne de connexion élégante */}
                <div className="absolute top-5 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(to right, #bfddf9, #d2fcb2)" }}/>
                
                <div className="relative flex justify-between">
                  {etapesProgression.map((etape, index) => {
                    const estComplete = index < etapeActuelle;
                    const estCourante = index === etapeActuelle;
                    
                    return (
                      <div 
                        key={index} 
                        className="flex flex-col items-center relative z-10"
                        onMouseEnter={() => setIsHovering(index)}
                        onMouseLeave={() => setIsHovering(null)}
                      >
                        {/* Indicateur d'étape - Plus élégant */}
                        <motion.div
                          className={`w-12 h-12 relative flex items-center justify-center rounded-full transition-all duration-500 ${
                            estComplete
                              ? "bg-gradient-to-br from-[#213f5b] to-[#213f5b]/80"
                              : "bg-white border-2 border-[#bfddf9]"
                          } ${
                            estCourante
                              ? "ring-4 ring-[#d2fcb2]/30 shadow-[0_0_20px_rgba(191,221,249,0.5)]"
                              : ""
                          }`}
                          whileHover={{ 
                            scale: 1.1,
                            boxShadow: "0 0 25px rgba(191, 221, 249, 0.6)"
                          }}
                          animate={isHovering === index ? { y: -5 } : { y: 0 }}
                        >
                          {estComplete ? (
                            <motion.svg
                              className="w-6 h-6 text-white"
                              viewBox="0 0 24 24"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <path
                                d="M5 13l4 4L19 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          ) : (
                            <span className="text-sm font-bold text-[#213f5b]">
                              {index + 1}
                            </span>
                          )}
                          
                          {/* Indicateur d'étape courante */}
                          {estCourante && (
                            <motion.div
                              className="absolute -top-2 -right-2 w-5 h-5 bg-[#d2fcb2] rounded-full border-2 border-white shadow-[0_0_10px_rgba(210,252,178,0.6)]"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>

                        {/* Libellé d'étape */}
                        <div className="mt-4 text-center">
                          <p className={`text-sm font-semibold ${
                            estCourante ? "text-[#213f5b]" : "text-[#213f5b]/70"
                          }`}>
                            {etape}
                          </p>
                        </div>

                        {/* Informations détaillées pour l'étape courante */}
                        {/* Detailed information panel with close button */}
                        {estCourante && isDetailsOpen && (
                          <motion.div
                            className="absolute top-24 w-72 bg-white p-5 rounded-2xl shadow-xl border border-[#bfddf9]/50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                              background: "linear-gradient(145deg, #ffffff 60%, rgba(191, 221, 249, 0.1))"
                            }}
                          >
                            {/* Close button */}
                            <motion.button
                              onClick={() => setIsDetailsOpen(false)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute top-2 right-2 text-xl font-bold text-gray-600"
                            >
                              ×
                            </motion.button>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-[#213f5b]">
                                  Documents Requis
                                </h3>
                                <span className="text-xs px-2 py-1 bg-[#d2fcb2]/20 text-[#213f5b] rounded-full">
                                  {documents.filter(d => d.statut === "approuvé").length}/{documents.length} complétés
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                {documents.map(doc => (
                                  <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-[#213f5b]/5 hover:bg-[#213f5b]/10 transition-colors">
                                    <div className="flex items-center gap-2">
                                      {doc.statut === "approuvé" ? (
                                        <div className="w-6 h-6 rounded-full bg-[#d2fcb2]/30 flex items-center justify-center">
                                          <CheckIcon className="w-4 h-4 text-[#213f5b]" />
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                          <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
                                        </div>
                                      )}
                                      <span className="text-xs font-medium text-[#213f5b]">
                                        {doc.nom}
                                      </span>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className={`text-xs px-3 py-1 rounded-lg font-medium ${
                                        doc.statut === "approuvé" 
                                          ? "bg-[#d2fcb2]/20 text-[#213f5b]" 
                                          : "bg-[#213f5b] text-white"
                                      }`}
                                    >
                                      {doc.statut === "approuvé" ? "Voir" : "Ajouter"}
                                    </motion.button>
                                  </div>
                                ))}
                              </div>
                              
                              <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(33, 63, 91, 0.9)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-[#213f5b] text-white px-4 py-3 rounded-xl text-sm font-medium shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>Téléverser les documents</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section d'information et actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {/* Panneau d'état */}
                <motion.div 
                  className="p-5 rounded-2xl border border-[#bfddf9]/30"
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(191, 221, 249, 0.2)" }}
                  style={{
                    background: "linear-gradient(145deg, #ffffff 60%, rgba(191, 221, 249, 0.1))"
                  }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <InformationCircleIcon className="w-5 h-5 text-[#213f5b]" />
                    <h3 className="text-base font-semibold text-[#213f5b]">
                      État du Projet
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#213f5b]/70">Étape actuelle:</span>
                      <span className="text-sm font-semibold text-[#213f5b]">
                        {etapesProgression[etapeActuelle]} ({etapeActuelle + 1}/{etapesProgression.length})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#213f5b]/70">Date d&apos;échéance:</span>
                      <span className="text-sm font-semibold text-[#213f5b]">30 Mars 2025</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#213f5b]/70">Responsable:</span>
                      <span className="text-sm font-semibold text-[#213f5b]">Marie Dupont</span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="w-full h-[1px] bg-gradient-to-r from-[#bfddf9] to-transparent mb-3" />
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-[#213f5b]/80">
                          Documents requis manquants pour passer à l&apos;étape suivante. Veuillez les téléverser dès que possible.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Panneau d'actions */}
                <motion.div 
                  className="p-5 rounded-2xl border border-[#d2fcb2]/30"
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(210, 252, 178, 0.2)" }}
                  style={{
                    background: "linear-gradient(145deg, #ffffff 60%, rgba(210, 252, 178, 0.1))"
                  }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <svg className="w-5 h-5 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-base font-semibold text-[#213f5b]">
                      Actions Rapides
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: "rgba(33, 63, 91, 0.9)" }}
                      whileTap={{ scale: 0.97 }}
                      className="p-4 rounded-xl bg-[#213f5b] text-white flex flex-col items-center gap-2 transition-all"
                    >
                      <DocumentTextIcon className="w-6 h-6" />
                      <span className="text-xs font-medium">Voir les Documents</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="p-4 rounded-xl bg-[#bfddf9]/20 text-[#213f5b] border border-[#bfddf9]/30 flex flex-col items-center gap-2 transition-all"
                    >
                      <DocumentDuplicateIcon className="w-6 h-6" />
                      <span className="text-xs font-medium">Télécharger Rapport</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="p-4 rounded-xl bg-[#bfddf9]/20 text-[#213f5b] border border-[#bfddf9]/30 flex flex-col items-center gap-2 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs font-medium">Contacter Support</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="p-4 rounded-xl bg-[#d2fcb2]/20 text-[#213f5b] border border-[#d2fcb2]/30 flex flex-col items-center gap-2 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-medium">Aide & Ressources</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
              
              {/* Footer avec actions supplémentaires */}
              <div className="mt-6 pt-4 border-t border-[#bfddf9]/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#213f5b]/60">Dernier changement il y a 2 heures</span>
                  <div className="w-1 h-1 rounded-full bg-[#213f5b]/30" />
                  <motion.button
                    whileHover={{ color: "#213f5b" }}
                    className="text-xs text-[#213f5b]/60 hover:text-[#213f5b] transition-colors"
                  >
                    Historique complet
                  </motion.button>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ x: 2 }}
                    className="text-xs font-medium text-[#213f5b] flex items-center gap-1"
                  >
                    Voir tous les détails
                    <ArrowRightIcon className="w-3 h-3" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(33, 63, 91, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs font-medium px-4 py-2 rounded-lg bg-[#213f5b]/5 text-[#213f5b] transition-all"
                  >
                    Exporter PDF
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Documents and S.A.V. Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 backdrop-blur-lg bg-opacity-70 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => {
                  // Navigate to the Documents tab (e.g., using next/router)
                  // Example: router.push("/documents");
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Documents</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Accédez à tous vos contrats, formulaires et rapports en un clic. 
                      Organisez vos documents et retrouvez rapidement l’information essentielle pour votre projet.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 backdrop-blur-lg bg-opacity-70 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => {
                  // Navigate to the S.A.V. tab (e.g., using next/router)
                  // Example: router.push("/sav");
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <ChatBubbleOvalLeftIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">S.A.V.</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Besoin d’aide ? Notre Service Après-Vente est là pour répondre à toutes vos questions. 
                      Cliquez ici pour soumettre une demande et bénéficier d’un support personnalisé pour résoudre vos problèmes rapidement.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Premium Sales Advisor Card */}
            <motion.div
              className="relative rounded-2xl p-8 shadow-2xl transition-all group overflow-hidden"
              style={{ 
                background: 'linear-gradient(145deg, #ffffff 0%, #bfddf9 100%)',
                border: '1px solid rgba(33, 63, 91, 0.1)'
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(33, 63, 91, 0.2)' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Dynamic Background Elements */}
              <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
                  style={{ background: 'radial-gradient(circle at 70% 20%, #d2fcb2 0%, transparent 40%)' }} />
              
              {/* Availability Ribbon */}
              {/* <div className="absolute -right-8 top-6 rotate-45 bg-[#d2fcb2] px-8 py-1 shadow-md">
                <span className="text-xs font-bold text-[#213f5b]">EN LIGNE</span>
              </div> */}

              <div className="relative space-y-6">
                {/* Header Section */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tight text-[#213f5b]">
                    Votre Conseiller Commercial
                    <span className="block h-1 w-16 mt-2 bg-[#d2fcb2] rounded-full" />
                  </h2>
                  <p className="text-[15px] text-[#213f5b]/90 leading-relaxed pr-16">
                    Stratégies sur-mesure et accompagnement premium pour maximiser vos ventes
                  </p>
                </div>

                {/* Profile Section */}
                <div className="flex items-start gap-6">
                  {/* Image Container */}
                  <motion.div 
                    className="relative z-10"
                    whileHover={{ rotate: 2 }}
                  >
                    <div className="absolute inset-0 bg-[#d2fcb2] rounded-full blur-lg opacity-40 -z-10" />
                    <div className="h-24 w-24 rounded-full border-4 border-white ring-[3px] ring-[#213f5b]/10 shadow-xl overflow-hidden">
                      <Image
                        src={accountManager.image}
                        alt="Conseiller commercial"
                        layout="fill"
                        className="object-cover grayscale-[15%]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#213f5b]/30" />
                    </div>
                  </motion.div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-2xl font-black text-[#213f5b] tracking-tight">
                        {accountManager.name}
                      </h3>
                      <p className="text-sm text-[#213f5b]/80 font-medium uppercase tracking-wider">
                        {accountManager.title}
                      </p>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#213f5b]/5 text-[#213f5b] rounded-full text-xs font-bold">
                        Suivi Personnalisé
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Panel */}
                <motion.div 
                  className="p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white"
                  whileHover={{ backgroundColor: '#ffffff' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#213f5b] mb-1">Contact Rapide</h4>
                      <p className="text-xs text-[#213f5b]/80">Réponse garantie sous 15 minutes</p>
                      <p className="text-xs text-[#213f5b]/80 mt-2">Pour toute demande, veuillez utiliser le chat.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#213f5b] text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span className="text-sm font-bold">Chat</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Removed interactive features: Documents and Agenda */}
              </div>

              {/* Floating Action */}
              {/* <motion.button 
                className="absolute bottom-6 right-6"
                whileHover={{ rotate: 10 }}
              >
                <div className="p-2 bg-[#d2fcb2] rounded-full shadow-lg">
                  <ArrowTopRightOnSquareIcon className="h-6 w-6 text-[#213f5b]" />
                </div>
              </motion.button> */}
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

        {/* Premium About Section */}
        <section className="my-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#bfddf9] to-[#d2fcb2] opacity-30 rounded-3xl -rotate-1 animate-gradient-pulse" />
          <motion.div 
            className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 backdrop-blur-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-5xl font-bold text-[#213f5b] leading-tight">
                  Réinventer l&apos;énergie, <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a5a7c] to-[#4d8b4d]">Responsablement</span>
                </h2>
                
                <div className="relative pl-6 border-l-4 border-[#2a5a7c]">
                  <blockquote className="text-xl text-gray-700 italic leading-relaxed">
                  &quot;Chez nous, l&apos;innovation ne se mesure pas en mégawatts, mais en vies transformées. 
                    Chaque projet est un pont entre le progrès technologique et la préservation de notre 
                    <strong className="text-[#2a5a7c]"> patrimoine planétaire</strong>.&quot;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-[#2a5a7c] flex items-center justify-center text-white text-xl">G</div>
                    <div>
                      <p className="font-bold text-[#213f5b]">Georges Berreby</p>
                      <p className="text-gray-600">Président Directeur Général</p>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {companyInfo.description}
                </p>
              </div>

              <div className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                <Image
                  src="https://www.heat-me.be/wp-content/uploads/2023/06/pompe-a-chaleur.png"
                  alt="Énergie verte"
                  layout="fill"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#213f5b]/90 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{companyInfo.name}</h3>
                  <p className="text-xl opacity-90">{companyInfo.slogan}</p>
                </div>
              </div>
            </div>

            {/* Infinite Marquee */}
            <div
              className="mt-16 overflow-hidden relative before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-white after:to-transparent"
              ref={containerRef}
            >
              <div className="flex animate-infinite-scroll hover:paused">
                {logos.map((url, index) => (
                  <div
                    key={index}
                    ref={(el) => { logoRefs.current[index] = el; }}
                    className={`flex-shrink-0 mx-8 transition-all duration-300 transform ${
                      activeIndex === index
                        ? "scale-150 opacity-100 grayscale-0"
                        : "scale-70 opacity-70 grayscale"
                    }`}
                  >
                    <Image
                      src={url.trim()}
                      alt="Partner brand"
                      width={90}
                      height={74}
                      className="h-16 object-contain"
                    />
                  </div>
                ))}
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
