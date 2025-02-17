"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
// import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/Header";
import {
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const solutions: string[] = [
  "Toutes",
  "Pompe à chaleur",
  "Chauffe-eau solaire individuel",
  "Chauffe-eau thermodynamique",
  "Système solaire combiné",
];

type TaskStatus = "pending" | "completed" | "in-progress";

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  solution: string;
}

const tasksData: Task[] = [
  {
    id: 1,
    title: "Installer pompe à chaleur - Site A",
    status: "pending",
    solution: "Pompe à chaleur",
  },
  {
    id: 2,
    title: "Suivi maintenance - Chauffe-eau solaire individuel",
    status: "completed",
    solution: "Chauffe-eau solaire individuel",
  },
  {
    id: 3,
    title: "Réunion technique - Système solaire combiné",
    status: "in-progress",
    solution: "Système solaire combiné",
  },
  {
    id: 4,
    title: "Devis pour chauffe-eau thermodynamique - Client B",
    status: "pending",
    solution: "Chauffe-eau thermodynamique",
  },
];

// Define props for TaskFilter
interface TaskFilterProps {
  selected: string;
  onSelect: (solution: string) => void;
}

//
// TaskFilter: Displays filtering chips with smooth transitions.
//
function TaskFilter({ selected, onSelect }: TaskFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-1">
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-[#1a365d]" />
        <span className="text-sm font-medium text-[#1a365d]">
          Filtrer par solution:
        </span>
      </div>
      {solutions.map((sol) => (
        <button
          key={sol}
          onClick={() => onSelect(sol)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
            selected === sol
              ? "bg-[#2a75c7] text-white shadow-md"
              : "bg-gray-100 text-[#1a365d] hover:bg-gray-200"
          }`}
          aria-pressed={selected === sol}
        >
          {sol}
        </button>
      ))}
    </div>
  );
}

//
// TaskList: Displays a list of tasks with filtering and smooth animations.
//
function TaskList() {
  const [selectedSolution, setSelectedSolution] = useState("Toutes");

  const filteredTasks =
    selectedSolution === "Toutes"
      ? tasksData
      : tasksData.filter((task) => task.solution === selectedSolution);

  const statusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "pending":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case "in-progress":
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div>
      <TaskFilter selected={selectedSolution} onSelect={setSelectedSolution} />
      <div className="space-y-4">
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              className="p-5 bg-white/90 backdrop-blur-sm rounded-xl shadow border border-[#bfddf9]/20 flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4">
                {statusIcon(task.status)}
                <div>
                  <p className="font-semibold text-[#1a365d]">
                    {task.title}
                  </p>
                  <span className="text-xs text-gray-500">
                    {task.solution}
                  </span>
                </div>
              </div>
              <div className="mt-3 md:mt-0">
                <Button variant="outline">Détails</Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            Aucune tâche trouvée pour cette solution.
          </div>
        )}
      </div>
    </div>
  );
}

//
// CalendarGrid: Displays a sample month view with events.
//
function CalendarGrid() {
  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  // Simulate a month that starts on Tuesday (offset of 2) with 30 days.
  const startOffset = 2;
  const totalDays = 30;
  const monthDays = [];

  // Add empty cells for the offset.
  for (let i = 0; i < startOffset; i++) {
    monthDays.push({ day: "", events: [] });
  }

  // Add days with sample events.
  for (let d = 1; d <= totalDays; d++) {
    const events = [];
    if (d === 3) events.push("Réunion");
    if (d === 8) events.push("Installation");
    if (d === 15) events.push("Devis");
    if (d === 22) events.push("Maintenance");
    if (d === 27) events.push("Inspection");
    monthDays.push({ day: d, events });
  }

  // Pad the grid so that the total number of cells is a multiple of 7.
  while (monthDays.length % 7 !== 0) {
    monthDays.push({ day: "", events: [] });
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
        {daysOfWeek.map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((cell, index) => (
          <div
            key={index}
            className="border border-gray-200 h-20 p-1 flex flex-col"
          >
            <div className="text-sm font-bold text-gray-700">
              {cell.day}
            </div>
            <div className="flex-1 overflow-hidden text-xs mt-1">
              {cell.events.map((event, i) => (
                <div
                  key={i}
                  className="bg-[#d2fcb2] text-[#1a4231] rounded px-1 my-0.5 truncate"
                  title={event}
                >
                  {event}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//
// TaskCalendar: A polished calendar widget that now shows a sample month view with events.
//
function TaskCalendar() {
  return (
    <motion.div
      className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow border border-[#d2fcb2]/30"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <CalendarIcon className="h-6 w-6 text-[#2a8547]" />
        <h2 className="text-xl font-semibold text-[#1a4231]">
          Calendrier des Tâches
        </h2>
      </div>
      <CalendarGrid />
    </motion.div>
  );
}

//
// TasksPage: Combines the sidebar, header, task list, and calendar into a refined CRM tasks interface.
//
export default function TasksPage() {
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
        <Header
  
        />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">
              Gestion des tâches
            </h1>
            <Button>Nouvelle tâche</Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TaskList />
            <TaskCalendar />
          </div>
        </main>
      </div>
    </div>
  );
}
