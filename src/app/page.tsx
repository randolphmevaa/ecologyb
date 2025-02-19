"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

// Map roles to their corresponding dashboard paths
const roleToPath: Record<string, string> = {
  "Sales Representative / Account Executive": "/dashboard/sales",
  "Project / Installation Manager": "/dashboard/pm",
  "Technician / Installer": "/dashboard/technician",
  "Customer Support / Service Representative": "/dashboard/support",
  "Client / Customer (Client Portal)": "/client/dashboard",
  "Super Admin": "/dashboard/admin",
};

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for "Mot de passe oublié" flow
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // --- SLIDER SETUP FOR LEFT PANEL ---
  const slides = [
    {
      image:
        "https://images.blush.design/8b20777ff46a2fdeed929f4ed34239ce?w=920&auto=compress&cs=srgb",
      title: "Planification Stratégique",
      description:
        "Organisez et planifiez vos projets énergétiques avec précision.",
    },
    {
      image:
        "https://images.blush.design/4c8f50e7179ced438982fe46d508003f?w=920&auto=compress&cs=srgb",
      title: "Suivi en Temps Réel",
      description:
        "Surveillez l'avancement de vos projets en temps réel pour une réactivité optimale.",
    },
    {
      image:
        "https://images.blush.design/b7b5556dfd73e6ba84f27df079cc65f8?w=920&auto=compress&cs=srgb",
      title: "Optimisation & Rapport",
      description:
        "Analysez et optimisez vos opérations pour une performance maximale.",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  // --- ANIMATION VARIANTS FOR THE SLIDES ---
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // First, attempt to log in
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Identifiants invalides.");
        return;
      }

      // Check if the user's role is allowed for this page
      const userRole = data.role;
      if (userRole !== "Client / Customer (Client Portal)") {
        setErrorMessage(
          "Cette page de connexion est réservée aux clients. Veuillez utiliser le portail approprié."
        );
        return;
      }

      // Assume that the login response contains a contactId
      const contactId = data.contactId;
      if (!contactId) {
        setErrorMessage("Aucun identifiant de contact n'a été retourné.");
        return;
      }

      // Fetch additional client information from the contacts API
      const contactResponse = await fetch(`/api/contacts/${contactId}`);
      if (!contactResponse.ok) {
        setErrorMessage("Erreur lors de la récupération des informations du contact.");
        return;
      }
      const contactData = await contactResponse.json();

      // Fetch dossier information from the dossiers API
      const dossierResponse = await fetch(`/api/dossiers?contactId=${contactId}`);
      if (!dossierResponse.ok) {
        setErrorMessage("Erreur lors de la récupération des informations du dossier.");
        return;
      }
      const dossierData = await dossierResponse.json();

      // Save client info along with additional data in localStorage
      const clientInfo = {
        email,
        role: userRole,
        contact: contactData, // details from /api/contacts/{contactId}
        dossier: dossierData, // details from /api/dossiers?contactId={contactId}
      };
      localStorage.setItem("clientInfo", JSON.stringify(clientInfo));

      // Redirect to the appropriate dashboard based on the user's role
      const dashboardPath = roleToPath[userRole];
      if (dashboardPath) {
        router.push(dashboardPath);
      } else {
        setErrorMessage("Rôle non reconnu. Veuillez contacter l’administrateur.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the reset password form submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here, you can add an API call to send the reset email.
    // For now, we simulate it with a message.
    setResetMessage(
      "Un lien pour réinitialiser votre mot de passe a été envoyé."
    );
  };

  // SEO & Meta Information
  const title = "Connexion | Ecology'B CRM";
  const description =
    "Accédez à votre espace sécurisé pour gérer vos activités CRM chez Ecology'B. Veuillez saisir vos identifiants pour vous connecter.";
  const siteUrl = "https://www.your-domain.com"; // Replace with your production domain
  const logoUrl =
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={siteUrl + "/login"} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl + "/login"} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={logoUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl + "/login"} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={logoUrl} />
      </Head>

      <div className="min-h-screen flex bg-[#ffffff]">
        {/* Left Panel – Client information slider (visible on larger screens) */}
        <div
          className="hidden lg:flex relative flex-col w-1/2 p-8 lg:p-12 justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(45deg, #ffffff, #bfddf9, #d2fcb2)",
            backgroundSize: "400% 400%",
            animation: "gradientAnimation 4s ease infinite",
          }}
        >
          {/* Decorative animated circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1.1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white rounded-full blur-3xl"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="relative z-10 max-w-lg mx-auto text-center"
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  width={600}
                  height={600}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#213f5b] mb-2">
                {slides[currentSlide].title}
              </h3>
              <p className="text-lg text-[#213f5b]">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel – Login form with an animated morphing blob background */}
        <div className="relative flex flex-1 items-center justify-center p-4 lg:p-6">
          {/* Animated SVG shapes */}
          <svg
            className="absolute left-0 top-0 w-72 h-72 opacity-50 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#bfddf9">
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="
                  M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z;
                  M420,290Q360,320,330,370Q300,420,260,410Q220,400,190,360Q160,320,150,270Q140,220,170,190Q200,160,250,150Q300,140,350,160Q400,180,420,210Q440,240,420,290Z;
                  M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z
                "
              />
            </path>
          </svg>

          <svg
            className="absolute inset-0 w-full h-full z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#bfddf9">
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M428.5,283.5Q371,317,338,367.5Q305,418,258.5,428.5Q212,439,166,412Q120,385,97.5,337.5Q75,290,86.5,240Q98,190,131,150.5Q164,111,214,97.5Q264,84,313.5,87Q363,90,406,123.5Q449,157,428.5,283.5Z;
                  M421.5,293.5Q371,337,327,379.5Q283,422,239.5,403Q196,384,160,363.5Q124,343,99.5,299Q75,255,86.5,205.5Q98,156,134,121.5Q170,87,221,90Q272,93,314.5,103.5Q357,114,407,153.5Q457,193,421.5,293.5Z;
                  M428.5,283.5Q371,317,338,367.5Q305,418,258.5,428.5Q212,439,166,412Q120,385,97.5,337.5Q75,290,86.5,240Q98,190,131,150.5Q164,111,214,97.5Q264,84,313.5,87Q363,90,406,123.5Q449,157,428.5,283.5Z
                "
              />
            </path>
          </svg>

          <svg
            className="absolute right-0 bottom-0 w-80 h-80 opacity-40 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#d2fcb2">
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="
                  M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z;
                  M430,290Q390,330,350,370Q310,410,270,370Q230,330,190,290Q230,250,270,210Q310,170,350,210Q390,250,430,290Z;
                  M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z
                "
              />
            </path>
          </svg>

          <div className="w-full max-w-md relative z-10">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-xl rounded-2xl p-6 lg:p-8 border border-[#bfddf9]"
              >
                {/* Clickable Logo */}
                <div
                  className="flex justify-center mb-4 cursor-pointer hover:opacity-75"
                  onClick={() =>
                    (window.location.href = "https://www.ecologyb.fr/")
                  }
                >
                  <Image
                    src={logoUrl}
                    alt="Logo Ecology'B CRM"
                    width={140}
                    height={70}
                    className="object-contain"
                  />
                </div>
                {!showReset ? (
                  <>
                    <h1 className="text-3xl font-bold text-center text-[#213f5b] mb-2">
                      Bonjour !
                    </h1>
                    <p className="text-center text-sm text-[#213f5b] mb-4">
                      Connectez-vous à votre espace sécurisé.
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-[#213f5b] mb-1"
                        >
                          Adresse e-mail
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#bfddf9] transition duration-150"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>

                      {/* Password Field */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-[#213f5b] mb-1"
                        >
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#bfddf9] transition duration-150"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <div className="mt-1 text-right">
                          <span
                            className="text-sm text-[#213f5b] hover:underline cursor-pointer"
                            onClick={() => {
                              setShowReset(true);
                              setResetEmail(email);
                            }}
                          >
                            Mot de passe oublié
                          </span>
                        </div>
                      </div>

                      {/* Error Message */}
                      {errorMessage && (
                        <div className="text-center text-red-600 text-sm font-medium">
                          {errorMessage}
                        </div>
                      )}

                      {/* Login Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg text-white font-semibold bg-[#213f5b] hover:bg-[#1a324a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#213f5b] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex justify-center items-center gap-2">
                            <span>Chargement...</span>
                            <div
                              className="animate-spin h-5 w-5 border-2 border-current border-r-transparent rounded-full"
                              role="status"
                            />
                          </div>
                        ) : (
                          "Se connecter"
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  // "Mot de passe oublié" Step
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <h1 className="text-3xl font-bold text-center text-[#213f5b] mb-2">
                      Réinitialiser le mot de passe
                    </h1>
                    <p className="text-center text-sm text-[#213f5b] mb-4">
                      Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                    </p>
                    <div>
                      <label
                        htmlFor="resetEmail"
                        className="block text-sm font-medium text-[#213f5b] mb-1"
                      >
                        Adresse e-mail
                      </label>
                      <input
                        type="email"
                        id="resetEmail"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#bfddf9] transition duration-150"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    {resetMessage && (
                      <div className="text-center text-green-600 text-sm font-medium">
                        {resetMessage}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg text-white font-semibold bg-[#213f5b] hover:bg-[#1a324a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                    >
                      Envoyer
                    </button>
                    <div className="mt-2 text-center">
                      <span
                        className="text-sm text-[#213f5b] hover:underline cursor-pointer"
                        onClick={() => setShowReset(false)}
                      >
                        Retour
                      </span>
                    </div>
                  </form>
                )}

                {/* Lien vers l'Espace Pro */}
                <div className="mt-4 text-center">
                  <span className="text-sm text-[#213f5b]">
                    Vous êtes un professionnel ?
                  </span>
                  <a
                    href="/espace-pro"
                    className="ml-2 inline-flex items-center text-sm font-semibold text-[#213f5b] hover:underline"
                  >
                    Je me connecte sur l&apos;Espace Pro
                    <svg
                      className="ml-1 h-4 w-4"
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
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Trustpilot Avis */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.785.57-1.84-.197-1.54-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.03 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
                </svg>
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.785.57-1.84-.197-1.54-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.03 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
                </svg>
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.785.57-1.84-.197-1.54-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.03 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
                </svg>
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.785.57-1.84-.197-1.54-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.03 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
                </svg>
              </div>
              <span className="text-sm text-[#213f5b]">
                Excellent · 5 392 avis sur Trustpilot
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for animated gradient background */}
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}
