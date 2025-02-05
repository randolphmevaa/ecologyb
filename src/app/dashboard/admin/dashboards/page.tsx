"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
// import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/Header";
import {
  ChartBarIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Liste des tableaux de bord disponibles
const dashboardOptions: string[] = [
  "Tableau des opportunités",
  "Tableau des projets",
  "Tableau des prospects",
];

// Types for props
interface DashboardSelectorProps {
  selected: string;
  onSelect: (option: string) => void;
}

interface NewDashboardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

// Composant DashboardSelector : Permet à l'utilisateur de sélectionner le tableau de bord à afficher.
function DashboardSelector({ selected, onSelect }: DashboardSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {dashboardOptions.map((option) => (
        <motion.button
          key={option}
          onClick={() => onSelect(option)}
          whileHover={{ scale: 1.05 }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selected === option
              ? "bg-[#2a75c7] text-white shadow-lg"
              : "bg-gray-100 text-[#1a365d] hover:bg-gray-200"
          }`}
          aria-pressed={selected === option}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
}

// Composant PerformanceChart : Un exemple de graphique affichant les indicateurs de performance.
function PerformanceChart() {
  return (
    <motion.div
      className="p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-[#bfddf9]/40"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <ChartBarIcon className="h-7 w-7 text-[#2a75c7]" />
        <h2 className="text-2xl font-semibold text-[#1a4231]">Performance</h2>
      </div>
      {/* Contenu d'exemple : Remplacez par l'intégration de votre graphique */}
      <div className="h-72 flex items-center justify-center text-gray-500">
        <span className="text-lg">Graphique de performance ici</span>
      </div>
    </motion.div>
  );
}

// Composant RevenueReport : Un exemple de graphique affichant les revenus.
function RevenueReport() {
  return (
    <motion.div
      className="p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-[#d2fcb2]/40"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <ChartBarIcon className="h-7 w-7 text-[#2a8547]" />
        <h2 className="text-2xl font-semibold text-[#1a4231]">Rapport de revenus</h2>
      </div>
      {/* Contenu d'exemple : Remplacez par l'intégration de votre graphique */}
      <div className="h-72 flex items-center justify-center text-gray-500">
        <span className="text-lg">Graphique des revenus ici</span>
      </div>
    </motion.div>
  );
}

// Composant NewDashboardModal : Une fenêtre modale élégante pour ajouter un nouveau tableau de bord.
function NewDashboardModal({
  open,
  onClose,
  onCreate,
}: NewDashboardModalProps) {
  const [dashboardName, setDashboardName] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Intégrez ici votre logique de création de tableau de bord.
    onCreate(dashboardName);
    setDashboardName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Fermer la fenêtre"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold text-[#1a365d] mb-6">
              Ajouter un tableau de bord
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du tableau de bord
                </label>
                <input
                  type="text"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90 p-2"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Créer</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Composant DashboardsPage : Combine le Sidebar, le Header, le sélecteur de tableau de bord, les graphiques et la modale d'ajout.
export default function DashboardsPage() {
  const [selectedDashboard, setSelectedDashboard] = useState<string>(dashboardOptions[0]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleCreateDashboard = (name: string) => {
    // Pour la démo, nous ajoutons le nouveau tableau à la liste et le sélectionnons.
    // Dans une application réelle, vous devriez persister ces données via un backend.
    dashboardOptions.push(name);
    setSelectedDashboard(name);
  };

  return (
    <div className="flex h-screen bg-[#ffffff]">
      {/* Zone de la barre latérale */}
      <motion.div
        className="relative border-r border-[#bfddf9]/40 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* <Sidebar role="admin" /> */}
      </motion.div>

      {/* Zone de contenu principale */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-10 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-3xl font-bold text-[#1a365d] mb-2">
                Tableaux de bord analytiques
              </h1>
              <DashboardSelector
                selected={selectedDashboard}
                onSelect={setSelectedDashboard}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setModalOpen(true)}>
                <PlusCircleIcon className="h-5 w-5 mr-2" /> Ajouter un tableau
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <PerformanceChart />
            <RevenueReport />
          </div>
        </main>
      </div>

      <NewDashboardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateDashboard}
      />
    </div>
  );
}
