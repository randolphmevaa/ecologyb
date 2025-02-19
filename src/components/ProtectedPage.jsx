// components/ProtectedPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children, allowedRoles }) {
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Determine which localStorage key to use based on allowedRoles.
  // You could also pass this as a prop if needed.
  const storageKey = allowedRoles.includes("Client / Customer (Client Portal)")
    ? "clientInfo"
    : "proInfo";

  useEffect(() => {
    const storedInfo = localStorage.getItem(storageKey);
    if (!storedInfo) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    const user = JSON.parse(storedInfo);
    if (!allowedRoles.includes(user.role)) {
      setAccessDenied(true);
    }
    setLoading(false);
  }, [allowedRoles, storageKey]);

  // Auto-redirect after 3 seconds if access is denied
  useEffect(() => {
    if (accessDenied && !loading) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [accessDenied, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Accès refusé
          </h1>
          <p className="text-gray-700 mb-6">
            Désolé, vous n'êtes pas autorisé à accéder à cette page.
          </p>
          <p className="text-gray-500 text-sm">
            Vous allez être redirigé vers la page de connexion dans quelques
            instants.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
