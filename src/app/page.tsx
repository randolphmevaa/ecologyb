"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Map role to relevant dashboard paths
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
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

      // If success, read the role and redirect
      const userRole = data.role;
      const dashboardPath = roleToPath[userRole];
      if (dashboardPath) {
        router.push(dashboardPath);
      } else {
        setErrorMessage(
          "Rôle non reconnu. Veuillez contacter l’administrateur."
        );
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#bfddf9] via-[#d2fcb2] to-[#bfddf9] p-4">
      {/* Animated Container */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 30 }}
          className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png"
              alt="Logo Entreprise"
              width={120}
              height={60}
              className="object-contain"
            />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Bonjour !
          </h1>
          <p className="text-center text-sm text-gray-600 mb-8">
            Veuillez saisir vos identifiants pour accéder à votre espace.
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#bfddf9]"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#bfddf9]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-600 text-sm font-medium text-center">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 rounded-lg text-white font-semibold bg-[#00ba7c] hover:bg-[#00a36b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00ba7c] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-2">
                  <span>Chargement</span>
                  <div
                    className="animate-spin h-5 w-5 border-2 border-current border-r-transparent text-white rounded-full"
                    role="status"
                  />
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
