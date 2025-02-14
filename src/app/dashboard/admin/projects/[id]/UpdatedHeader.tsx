import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";

// Define the contact interface based on your API response.
interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  mailingAddress?: string;
  imageUrl?: string;
  password?: string;
  maprEmail?: string;
  mprPassword?: string;
  maprNumero?: string;
  // add any other fields if needed
}

// Update props to receive a contactId.
interface UpdatedHeaderProps {
  contactId: string;
}

// Helper function to get initials from the contact's name.
function getInitiales(nom: string): string {
  if (!nom) return "";
  const parties = nom.split(" ").filter((part) => part.length > 0);
  return parties
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export default function UpdatedHeader({ contactId }: UpdatedHeaderProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUIPassword, setShowUIPassword] = useState(false);
  const [showMPRPassword, setShowMPRPassword] = useState(false);

  // Fetch the contact data from your API based on the contactId.
  useEffect(() => {
    if (!contactId) return;
    fetch(`/api/contacts/${contactId}`)
      .then((res) => res.json())
      .then((data: Contact) => {
        setContact(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contact data:", err);
        setLoading(false);
      });
  }, [contactId]);

  if (loading || !contact) {
    return <div>Loading...</div>;
  }

  // Map the contact fields to the ones you need.
  const adresse = contact.mailingAddress || "60 Rue François 1er, 75008 Paris";
  const initiales = getInitiales(contact.name);

  // Function to simulate sending "Accès client" details.
  const handleSendClientAccess = () => {
    fetch(`/api/send-access/client/${contact._id}`, { method: "POST" })
      .then(() => alert("Accès client envoyé!"))
      .catch((err) => {
        console.error("Error sending client access:", err);
        alert("Erreur lors de l'envoi de l'accès client");
      });
  };

  // Function to simulate sending "Accès Ma Prime Renov" details.
  const handleSendMPRAccess = () => {
    fetch(`/api/send-access/mapr/${contact._id}`, { method: "POST" })
      .then(() => alert("Accès Ma Prime Renov envoyé!"))
      .catch((err) => {
        console.error("Error sending Ma Prime Renov access:", err);
        alert("Erreur lors de l'envoi de l'accès Ma Prime Renov");
      });
  };

  return (
    <div className="relative pt-3">
      {/* Sample text positioned higher (outside the header) */}
      <div className="absolute -top-4 right-0 mr-4 text-sm text-gray-500 z-50">
        Dernière connexion il y a 2h
      </div>

      <header className="bg-white bg-opacity-60">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl shadow-gray-200/60 p-8 md:grid md:grid-cols-[1fr_1.3fr] items-stretch gap-12 border border-gray-100"
        >
          {/* Left Column – Client Information */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <motion.div whileHover={{ x: 2 }} className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profil du client
                </span>
                <h1 className="text-3xl font-light text-gray-900">
                  {contact.name}
                  <span className="ml-2 text-blue-600 text-xl align-top">®</span>
                </h1>
              </motion.div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <MapPinIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">{adresse}</span>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <PhoneIcon className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  {contact.phone || "+33(0)1 12 34 45 56"}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-6 border-t border-gray-100">
              {/* Section: Accès client */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Accès client</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowUIPassword(!showUIPassword)}
                      className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {showUIPassword ? (
                        <EyeSlashIcon className="w-4 h-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2.5 rounded-lg">
                  <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-mono">
                    {contact.email || "client@exemple.com"}
                  </span>
                </div>
                {/* Password */}
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2.5 rounded-lg">
                  <LockClosedIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-mono">
                    {showUIPassword ? contact.password || "test123" : "••••••••"}
                  </span>
                </div>
                {/* Premium styled button to send "Accès client" */}
                <button
                  onClick={handleSendClientAccess}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-blue-200 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150"
                >
                  Envoyer Accès client
                </button>
              </div>

              {/* Section: Accès Ma Prime Renov */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Accès Ma Prime Renov
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowMPRPassword(!showMPRPassword)}
                      className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {showMPRPassword ? (
                        <EyeSlashIcon className="w-4 h-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Ma Prime Renov Email */}
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2.5 rounded-lg">
                  <img src="/Group 9.svg" alt="Logo Ma Prime Renov" className="w-5 h-5" />
                  <span className="font-mono">
                    {contact.maprEmail || "maprimerenov@exemple.com"}
                  </span>
                </div>
                {/* Ma Prime Renov Password */}
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2.5 rounded-lg">
                  <LockClosedIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-mono">
                    {showMPRPassword ? contact.mprPassword || "test123" : "••••••••"}
                  </span>
                </div>
                {/* Premium styled button to send "Accès Ma Prime Renov" */}
                <button
                  onClick={handleSendMPRAccess}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-green-200 text-xs font-semibold text-green-600 bg-green-50 rounded-full hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-150"
                >
                  Envoyer Accès Ma Prime Renov
                </button>
              </div>
            </div>
          </div>

          {/* Right Column – Map & Avatar */}
          <div className="flex flex-col md:flex-row md:items-stretch md:space-x-6">
            {/* Map Section */}
            <div className="relative flex-1 rounded-xl overflow-hidden bg-gray-50">
              <iframe
                title="Streetview"
                className="absolute inset-0 w-full h-full"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  adresse
                )}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      circle at center, 
                      rgba(255, 255, 255, 0) 70%, 
                      rgba(255, 255, 255, 0.95) 100%
                    )
                  `,
                }}
              />

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">
                  Localisation de la propriété
                </span>
                <span className="block text-sm text-gray-500 truncate">
                  {adresse}
                </span>
              </div>
            </div>

            {/* Avatar Section – Now aligned at the top */}
            <div className="flex flex-col items-center md:items-start">
              <motion.div whileHover={{ scale: 1.02 }} className="relative group">
                <div className="absolute inset-0 rounded-full transform transition-all group-hover:scale-105 group-hover:bg-gradient-to-r from-blue-200/30 to-purple-200/30" />
                {contact.imageUrl ? (
                  <img
                    src={contact.imageUrl}
                    alt="Avatar"
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white shadow-xl">
                    <span className="text-2xl font-bold text-gray-700">{initiales}</span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              </motion.div>

              <div className="text-center mt-4">
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ID Ma Prime Renov
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {contact.maprNumero || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </header>
    </div>
  );
}
