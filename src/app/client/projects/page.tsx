"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  FireIcon,
  SunIcon,
  BoltIcon,
  Squares2X2Icon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { FC, SVGProps } from "react";

type Solution =
  | "Pompes a chaleur"
  | "Chauffe-eau solaire individuel"
  | "Chauffe-eau thermodynamique"
  | "Système Solaire Combiné";


// Mapping of energy solutions to their respective icons
const solutionIcons: Record<
  Solution,
  FC<SVGProps<SVGSVGElement>>
> = {
  "Pompes a chaleur": FireIcon,
  "Chauffe-eau solaire individuel": SunIcon,
  "Chauffe-eau thermodynamique": BoltIcon,
  "Système Solaire Combiné": Squares2X2Icon,
};

// Sample projects data with steps
const projects = [
  {
    id: 1,
    title: "Installation Pompe à chaleur - Maison Dupont",
    solution: "Pompes a chaleur",
    status: "En cours",
    currentStep: 1, // Zero-based index: step 0 completed, now at step 1
    steps: [
      { id: 1, name: "Prévisualisation", completed: true },
      { id: 2, name: "Documents", completed: false },
      { id: 3, name: "Validation", completed: false },
      { id: 4, name: "Installation", completed: false },
    ],
    description:
      "Installation d'une pompe à chaleur haute performance pour optimiser le chauffage.",
  },
  {
    id: 2,
    title: "Chauffe-eau Solaire - Résidence Martin",
    solution: "Chauffe-eau solaire individuel",
    status: "Terminé",
    currentStep: 3,
    steps: [
      { id: 1, name: "Prévisualisation", completed: true },
      { id: 2, name: "Documents", completed: true },
      { id: 3, name: "Validation", completed: true },
      { id: 4, name: "Installation", completed: true },
    ],
    description:
      "Mise en place d'un chauffe-eau solaire pour une efficacité énergétique optimale.",
  },
  {
    id: 3,
    title: "Projet Thermodynamique - Immeuble Central",
    solution: "Chauffe-eau thermodynamique",
    status: "En attente",
    currentStep: 0,
    steps: [
      { id: 1, name: "Prévisualisation", completed: false },
      { id: 2, name: "Documents", completed: false },
      { id: 3, name: "Validation", completed: false },
      { id: 4, name: "Installation", completed: false },
    ],
    description:
      "Projet innovant combinant chauffe-eau thermodynamique et solutions complémentaires.",
  },
  {
    id: 4,
    title: "Système Solaire Combiné - Complexe Résidentiel",
    solution: "Système Solaire Combiné",
    status: "En cours",
    currentStep: 2,
    steps: [
      { id: 1, name: "Prévisualisation", completed: true },
      { id: 2, name: "Documents", completed: true },
      { id: 3, name: "Validation", completed: false },
      { id: 4, name: "Installation", completed: false },
    ],
    description:
      "Intégration de plusieurs technologies solaires pour une performance globale.",
  },
];

// Define a type for a single step
interface Step {
  id: number;
  name: string;
  completed: boolean;
}

// interface Project {
//   id: number;
//   title: string;
//   solution: Solution;
//   status: string;
//   currentStep: number;
//   steps: {
//     id: number;
//     name: string;
//     completed: boolean;
//   }[];
//   description: string;
// }

// Define the props for the StepTracker component
interface StepTrackerProps {
  steps: Step[];
  currentStep: number;
}

/**
 * StepTracker component renders the steps for a project.
 * It displays a circular indicator for each step:
 *  - A check icon if the step is completed.
 *  - The step number if pending.
 * A horizontal line connects each step.
 */
const StepTracker = ({ steps, currentStep }: StepTrackerProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex-1 flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                step.completed
                  ? "bg-green-600"
                  : index === currentStep
                  ? "bg-green-400"
                  : "bg-gray-200"
              }`}
            >
              {step.completed ? (
                <CheckIcon className="h-5 w-5 text-white" />
              ) : (
                <span className="text-sm font-medium text-white">
                  {index + 1}
                </span>
              )}
            </div>
            <span className="mt-1 text-xs text-gray-600 text-center">
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 bg-gray-300 mx-2 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function ClientProjects() {
  const [filter, setFilter] = useState("Tous");

  // Filter projects by solution type (or show all)
  const filteredProjects =
    filter === "Tous"
      ? projects
      : projects.filter((project) => project.solution === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header component for consistent navigation */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Mes Projets</h1>
          <p className="mt-2 text-lg text-gray-600">
            Suivez l&apos;avancement de vos projets d&apos;installations énergétiques et
            vérifiez si des documents supplémentaires sont nécessaires.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            "Tous",
            "Pompes a chaleur",
            "Chauffe-eau solaire individuel",
            "Chauffe-eau thermodynamique",
            "Système Solaire Combiné",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                filter === item
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-green-50"
              }`}
            >
              {item}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {filteredProjects.map((project) => {
            const Icon = solutionIcons[project.solution as keyof typeof solutionIcons];
            return (
              <motion.div
                key={project.id}
                className="p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#bfddf9]/30 bg-white hover:border-[#d2fcb2]/50 hover:bg-gradient-to-br hover:from-white hover:to-[#bfddf9]/10"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {project.title}
                    </h2>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {project.status}
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {project.description}
                </p>

                {/* Step Tracker */}
                <StepTracker steps={project.steps} currentStep={project.currentStep} />

                {/* Call-to-Action for Adding Documents (if the current step is "Documents") */}
                {project.steps[project.currentStep] &&
                  project.steps[project.currentStep].name === "Documents" && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-full transition-colors hover:bg-green-700"
                    >
                      Ajouter Document <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </motion.button>
                  )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Projects Message */}
        {filteredProjects.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucun projet trouvé pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
