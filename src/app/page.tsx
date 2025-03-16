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
      image: "/Group 77.png",
      // title: "Votre Nouveau Slide",
      // description: "Description de votre nouveau slide.",
    },
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
                  alt={slides[currentSlide].title ?? "Slide image"}
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
              <div className="flex items-center space-x-0.5">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 46.38 46.33"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="tp-star__canvas"
                    fill="#00B67A"
                    d="M0 46.330002h46.375586V0H0z"
                  />
                  <path
                    className="tp-star__shape"
                    fill="#FFF"
                    d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
                  />
                </svg>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 46.38 46.33"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="tp-star__canvas"
                    fill="#00B67A"
                    d="M0 46.330002h46.375586V0H0z"
                  />
                  <path
                    className="tp-star__shape"
                    fill="#FFF"
                    d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
                  />
                </svg>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 46.38 46.33"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="tp-star__canvas"
                    fill="#00B67A"
                    d="M0 46.330002h46.375586V0H0z"
                  />
                  <path
                    className="tp-star__shape"
                    fill="#FFF"
                    d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
                  />
                </svg>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 46.38 46.33"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="tp-star__canvas"
                    fill="#00B67A"
                    d="M0 46.330002h46.375586V0H0z"
                  />
                  <path
                    className="tp-star__shape"
                    fill="#FFF"
                    d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
                  />
                </svg>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 46.38 46.33"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="tp-star__canvas"
                    fill="#00B67A"
                    d="M0 46.330002h46.375586V0H0z"
                  />
                  <path
                    className="tp-star__shape"
                    fill="#FFF"
                    d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
                  />
                </svg>
              </div>
              <span className="text-sm text-[#213f5b] flex items-center gap-1">
                Excellent · 5 392 avis sur
                <div className="relative -mt-1" style={{ width: "80px", height: "20px" }}>
                  <svg
                    role="img"
                    viewBox="0 0 126 31"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full"
                  >
                    <title>Trustpilot</title>
                    <path
                      className="tp-logo__text"
                      d="M33.074774 11.07005H45.81806v2.364196h-5.010656v13.290316h-2.755306V13.434246h-4.988435V11.07005h.01111zm12.198892 4.319629h2.355341v2.187433h.04444c.077771-.309334.222203-.60762.433295-.894859.211092-.287239.466624-.56343.766597-.79543.299972-.243048.633276-.430858.999909-.585525.366633-.14362.744377-.220953 1.12212-.220953.288863 0 .499955.011047.611056.022095.1111.011048.222202.033143.344413.04419v2.408387c-.177762-.033143-.355523-.055238-.544395-.077333-.188872-.022096-.366633-.033143-.544395-.033143-.422184 0-.822148.08838-1.199891.254096-.377744.165714-.699936.41981-.977689.740192-.277753.331429-.499955.729144-.666606 1.21524-.166652.486097-.244422 1.03848-.244422 1.668195v5.39125h-2.510883V15.38968h.01111zm18.220567 11.334883H61.02779v-1.579813h-.04444c-.311083.574477-.766597 1.02743-1.377653 1.369908-.611055.342477-1.233221.51924-1.866497.51924-1.499864 0-2.588654-.364573-3.25526-1.104765-.666606-.740193-.999909-1.856005-.999909-3.347437V15.38968h2.510883v6.948968c0 .994288.188872 1.701337.577725 2.1101.377744.408763.922139.618668 1.610965.618668.533285 0 .96658-.077333 1.322102-.243048.355524-.165714.644386-.37562.855478-.65181.222202-.265144.377744-.596574.477735-.972194.09999-.37562.144431-.784382.144431-1.226288v-6.573349h2.510883v11.323836zm4.27739-3.634675c.07777.729144.355522 1.237336.833257 1.535623.488844.287238 1.06657.441905 1.744286.441905.233312 0 .499954-.022095.799927-.055238.299973-.033143.588836-.110476.844368-.209905.266642-.099429.477734-.254096.655496-.452954.166652-.198857.244422-.452953.233312-.773335-.01111-.320381-.133321-.585525-.355523-.784382-.222202-.209906-.499955-.364573-.844368-.497144-.344413-.121525-.733267-.232-1.17767-.320382-.444405-.088381-.888809-.18781-1.344323-.287239-.466624-.099429-.922138-.232-1.355432-.37562-.433294-.14362-.822148-.342477-1.166561-.596573-.344413-.243048-.622166-.56343-.822148-.950097-.211092-.386668-.311083-.861716-.311083-1.436194 0-.618668.155542-1.12686.455515-1.54667.299972-.41981.688826-.75124 1.14434-1.005336.466624-.254095.97769-.430858 1.544304-.541334.566615-.099429 1.11101-.154667 1.622075-.154667.588836 0 1.15545.066286 1.688736.18781.533285.121524 1.02213.320381 1.455423.60762.433294.276191.788817.640764 1.07768 1.08267.288863.441905.466624.98324.544395 1.612955h-2.621984c-.122211-.596572-.388854-1.005335-.822148-1.204193-.433294-.209905-.933248-.309334-1.488753-.309334-.177762 0-.388854.011048-.633276.04419-.244422.033144-.466624.088382-.688826.165715-.211092.077334-.388854.198858-.544395.353525-.144432.154667-.222203.353525-.222203.60762 0 .309335.111101.552383.322193.740193.211092.18781.488845.342477.833258.475048.344413.121524.733267.232 1.177671.320382.444404.088381.899918.18781 1.366542.287239.455515.099429.899919.232 1.344323.37562.444404.14362.833257.342477 1.17767.596573.344414.254095.622166.56343.833258.93905.211092.37562.322193.850668.322193 1.40305 0 .673906-.155541 1.237336-.466624 1.712385-.311083.464001-.711047.850669-1.199891 1.137907-.488845.28724-1.04435.508192-1.644295.640764-.599946.132572-1.199891.198857-1.788727.198857-.722156 0-1.388762-.077333-1.999818-.243048-.611056-.165714-1.14434-.408763-1.588745-.729144-.444404-.33143-.799927-.740192-1.05546-1.226289-.255532-.486096-.388853-1.071621-.411073-1.745528h2.533103v-.022095zm8.288135-7.700208h1.899828v-3.402675h2.510883v3.402675h2.26646v1.867052h-2.26646v6.054109c0 .265143.01111.486096.03333.684954.02222.18781.07777.353524.155542.486096.07777.132572.199981.232.366633.298287.166651.066285.377743.099428.666606.099428.177762 0 .355523 0 .533285-.011047.177762-.011048.355523-.033143.533285-.077334v1.933338c-.277753.033143-.555505.055238-.811038.088381-.266642.033143-.533285.04419-.811037.04419-.666606 0-1.199891-.066285-1.599855-.18781-.399963-.121523-.722156-.309333-.944358-.552381-.233313-.243049-.377744-.541335-.466625-.905907-.07777-.364573-.13332-.784383-.144431-1.248384v-6.683825h-1.899827v-1.889147h-.02222zm8.454788 0h2.377562V16.9253h.04444c.355523-.662858.844368-1.12686 1.477644-1.414098.633276-.287239 1.310992-.430858 2.055369-.430858.899918 0 1.677625.154667 2.344231.475048.666606.309335 1.222111.740193 1.666515 1.292575.444405.552382.766597 1.193145.9888 1.92229.222202.729145.333303 1.513527.333303 2.3421 0 .762288-.099991 1.50248-.299973 2.20953-.199982.718096-.499955 1.347812-.899918 1.900194-.399964.552383-.911029.98324-1.533194 1.31467-.622166.33143-1.344323.497144-2.18869.497144-.366634 0-.733267-.033143-1.0999-.099429-.366634-.066286-.722157-.176762-1.05546-.320381-.333303-.14362-.655496-.33143-.933249-.56343-.288863-.232-.522175-.497144-.722157-.79543h-.04444v5.656393h-2.510883V15.38968zm8.77698 5.67849c0-.508193-.06666-1.005337-.199981-1.491433-.133321-.486096-.333303-.905907-.599946-1.281527-.266642-.37562-.599945-.673906-.988799-.894859-.399963-.220953-.855478-.342477-1.366542-.342477-1.05546 0-1.855387.364572-2.388672 1.093717-.533285.729144-.799928 1.701337-.799928 2.916578 0 .574478.066661 1.104764.211092 1.59086.144432.486097.344414.905908.633276 1.259432.277753.353525.611056.629716.99991.828574.388853.209905.844367.309334 1.355432.309334.577725 0 1.05546-.121524 1.455423-.353525.399964-.232.722157-.541335.97769-.905907.255531-.37562.444403-.79543.555504-1.270479.099991-.475049.155542-.961145.155542-1.458289zm4.432931-9.99812h2.510883v2.364197h-2.510883V11.07005zm0 4.31963h2.510883v11.334883h-2.510883V15.389679zm4.755124-4.31963h2.510883v15.654513h-2.510883V11.07005zm10.210184 15.963847c-.911029 0-1.722066-.154667-2.433113-.452953-.711046-.298287-1.310992-.718097-1.810946-1.237337-.488845-.530287-.866588-1.160002-1.12212-1.889147-.255533-.729144-.388854-1.535622-.388854-2.408386 0-.861716.133321-1.657147.388853-2.386291.255533-.729145.633276-1.35886 1.12212-1.889148.488845-.530287 1.0999-.93905 1.810947-1.237336.711047-.298286 1.522084-.452953 2.433113-.452953.911028 0 1.722066.154667 2.433112.452953.711047.298287 1.310992.718097 1.810947 1.237336.488844.530287.866588 1.160003 1.12212 1.889148.255532.729144.388854 1.524575.388854 2.38629 0 .872765-.133322 1.679243-.388854 2.408387-.255532.729145-.633276 1.35886-1.12212 1.889147-.488845.530287-1.0999.93905-1.810947 1.237337-.711046.298286-1.522084.452953-2.433112.452953zm0-1.977528c.555505 0 1.04435-.121524 1.455423-.353525.411074-.232.744377-.541335 1.01102-.916954.266642-.37562.455513-.806478.588835-1.281527.12221-.475049.188872-.961145.188872-1.45829 0-.486096-.066661-.961144-.188872-1.44724-.122211-.486097-.322193-.905907-.588836-1.281527-.266642-.37562-.599945-.673907-1.011019-.905907-.411074-.232-.899918-.353525-1.455423-.353525-.555505 0-1.04435.121524-1.455424.353525-.411073.232-.744376.541334-1.011019.905907-.266642.37562-.455514.79543-.588835 1.281526-.122211.486097-.188872.961145-.188872 1.447242 0 .497144.06666.98324.188872 1.458289.12221.475049.322193.905907.588835 1.281527.266643.37562.599946.684954 1.01102.916954.411073.243048.899918.353525 1.455423.353525zm6.4883-9.66669h1.899827v-3.402674h2.510883v3.402675h2.26646v1.867052h-2.26646v6.054109c0 .265143.01111.486096.03333.684954.02222.18781.07777.353524.155541.486096.077771.132572.199982.232.366634.298287.166651.066285.377743.099428.666606.099428.177762 0 .355523 0 .533285-.011047.177762-.011048.355523-.033143.533285-.077334v1.933338c-.277753.033143-.555505.055238-.811038.088381-.266642.033143-.533285.04419-.811037.04419-.666606 0-1.199891-.066285-1.599855-.18781-.399963-.121523-.722156-.309333-.944358-.552381-.233313-.243049-.377744-.541335-.466625-.905907-.07777-.364573-.133321-.784383-.144431-1.248384v-6.683825h-1.899827v-1.889147h-.02222z"
                      fill="#191919"
                    ></path>
                    <path
                      className="tp-logo__star"
                      fill="#00B67A"
                      d="M30.141707 11.07005H18.63164L15.076408.177071l-3.566342 10.892977L0 11.059002l9.321376 6.739063-3.566343 10.88193 9.321375-6.728016 9.310266 6.728016-3.555233-10.88193 9.310266-6.728016z"
                    ></path>
                    <path
                      className="tp-logo__star-notch"
                      fill="#005128"
                      d="M21.631369 20.26169l-.799928-2.463625-5.755033 4.153914z"
                    ></path>
                  </svg>
                </div>
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
