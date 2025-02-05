"use client";

import { cn } from "@/lib/utils";

const mockTasks = [
  { id: 1, title: "Révision contrat client", dueDate: "2024-03-25", status: "En cours", priority: "Haute" },
  { id: 2, title: "Préparer rapport trimestriel", dueDate: "2024-03-28", status: "À faire", priority: "Moyenne" },
  { id: 3, title: "Suivi leads potentiels", dueDate: "2024-04-01", status: "Terminé", priority: "Basse" },
];

export const TaskList = () => {
  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gray-50 p-4 border-b font-semibold text-gray-600">
        Liste des tâches
      </div>
      <div className="divide-y">
        {mockTasks.map((task) => (
          <div 
            key={task.id}
            className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                Échéance: {task.dueDate}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                task.status === "Terminé" ? "bg-green-100 text-green-800" :
                task.status === "En cours" ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {task.status}
              </span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                task.priority === "Haute" ? "bg-red-100 text-red-800" :
                task.priority === "Moyenne" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};