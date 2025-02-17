"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
// import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/Header";
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Sample email data
const sampleEmails = [
  {
    id: 1,
    sender: "contact@energiepro.fr",
    subject: "Nouvelle offre pour pompe à chaleur",
    snippet: "Bonjour, découvrez notre nouvelle offre spécialement conçue pour vos besoins...",
    date: "2025-01-30",
  },
  {
    id: 2,
    sender: "support@energiepro.fr",
    subject: "Mise à jour de votre dossier",
    snippet: "Votre demande concernant le chauffe-eau solaire individuel a été traitée...",
    date: "2025-01-29",
  },
  {
    id: 3,
    sender: "commercial@energiepro.fr",
    subject: "Invitation à la conférence sur l'énergie solaire",
    snippet: "Nous avons le plaisir de vous inviter à notre conférence annuelle sur les solutions énergétiques...",
    date: "2025-01-28",
  },
];

// EmailComposer Component: A modal form for composing new emails.
function EmailComposer() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would integrate your send email logic.
    console.log("Sending email", form);
    setForm({ to: "", subject: "", body: "" });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PaperAirplaneIcon className="h-5 w-5 mr-2 inline" /> Nouveau message
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close composer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-[#1a365d] mb-4">Composer un email</h2>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">À</label>
                  <input
                    type="email"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Objet</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Envoyer</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// EmailList Component: Displays a list of email messages with rich, animated cards.
function EmailList() {
  return (
    <div className="space-y-4">
      {sampleEmails.map((email) => (
        <motion.div
          key={email.id}
          className="p-5 bg-white/90 backdrop-blur-sm rounded-xl shadow border border-[#bfddf9]/20 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <EnvelopeIcon className="h-6 w-6 text-[#2a75c7]" />
            <div>
              <p className="font-semibold text-[#1a365d]">{email.subject}</p>
              <p className="text-xs text-gray-500">
                De: {email.sender} — {email.date}
              </p>
              <p className="text-sm text-gray-600 mt-1">{email.snippet}</p>
            </div>
          </div>
          <div className="mt-3 md:mt-0">
            <Button variant="outline">Lire</Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

//
// EmailsPage: Combines the Sidebar, Header, EmailComposer, and EmailList for a premium emails UI.
//
export default function EmailsPage() {
  return (
    <div className="flex h-screen bg-[#ffffff]">
      {/* Sidebar Area */}
      <motion.div
        className="relative border-r border-[#bfddf9]/30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* <Sidebar role="admin" /> */}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Boîte de réception</h1>
            <EmailComposer />
          </div>
          <EmailList />
        </main>
      </div>
    </div>
  );
}
