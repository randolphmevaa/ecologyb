"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
// import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/Header";
import { ClockIcon } from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------

// For the AddProjectModal component props
interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProject: { projectName: string; description: string }) => void;
}

// For Kanban tasks and statuses
interface KanbanTask {
  id: number;
  title: string;
  assignee: string;
  due: string;
}

type KanbanStatus = "À faire" | "En cours" | "Terminé";

// ---------------------------------------------------------------------
// Sample Data
// ---------------------------------------------------------------------

// Timeline events for the project (expand as needed)
const timelineEvents = [
  {
    id: 1,
    title: "Kickoff Meeting",
    date: "2025-02-01",
    description: "Lancement du projet et présentation aux équipes.",
  },
  {
    id: 2,
    title: "Phase de Design",
    date: "2025-02-10",
    description: "Finalisation des maquettes et spécifications techniques.",
  },
  {
    id: 3,
    title: "Début du Développement",
    date: "2025-02-15",
    description: "Lancement du développement de la solution CRM.",
  },
  {
    id: 4,
    title: "Phase de Test",
    date: "2025-03-01",
    description: "Démarrage des tests qualité et validations.",
  },
  {
    id: 5,
    title: "Lancement Officiel",
    date: "2025-03-15",
    description: "Mise en production et démonstration au client.",
  },
];

// Kanban data grouped by status
const kanbanData: Record<KanbanStatus, KanbanTask[]> = {
  "À faire": [
    { id: 1, title: "Planification de projet", assignee: "Alice", due: "2025-02-05" },
    { id: 2, title: "Rédaction du cahier des charges", assignee: "Bob", due: "2025-02-07" },
  ],
  "En cours": [
    { id: 3, title: "Développement de la solution", assignee: "Charlie", due: "2025-02-20" },
    { id: 4, title: "Révision du design", assignee: "Diane", due: "2025-02-18" },
  ],
  "Terminé": [
    { id: 5, title: "Kickoff Meeting", assignee: "Eve", due: "2025-02-01" },
  ],
};

// ---------------------------------------------------------------------
// AddProjectModal Component
// ---------------------------------------------------------------------
function AddProjectModal({ isOpen, onClose, onSave }: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  function handleSave() {
    // Process the new project data
    onSave({ projectName, description });
    setProjectName("");
    setDescription("");
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-xl font-bold text-[#1a365d] mb-4">Ajouter un nouveau projet</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1a365d] mb-1">Nom du projet</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a75c7]"
                  placeholder="Nom du projet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a365d] mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a75c7]"
                  placeholder="Description du projet"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>Enregistrer</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------
// ProjectTimeline Component
// ---------------------------------------------------------------------
function ProjectTimeline() {
  return (
    <motion.div
      className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow border border-[#d2fcb2]/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-[#1a4231] mb-4">Timeline du projet</h2>
      <div className="relative">
        <div className="border-l-2 border-gray-200 pl-6">
          {timelineEvents.map((event) => (
            <motion.div
              key={event.id}
              className="mb-6 relative pl-4"
              whileHover={{ scale: 1.02 }}
            >
              {/* Timeline marker */}
              <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-[#2a75c7] flex items-center justify-center">
                <ClockIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a365d]">{event.title}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-700">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------
// ProjectKanban Component
// ---------------------------------------------------------------------
function ProjectKanban() {
  // Type assertion: columns are of type KanbanStatus[]
  const columns = Object.keys(kanbanData) as KanbanStatus[];

  return (
    <motion.div
      className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow border border-[#bfddf9]/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-[#1a4231] mb-4">Tableau Kanban</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col} className="flex flex-col bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-[#1a365d] mb-3">{col}</h3>
            <div className="space-y-3">
              {kanbanData[col].map((task: KanbanTask) => (
                <motion.div
                  key={task.id}
                  className="p-4 bg-white rounded-md shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="font-semibold text-[#1a365d]">{task.title}</p>
                  <p className="text-xs text-gray-500">Assigné à: {task.assignee}</p>
                  <p className="text-xs text-gray-500">Échéance: {task.due}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------
// ProjectsPage Component
// ---------------------------------------------------------------------
export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);

  function handleAddProject(newProject: { projectName: string; description: string }) {
    // Process the new project data here (e.g., send to an API or update state)
    console.log("New Project Added:", newProject);
  }

  return (
    <div className="flex h-screen bg-white">
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
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          {/* Header row with title and action button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Gestion de projet</h1>
            <Button onClick={() => setShowModal(true)}>Ajouter un projet</Button>
          </div>
          {/* Grid layout for Timeline and Kanban board */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProjectTimeline />
            <ProjectKanban />
          </div>
        </main>
      </div>

      {/* Modal for adding a new project */}
      <AddProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddProject}
      />
    </div>
  );
}
