"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

// Define allowed roles and their dashboard paths
const roleToPath: Record<string, string> = {
  "Sales Representative / Account Executive": "/dashboard/sales",
  "Project / Installation Manager": "/dashboard/pm",
  "Technician / Installer": "/dashboard/technician",
  "Customer Support / Service Representative": "/dashboard/support",
  "Super Admin": "/dashboard/admin",
};

export default function ProLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for forgot password flow
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // --- SLIDER SETUP FOR LEFT PANEL ---
  const slides = [
    {
      image:
        "https://images.blush.design/cbd169d1b1cdd330c49c3de4b3a6419b?w=920&auto=compress&cs=srgb",
      title: "Gestion de Clients Efficace",
      description:
        "Organisez et gérez vos clients en toute simplicité grâce à une interface dédiée.",
    },
    {
      image:
        "https://images.blush.design/b4cde6b173a7719b63c170a6a9f58ee0?w=920&auto=compress&cs=srgb",
      title: "Analyse & Suivi des Performances",
      description:
        "Obtenez des insights précis pour optimiser la relation client et booster vos performances.",
    },
    {
      image:
        "https://images.blush.design/03baaa2b408e762c09f0dfff68ff8311?w=920&auto=compress&cs=srgb",
      title: "Communication & Collaboration",
      description:
        "Facilitez la collaboration entre vos équipes et améliorez l'engagement de vos clients.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // --- ANIMATION VARIANTS FOR THE SLIDES ---
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Handle the Pro login form submission
  const handleProLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Use /api/login endpoint
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

      // Retrieve the role from the API response
      const userRole = data.role;
      // Allowed professional roles
      const allowedRoles = [
        "Sales Representative / Account Executive",
        "Project / Installation Manager",
        "Technician / Installer",
        "Customer Support / Service Representative",
        "Super Admin",
      ];

      // Check if the user's role is one of the allowed roles
      if (!allowedRoles.includes(userRole)) {
        setErrorMessage(
          "Cette page de connexion est réservée aux professionnels. Veuillez utiliser le portail approprié."
        );
        return;
      }

      // Save the pro info and role in localStorage
      const proInfo = {
        email,
        role: userRole,
      };
      localStorage.setItem("proInfo", JSON.stringify(proInfo));

      // Redirect to the dashboard based on the role
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
    // Here you can add your API call to send the reset email.
    // For demonstration, we simply simulate it:
    setResetMessage("Un lien pour réinitialiser votre mot de passe a été envoyé.");
  };

  // SEO & Meta Information
  const titleText = "Connexion Pro | Ecology'B CRM";
  const description =
    "Connectez-vous à votre espace professionnel sécurisé et optimisé pour une gestion de haut niveau.";
  const siteUrl = "https://www.your-domain.com"; // Replace with your production domain
  const logoUrl =
    "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png";

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={siteUrl + "/espace-pro"} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl + "/espace-pro"} />
        <meta property="og:title" content={titleText} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={logoUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl + "/espace-pro"} />
        <meta property="twitter:title" content={titleText} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={logoUrl} />
      </Head>

      <div className="min-h-screen flex bg-[#ffffff]">
        {/* Left Panel – Slider (visible on larger screens) */}
        <div
          className="hidden lg:flex relative flex-col w-1/2 p-8 lg:p-12 justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(45deg, rgb(191, 221, 249), rgba(191, 221, 249, 0.18), #ffffff)",
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
              <div className="mb-8 flex justify-center">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  width={410}
                  height={410}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#000000] mb-2">
                {slides[currentSlide].title}
              </h3>
              <p className="text-lg text-[#000000]">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel – Pro Login Form with animated background */}
        <div className="relative flex flex-1 items-center justify-center p-4 lg:p-6">
          {/* Animated SVG shapes */}
          <svg
            className="absolute left-0 top-0 w-72 h-72 opacity-50 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#213f5b">
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
                      Bienvenue sur l&apos;Espace Pro !
                    </h1>
                    <p className="text-center text-sm text-[#213f5b] mb-4">
                      Connectez-vous à votre espace professionnel sécurisé.
                    </p>
                    <form onSubmit={handleProLogin} className="space-y-4">
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
                              setResetEmail(email); // Optionally pre-fill with current email
                            }}
                          >
                            Mot de passe oublié ?
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
                  // Forgot Password Step
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <h1 className="text-3xl font-bold text-center text-[#213f5b] mb-2">
                      Réinitialiser le mot de passe
                    </h1>
                    <p className="text-center text-sm text-[#213f5b] mb-4">
                      Entrez votre adresse e-mail pour recevoir un lien de
                      réinitialisation.
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

                {/* Link to Client Login */}
                <div className="mt-4 text-center">
                <p className="text-sm text-[#213f5b]">Vous êtes un client ?</p>
                <Link
                    href="/"
                    className="mt-1 inline-flex items-center text-sm font-semibold text-[#213f5b] hover:underline"
                >
                    Je me connecte sur l&apos;Espace client
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
                </Link>
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
                {/* Add additional star icons if needed */}
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
