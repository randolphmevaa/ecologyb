"use client";

import React, { useState, useEffect, useMemo, CSSProperties } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';

import { 
  DragOverlay
} from '@dnd-kit/core';
import { 
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';

import {
  CheckIcon,
  ClockIcon,
  CalendarIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ListBulletIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  ArrowLongRightIcon,
  // CubeIcon,
  PencilIcon,
  LinkIcon,
  TrashIcon,
  FolderIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  TagIcon,
  NoSymbolIcon,
  PlayIcon,
  FunnelIcon,
  FireIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import EnhancedCalendar from "./components/EnhancedCalendar";
import TimelineView from "./components/TimelineView";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
import { 
  Task, 
  User, 
  Project, 
  TaskPriority, 
  TaskStatus, 
  TaskCategory 
} from "./types";
type ViewType = "kanban" | "list" | "calendar" | "timeline" | "gantt";
type GroupBy = "status" | "priority" | "category" | "assignee" | "project" | "due_date" | "none";
type SortBy = "priority" | "due_date" | "created_at" | "title" | "status";
type SortDirection = "asc" | "desc";

// interface Checklist {
//   id: string;
//   title: string;
//   items: {
//     id: string;
//     text: string;
//     completed: boolean;
//   }[];
// }

// interface Comment {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   attachments?: Attachment[];
// }

// interface Attachment {
//   id: string;
//   name: string;
//   type: string;
//   size: number; // in KB
//   url: string;
//   uploaded_at: string;
//   uploaded_by: string;
// }

// interface TaskEvent {
//   id: string;
//   title: string;
//   start_time: string;
//   end_time: string;
// }

const validTaskStatuses: TaskStatus[] = [
  "not_started", 
  "in_progress", 
  "completed"
];

interface SortableTaskCardProps {
  task: Task;
  renderTaskCard: (task: Task) => React.ReactNode;
}

/** ---------------------
 *    UTILITY COMPONENTS
 *  --------------------- */
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const getStatusClasses = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return <ClockIcon className="h-4 w-4" />;
      case "in_progress":
        return <PlayIcon className="h-4 w-4" />;
      case "completed":
        return <CheckIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return "À faire";
      case "in_progress":
        return "En cours";
      case "completed":
        return "Terminé";
      default:
        return "Non défini";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusClasses(status)}`}>
      {getStatusIcon(status)}
      {getStatusLabel(status)}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const getPriorityClasses = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return <FireIcon className="h-3.5 w-3.5" />;
      case "high":
        return <ExclamationCircleIcon className="h-3.5 w-3.5" />;
      case "medium":
        return <FlagIcon className="h-3.5 w-3.5" />;
      case "low":
        return <ChevronDownIcon className="h-3.5 w-3.5" />;
      default:
        return <FlagIcon className="h-3.5 w-3.5" />;
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "Urgent";
      case "high":
        return "Élevée";
      case "medium":
        return "Moyenne";
      case "low":
        return "Basse";
      default:
        return "Non définie";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityClasses(priority)}`}>
      {getPriorityIcon(priority)}
      {getPriorityLabel(priority)}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: TaskCategory }) => {
  const getCategoryClasses = (category: TaskCategory) => {
    switch (category) {
      case "administrative":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "finance":
        return "bg-green-100 text-green-800 border-green-300";
      case "hr":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "compliance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "reporting":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "legal":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "meetings":
        return "bg-pink-100 text-pink-800 border-pink-300";
      case "procurement":
        return "bg-lime-100 text-lime-800 border-lime-300";
      case "onboarding":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "auditing":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case "administrative":
        return <ClipboardDocumentListIcon className="h-3.5 w-3.5" />;
      case "finance":
        return <ChartBarIcon className="h-3.5 w-3.5" />;
      case "hr":
        return <UserIcon className="h-3.5 w-3.5" />;
      case "compliance":
        return <CheckIcon className="h-3.5 w-3.5" />;
      case "reporting":
        return <DocumentTextIcon className="h-3.5 w-3.5" />;
      case "legal":
        return <FolderIcon className="h-3.5 w-3.5" />;
      case "meetings":
        return <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />;
      case "procurement":
        return <TagIcon className="h-3.5 w-3.5" />;
      case "onboarding":
        return <UserIcon className="h-3.5 w-3.5" />;
      case "auditing":
        return <ClipboardDocumentCheckIcon className="h-3.5 w-3.5" />;
      default:
        return <TagIcon className="h-3.5 w-3.5" />;
    }
  };

  const getCategoryLabel = (category: TaskCategory) => {
    switch (category) {
      case "administrative":
        return "Administratif";
      case "finance":
        return "Finances";
      case "hr":
        return "RH";
      case "compliance":
        return "Conformité";
      case "reporting":
        return "Rapports";
      case "legal":
        return "Juridique";
      case "meetings":
        return "Réunions";
      case "procurement":
        return "Achats";
      case "onboarding":
        return "Intégration";
      case "auditing":
        return "Audit";
      default:
        return "Autre";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryClasses(category)}`}>
      {getCategoryIcon(category)}
      {getCategoryLabel(category)}
    </span>
  );
};

const ProgressBar = ({ percentage, small }: { percentage: number, small?: boolean }) => {
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${small ? 'h-1' : 'h-2'}`}>
        <div 
          className={`h-full rounded-full ${
            validPercentage === 100 
              ? 'bg-green-500' 
              : validPercentage >= 75 
                ? 'bg-blue-500' 
                : validPercentage >= 50 
                  ? 'bg-yellow-500' 
                  : validPercentage >= 25 
                    ? 'bg-orange-500' 
                    : 'bg-red-500'
          }`}
          style={{ width: `${validPercentage}%` }}
        ></div>
      </div>
      {!small && (
        <span className="text-xs text-gray-600">{validPercentage}%</span>
      )}
    </div>
  );
};

const UserAvatar = ({ user, size = "md" }: { user: User | string, size?: "sm" | "md" | "lg" }) => {
  // If user is a string, assume it's a user ID that we couldn't resolve
  if (typeof user === 'string') {
    return (
      <div className={`
        ${size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm'}
        rounded-full bg-gray-200 flex items-center justify-center text-gray-500
      `}>
        <UserIcon className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
      </div>
    );
  }

  return (
    <div className="relative">
      {user.avatar_url ? (
        <img 
          src={user.avatar_url} 
          alt={`${user.firstName} ${user.lastName}`}
          className={`
            ${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'}
            rounded-full object-cover
          `}
        />
      ) : (
        <div className={`
          ${size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm'}
          rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium
        `}>
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
      )}
    </div>
  );
};

function getDisplayName(userOrString: User | string): string {
  if (typeof userOrString === "string") {
    return userOrString;
  }
  return `${userOrString.firstName} ${userOrString.lastName}`;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, renderTaskCard }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
    >
      {renderTaskCard(task)}
    </div>
  );
};

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function TasksPage() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewType, setViewType] = useState<ViewType>("kanban");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "all">("all");
  const [filterAssignee, setFilterAssignee] = useState<string | "all" | "unassigned" | "me">("all");
  const [filterProject, setFilterProject] = useState<string | "all" | "none">("all");
  const [filterDueDate, setFilterDueDate] = useState<"all" | "overdue" | "today" | "tomorrow" | "this_week" | "next_week" | "this_month" | "no_date">("all");
  const [groupBy, setGroupBy] = useState<GroupBy>(viewType === "kanban" ? "status" : "none");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userInfo, setUserInfo] = useState<{ _id: string; email: string } | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "not_started",
    priority: "medium",
    category: "administrative",
    due_date: null,
    assignee_id: null,
    project_id: null,
    tags: [],
    completion_percentage: 0
  });
  
  // Sample users data
  const sampleUsers: User[] = [
    {
      id: "user001",
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@adminco.fr",
      role: "Admin Director",
      avatar_url: "https://randomuser.me/api/portraits/women/32.jpg",
      department: "Administration"
    },
    {
      id: "user002",
      firstName: "Thomas",
      lastName: "Leroy",
      email: "thomas.leroy@adminco.fr",
      role: "HR Manager",
      avatar_url: "https://randomuser.me/api/portraits/men/44.jpg",
      department: "Human Resources"
    },
    {
      id: "user003",
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@adminco.fr",
      role: "Finance Manager",
      avatar_url: "https://randomuser.me/api/portraits/women/62.jpg",
      department: "Finance"
    },
    {
      id: "user004",
      firstName: "Philippe",
      lastName: "Bernard",
      email: "philippe.bernard@adminco.fr",
      role: "Legal Advisor",
      avatar_url: "https://randomuser.me/api/portraits/men/17.jpg",
      department: "Legal"
    },
    {
      id: "user005",
      firstName: "Émilie",
      lastName: "Lambert",
      email: "emilie.lambert@adminco.fr",
      role: "Compliance Officer",
      avatar_url: "https://randomuser.me/api/portraits/women/45.jpg",
      department: "Compliance"
    }
  ];
  
  // Sample projects data
  const sampleProjects: Project[] = [
    {
      id: "project001",
      name: "Restructuration RH",
      client_name: "Interne",
      color: "#4f46e5", // indigo-600
      status: "active"
    },
    {
      id: "project002",
      name: "Audit financier annuel",
      client_name: "Interne",
      color: "#0891b2", // cyan-600
      status: "active"
    },
    {
      id: "project003",
      name: "Migration système comptable",
      client_name: "Interne",
      color: "#65a30d", // lime-600
      status: "active"
    },
    {
      id: "project004",
      name: "Conformité RGPD",
      client_name: "Interne",
      color: "#0284c7", // sky-600
      status: "active"
    },
    {
      id: "project005",
      name: "Refonte procédures administratives",
      client_name: "Interne",
      color: "#9333ea", // purple-600
      status: "planned"
    }
  ];
  
  // Sample tasks data
  const sampleTasks: Task[] = [
    {
      id: "task001",
      title: "Préparer les contrats pour les nouveaux employés du service marketing",
      description: "Rédiger et réviser les contrats de travail pour les 3 nouveaux employés qui rejoindront le service marketing le mois prochain.",
      status: "in_progress",
      priority: "high",
      category: "hr",
      created_at: "2025-03-10T11:30:00Z",
      updated_at: "2025-03-15T14:30:00Z",
      due_date: "2025-04-12T18:00:00Z",
      start_date: "2025-03-10T09:00:00Z",
      assignee_id: "user002",
      creator_id: "user001",
      project_id: "project001",
      parent_task_id: null,
      estimated_hours: 6,
      actual_hours: 4,
      completion_percentage: 65,
      tags: ["contrats", "recrutement", "rh"],
      watchers: ["user001"],
      checklist: [
        {
          id: "checklist001",
          title: "Documents à préparer",
          items: [
            { id: "item001", text: "Contrat de travail", completed: true },
            { id: "item002", text: "Accord de confidentialité", completed: true },
            { id: "item003", text: "Fiche de poste détaillée", completed: true },
            { id: "item004", text: "Manuel d'accueil", completed: false },
            { id: "item005", text: "Formulaires administratifs", completed: false }
          ]
        }
      ],
      comments: [
        {
          id: "comment001",
          user_id: "user001",
          content: "Merci de veiller à bien inclure les clauses spécifiques pour l'utilisation des réseaux sociaux dans le cadre professionnel.",
          created_at: "2025-03-12T10:15:00Z"
        },
        {
          id: "comment002",
          user_id: "user002",
          content: "J'ai ajouté les clauses demandées et fait relire par le service juridique. Je finalise le package d'accueil cette semaine.",
          created_at: "2025-03-12T11:30:00Z"
        }
      ],
      related_events: [
        {
          id: "event001",
          title: "Arrivée des nouveaux employés",
          start_time: "2025-04-15T09:00:00Z",
          end_time: "2025-04-15T12:00:00Z"
        }
      ],
      location: "Bureau RH"
    },
    {
      id: "task002",
      title: "Finaliser le rapport financier trimestriel",
      description: "Compiler les données financières du premier trimestre, analyser les écarts et préparer la présentation pour le comité de direction.",
      status: "in_progress",
      priority: "high",
      category: "finance",
      created_at: "2025-03-14T09:30:00Z",
      updated_at: "2025-03-15T16:45:00Z",
      due_date: "2025-03-25T17:00:00Z",
      start_date: "2025-03-14T09:00:00Z",
      assignee_id: "user003",
      creator_id: "user001",
      project_id: "project002",
      parent_task_id: null,
      estimated_hours: 12,
      actual_hours: 7,
      completion_percentage: 60,
      tags: ["rapport", "finance", "trimestriel"],
      watchers: ["user001"],
      checklist: [
        {
          id: "checklist002",
          title: "Éléments à inclure",
          items: [
            { id: "item006", text: "Synthèse des résultats", completed: true },
            { id: "item007", text: "Analyse des écarts budgétaires", completed: true },
            { id: "item008", text: "Graphiques d'évolution", completed: true },
            { id: "item009", text: "Prévisions pour le prochain trimestre", completed: false },
            { id: "item010", text: "Recommandations stratégiques", completed: false }
          ]
        }
      ],
      related_events: [
        {
          id: "event002",
          title: "Présentation au comité de direction",
          start_time: "2025-03-28T14:00:00Z",
          end_time: "2025-03-28T16:00:00Z"
        }
      ],
      is_favorite: true
    },
    {
      id: "task003",
      title: "Mettre à jour la politique de protection des données",
      description: "Réviser la politique RGPD actuelle, intégrer les dernières exigences réglementaires et faire valider par le service juridique.",
      status: "not_started",
      priority: "medium",
      category: "compliance",
      created_at: "2025-03-15T11:20:00Z",
      updated_at: "2025-03-15T11:20:00Z",
      due_date: "2025-04-05T18:00:00Z",
      start_date: null,
      assignee_id: "user005",
      creator_id: "user001",
      project_id: "project004",
      parent_task_id: null,
      estimated_hours: 8,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["rgpd", "conformité", "données"],
      watchers: ["user001", "user004"],
      external_links: [
        { title: "Guide CNIL", url: "https://example.com/cnil" },
        { title: "Politique actuelle", url: "https://example.com/policy" }
      ]
    },
    {
      id: "task004",
      title: "Organiser la journée d'intégration des nouveaux employés",
      description: "Planifier le programme, réserver les salles, préparer les présentations et coordonner avec les différents services pour l'accueil des nouveaux employés.",
      status: "not_started",
      priority: "medium",
      category: "onboarding",
      created_at: "2025-03-16T09:45:00Z",
      updated_at: "2025-03-16T09:45:00Z",
      due_date: "2025-04-14T18:00:00Z",
      start_date: null,
      assignee_id: "user002",
      creator_id: "user001",
      project_id: "project001",
      parent_task_id: null,
      estimated_hours: 10,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["onboarding", "intégration", "formation"],
      watchers: ["user001"],
      related_events: [
        {
          id: "event003",
          title: "Journée d'intégration",
          start_time: "2025-04-15T09:00:00Z",
          end_time: "2025-04-15T17:00:00Z"
        }
      ],
      attachments: [
        {
          id: "att001",
          name: "Programme_integration.pdf",
          type: "application/pdf",
          size: 1450,
          url: "#",
          uploaded_at: "2025-03-16T09:45:00Z",
          uploaded_by: "user001"
        }
      ]
    },
    {
      id: "task005",
      title: "Préparer l'audit interne des procédures comptables",
      description: "Élaborer le plan d'audit, identifier les processus critiques à examiner et préparer les questionnaires pour les entretiens avec les équipes.",
      status: "not_started",
      priority: "high",
      category: "auditing",
      created_at: "2025-03-16T14:30:00Z",
      updated_at: "2025-03-16T14:30:00Z",
      due_date: "2025-04-10T18:00:00Z",
      start_date: null,
      assignee_id: "user003",
      creator_id: "user001",
      project_id: "project002",
      parent_task_id: null,
      estimated_hours: 20,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["audit", "comptabilité", "procédures"],
      watchers: ["user001"],
      related_tasks: ["task007"],
      checklist: [
        {
          id: "checklist003",
          title: "Éléments à auditer",
          items: [
            { id: "item011", text: "Procédures d'achat", completed: false },
            { id: "item012", text: "Processus de facturation", completed: false },
            { id: "item013", text: "Gestion des notes de frais", completed: false },
            { id: "item014", text: "Contrôles internes", completed: false },
            { id: "item015", text: "Rapprochements bancaires", completed: false }
          ]
        }
      ]
    },
    {
      id: "task006",
      title: "Réviser les contrats avec les fournisseurs principaux",
      description: "Examiner les contrats actuels avec nos principaux fournisseurs, identifier les opportunités de renégociation et préparer les amendements nécessaires.",
      status: "not_started",
      priority: "medium",
      category: "legal",
      created_at: "2025-03-16T10:30:00Z",
      updated_at: "2025-03-16T10:30:00Z",
      due_date: "2025-04-20T18:00:00Z",
      start_date: null,
      assignee_id: "user004",
      creator_id: "user001",
      project_id: null,
      parent_task_id: null,
      estimated_hours: 15,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["contrats", "fournisseurs", "juridique"],
      watchers: ["user001", "user003"],
      related_events: [
        {
          id: "event004",
          title: "Réunion équipe juridique",
          start_time: "2025-03-25T14:00:00Z",
          end_time: "2025-03-25T16:00:00Z"
        }
      ]
    },
    {
      id: "task007",
      title: "Préparer le dossier pour la certification ISO 9001",
      description: "Rassembler la documentation requise, revoir les procédures qualité et préparer l'entreprise pour l'audit de certification.",
      status: "not_started",
      priority: "medium",
      category: "compliance",
      created_at: "2025-03-12T11:15:00Z",
      updated_at: "2025-03-16T09:30:00Z",
      due_date: "2025-05-15T18:00:00Z",
      start_date: null,
      assignee_id: "user005",
      creator_id: "user001",
      project_id: null,
      parent_task_id: null,
      estimated_hours: 40,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["iso9001", "certification", "qualité"],
      watchers: ["user001"],
      related_tasks: ["task005"],
      comments: [
        {
          id: "comment003",
          user_id: "user001",
          content: "Cette tâche doit attendre que nous ayons finalisé l'audit interne. Je la reporte à mai.",
          created_at: "2025-03-16T09:30:00Z"
        }
      ]
    },
    {
      id: "task008",
      title: "Mettre à jour le registre des actifs informatiques",
      description: "Recenser tous les équipements informatiques, mettre à jour l'inventaire et documenter les configurations matérielles et logicielles.",
      status: "completed",
      priority: "medium",
      category: "administrative",
      created_at: "2025-03-01T10:00:00Z",
      updated_at: "2025-03-10T16:45:00Z",
      due_date: "2025-03-15T18:00:00Z",
      start_date: "2025-03-05T09:00:00Z",
      assignee_id: "user001",
      creator_id: "user001",
      project_id: "project005",
      parent_task_id: null,
      estimated_hours: 12,
      actual_hours: 10,
      completion_percentage: 100,
      tags: ["inventaire", "informatique", "actifs"],
      watchers: [],
      checklist: [
        {
          id: "checklist004",
          title: "Catégories d'actifs",
          items: [
            { id: "item016", text: "Ordinateurs portables", completed: true },
            { id: "item017", text: "Ordinateurs fixes", completed: true },
            { id: "item018", text: "Serveurs", completed: true },
            { id: "item019", text: "Périphériques", completed: true },
            { id: "item020", text: "Équipements réseau", completed: true }
          ]
        }
      ],
      comments: [
        {
          id: "comment004",
          user_id: "user001",
          content: "Inventaire terminé et validé. J'ai également mis à jour notre système de gestion des actifs avec les nouvelles informations.",
          created_at: "2025-03-10T16:45:00Z"
        }
      ]
    },
    {
      id: "task009",
      title: "Organiser la réunion trimestrielle des managers",
      description: "Planifier la réunion, préparer l'ordre du jour, réserver la salle et envoyer les invitations à tous les responsables de service.",
      status: "in_progress",
      priority: "medium",
      category: "meetings",
      created_at: "2025-03-08T09:30:00Z",
      updated_at: "2025-03-14T11:20:00Z",
      due_date: "2025-03-30T18:00:00Z",
      start_date: "2025-03-08T09:30:00Z",
      assignee_id: "user001",
      creator_id: "user001",
      project_id: null,
      parent_task_id: null,
      estimated_hours: 4,
      actual_hours: 2,
      completion_percentage: 50,
      tags: ["réunion", "managers", "trimestriel"],
      watchers: ["user002", "user003"],
      attachments: [
        {
          id: "att002",
          name: "Ordre_du_jour.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 245,
          url: "#",
          uploaded_at: "2025-03-14T11:20:00Z",
          uploaded_by: "user001"
        }
      ],
      comments: [
        {
          id: "comment005",
          user_id: "user001",
          content: "J'ai préparé une première version de l'ordre du jour. Merci de me faire part de vos commentaires avant vendredi.",
          created_at: "2025-03-14T11:20:00Z"
        }
      ]
    },
    {
      id: "task010",
      title: "Élaborer le plan de formation annuel",
      description: "Identifier les besoins en formation pour chaque service, établir un budget prévisionnel et sélectionner les prestataires de formation.",
      status: "not_started",
      priority: "medium",
      category: "hr",
      created_at: "2025-03-16T15:45:00Z",
      updated_at: "2025-03-16T15:45:00Z",
      due_date: "2025-04-15T18:00:00Z",
      start_date: null,
      assignee_id: "user002",
      creator_id: "user001",
      project_id: "project001",
      parent_task_id: null,
      estimated_hours: 18,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["formation", "développement", "rh"],
      watchers: ["user001"],
      is_favorite: true
    },
    {
      id: "task011",
      title: "Finaliser le budget prévisionnel 2026",
      description: "Consolider les prévisions budgétaires de tous les services, analyser les écarts et finaliser le document pour approbation par la direction.",
      status: "not_started",
      priority: "urgent",
      category: "finance",
      created_at: "2025-03-15T16:30:00Z",
      updated_at: "2025-03-15T16:30:00Z",
      due_date: "2025-04-10T18:00:00Z",
      start_date: null,
      assignee_id: "user003",
      creator_id: "user001",
      project_id: "project002",
      parent_task_id: null,
      estimated_hours: 25,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["budget", "finances", "prévision"],
      watchers: ["user001"],
      checklist: [
        {
          id: "checklist005",
          title: "À faire",
          items: [
            { id: "item021", text: "Collecter les prévisions par service", completed: false },
            { id: "item022", text: "Analyser les demandes d'investissement", completed: false },
            { id: "item023", text: "Établir les scénarios financiers", completed: false },
            { id: "item024", text: "Préparer la présentation pour le CA", completed: false }
          ]
        }
      ]
    },
    {
      id: "task012",
      title: "Résoudre le litige avec le fournisseur de services informatiques",
      description: "Examiner les termes du contrat, préparer un dossier de réclamation et organiser une réunion de médiation pour résoudre le différend sur la qualité des services.",
      status: "in_progress",
      priority: "high",
      category: "legal",
      created_at: "2025-03-15T09:30:00Z",
      updated_at: "2025-03-16T14:15:00Z",
      due_date: "2025-03-29T18:00:00Z",
      start_date: "2025-03-15T09:30:00Z",
      assignee_id: "user004",
      creator_id: "user001",
      project_id: null,
      parent_task_id: null,
      estimated_hours: 10,
      actual_hours: 4,
      completion_percentage: 30,
      tags: ["litige", "juridique", "contrat"],
      watchers: ["user001", "user003"],
      comments: [
        {
          id: "comment006",
          user_id: "user004",
          content: "J'ai analysé le contrat et préparé une première version du dossier. Nous sommes en attente des documents complémentaires de la part du service informatique avant de pouvoir avancer.",
          created_at: "2025-03-16T14:15:00Z"
        }
      ]
    }
  ];

  // Set up DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      // Map old statuses to new ones for any existing tasks
      const updatedTasks = sampleTasks.map(task => {
        let updatedStatus = task.status;
        
        // Map the removed statuses to our new simplified set
        // Using type assertion to tell TypeScript this is intentional
        if ((task.status as string) === "under_review" || (task.status as string) === "blocked") {
          updatedStatus = "in_progress";
        } else if ((task.status as string) === "canceled" || (task.status as string) === "deferred") {
          updatedStatus = "not_started";
        }
        
        return {
          ...task,
          status: updatedStatus as TaskStatus
        };
      });
      
      setTasks(updatedTasks);
      setUsers(sampleUsers);
      setProjects(sampleProjects);
      setIsLoading(false);
    }, 1000);
    
    // Get user info from localStorage
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
  }, []);

  // Apply filters and sorting to tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      // Filter by status
      if (filterStatus !== "all" && task.status !== filterStatus) {
        return false;
      }
      
      // Filter by priority
      if (filterPriority !== "all" && task.priority !== filterPriority) {
        return false;
      }
      
      // Filter by category
      if (filterCategory !== "all" && task.category !== filterCategory) {
        return false;
      }
      
      // Filter by assignee
      if (filterAssignee === "unassigned" && task.assignee_id) {
        return false;
      } else if (filterAssignee === "me" && task.assignee_id !== userInfo?._id) {
        return false;
      } else if (filterAssignee !== "all" && filterAssignee !== "unassigned" && filterAssignee !== "me" && task.assignee_id !== filterAssignee) {
        return false;
      }
      
      // Filter by project
      if (filterProject === "none" && task.project_id) {
        return false;
      } else if (filterProject !== "all" && filterProject !== "none" && task.project_id !== filterProject) {
        return false;
      }
      
      // Filter by due date
      if (filterDueDate !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay() + 1));
        
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        
        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        if (filterDueDate === "no_date" && task.due_date) {
          return false;
        } else if (filterDueDate === "overdue") {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          return dueDate < today && task.status !== "completed";
        } else if (filterDueDate === "today") {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          return dueDate.toDateString() === today.toDateString();
        } else if (filterDueDate === "tomorrow") {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          return dueDate.toDateString() === tomorrow.toDateString();
        } else if (filterDueDate === "this_week") {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate >= today && dueDate <= endOfWeek;
        } else if (filterDueDate === "next_week") {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        } else if (filterDueDate === "this_month") {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          return dueDate >= today && dueDate <= thisMonthEnd;
        }
      }
      
      return true;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority, filterCategory, filterAssignee, filterProject, filterDueDate, userInfo]);

  // Group tasks if necessary
  const groupedTasks = useMemo(() => {
    if (groupBy === "none") {
      return { "all": sortTasks(filteredTasks) };
    }
    
    const groups: Record<string, Task[]> = {};
    
    if (groupBy === "status") {
      // Pre-create groups to ensure order
      ["not_started", "in_progress", "completed"].forEach(status => {
        groups[status] = [];
      });
      
      filteredTasks.forEach(task => {
        if (!groups[task.status]) {
          groups[task.status] = [];
        }
        groups[task.status].push(task);
      });
      
      // Sort tasks within each group
      Object.keys(groups).forEach(key => {
        groups[key] = sortTasks(groups[key]);
      });
    } else if (groupBy === "priority") {
      // Pre-create groups to ensure order
      ["urgent", "high", "medium", "low"].forEach(priority => {
        groups[priority] = [];
      });
      
      filteredTasks.forEach(task => {
        if (!groups[task.priority]) {
          groups[task.priority] = [];
        }
        groups[task.priority].push(task);
      });
      
      // Sort tasks within each group
      Object.keys(groups).forEach(key => {
        groups[key] = sortTasks(groups[key]);
      });
    } else if (groupBy === "assignee") {
      // Add unassigned group
      groups["unassigned"] = [];
      
      filteredTasks.forEach(task => {
        const key = task.assignee_id || "unassigned";
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(task);
      });
      
      // Sort tasks within each group
      Object.keys(groups).forEach(key => {
        groups[key] = sortTasks(groups[key]);
      });
    } else if (groupBy === "project") {
      // Add no project group
      groups["none"] = [];
      
      filteredTasks.forEach(task => {
        const key = task.project_id || "none";
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(task);
      });
      
      // Sort tasks within each group
      Object.keys(groups).forEach(key => {
        groups[key] = sortTasks(groups[key]);
      });
    } else if (groupBy === "category") {
      filteredTasks.forEach(task => {
        if (!groups[task.category]) {
          groups[task.category] = [];
        }
        groups[task.category].push(task);
      });
      
      // Sort tasks within each group
      Object.keys(groups).forEach(key => {
        groups[key] = sortTasks(groups[key]);
      });
    } else if (groupBy === "due_date") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + (7 - today.getDay() + 1));
      
      groups["overdue"] = [];
      groups["today"] = [];
      groups["tomorrow"] = [];
      groups["this_week"] = [];
      groups["later"] = [];
      groups["no_date"] = [];
      
      filteredTasks.forEach(task => {
        if (!task.due_date) {
          groups["no_date"].push(task);
          return;
        }
        
        const dueDate = new Date(task.due_date);
        
        if (dueDate < today) {
          groups["overdue"].push(task);
        } else if (dueDate.toDateString() === today.toDateString()) {
          groups["today"].push(task);
        } else if (dueDate.toDateString() === tomorrow.toDateString()) {
          groups["tomorrow"].push(task);
        } else {
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
          
          if (dueDate <= endOfWeek) {
            groups["this_week"].push(task);
          } else {
            groups["later"].push(task);
          }
        }
      });
      
      // Sort tasks within each group
      Object.keys(groups).forEach(key => {
        groups[key] = sortTasks(groups[key]);
      });
    }
    
    return groups;
  }, [filteredTasks, groupBy, sortBy, sortDirection]);

  // Sort tasks based on sortBy and sortDirection
  function sortTasks(tasksToSort: Task[]): Task[] {
    return [...tasksToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "priority": {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case "due_date": {
          if (!a.due_date && !b.due_date) comparison = 0;
          else if (!a.due_date) comparison = 1;
          else if (!b.due_date) comparison = -1;
          else comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;
        }
        case "created_at": {
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        }
        case "title": {
          comparison = a.title.localeCompare(b.title);
          break;
        }
        case "status": {
          const statusOrder = { 
            not_started: 0, 
            in_progress: 1, 
            completed: 2
          };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        }
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }

  // Handle opening task details
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // Format date for display
  const formatDate = (dateString: string | null, format: 'full' | 'short' | 'time' = 'full'): string => {
    if (!dateString) return "Non définie";
    
    const date = new Date(dateString);
    
    if (format === 'full') {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (format === 'short') {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short'
      });
    } else {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  };

  // Get due date status class
  const getDueDateStatusClass = (dueDate: string | null) => {
    if (!dueDate) return "";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDateObj = new Date(dueDate);
    dueDateObj.setHours(0, 0, 0, 0);
    
    if (dueDateObj < today) {
      return "text-red-600 font-medium";
    } else if (dueDateObj.getTime() === today.getTime()) {
      return "text-amber-600 font-medium";
    } else if (dueDateObj.getTime() === tomorrow.getTime()) {
      return "text-amber-500";
    }
    
    return "";
  };

  // Get user by ID
  const getUserById = (userId: string | null): User | string => {
    if (!userId) return "Non assigné";
    const user = users.find(u => u.id === userId);
    return user || userId; 
  };  

  // Get project by ID
  const getProjectById = (projectId: string | null): Project | null => {
    if (!projectId) return null;
    return projects.find(p => p.id === projectId) || null;
  };

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              updated_at: new Date().toISOString()
            } 
          : task
      )
    );
  };

  // Handle task drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active task
    const draggedTask = tasks.find(task => task.id === activeId);
    if (!draggedTask) return;
    
    // Special case for direct status column drops
    // This happens when we drop on the column and not on another task
    if (validTaskStatuses.includes(overId as TaskStatus)) {
      // Direct drop onto a status column
      handleTaskStatusChange(draggedTask.id, overId as TaskStatus);
      return;
    }
    
    // Make sure both active and over have data.current before proceeding
    if (!active.data.current || !over.data.current) return;
    
    // Check if we're dragging between columns
    const activeContainerId = active.data.current.sortable?.containerId;
    const overContainerId = over.data.current.sortable?.containerId;
    
    if (activeContainerId !== overContainerId) {
      // This is a drop into a different column (status change)
      if (overContainerId && validTaskStatuses.includes(overContainerId as TaskStatus)) {
        handleTaskStatusChange(draggedTask.id, overContainerId as TaskStatus);
      }
    } else if (activeContainerId) {
      // This is a reordering within the same column
      const activeIndex = active.data.current.sortable?.index;
      const overIndex = over.data.current.sortable?.index;
      
      if (activeIndex !== undefined && overIndex !== undefined && activeIndex !== overIndex) {
        // Get the container ID (status)
        const containerId = activeContainerId as TaskStatus;
        
        // Update tasks by reordering them
        setTasks(prevTasks => {
          // Filter tasks by the container/status
          const tasksInContainer = prevTasks.filter(task => task.status === containerId);
          
          // Reorder the tasks within this container
          const reorderedTasks = arrayMove(tasksInContainer, activeIndex, overIndex);
          
          // Merge back with tasks not in this container
          return [
            ...prevTasks.filter(task => task.status !== containerId),
            ...reorderedTasks
          ];
        });
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const foundTask = tasks.find(task => task.id === active.id);
    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

  
  // Get group label
  const getGroupLabel = (groupKey: string): string => {
    if (groupBy === "status") {
      switch (groupKey) {
        case "not_started": return "À faire";
        case "in_progress": return "En cours";
        case "completed": return "Terminé";
        default: return groupKey;
      }
    } else if (groupBy === "priority") {
      switch (groupKey) {
        case "urgent": return "Urgent";
        case "high": return "Élevée";
        case "medium": return "Moyenne";
        case "low": return "Basse";
        default: return groupKey;
      }
    } else if (groupBy === "assignee") {
      if (groupKey === "unassigned") return "Non assigné";
      const user = getUserById(groupKey);
      return typeof user === "string" ? user : `${user.firstName} ${user.lastName}`;
    } else if (groupBy === "project") {
      if (groupKey === "none") return "Sans projet";
      const project = getProjectById(groupKey);
      return project ? project.name : groupKey;
    } else if (groupBy === "category") {
      switch (groupKey) {
        case "administrative": return "Administratif";
        case "finance": return "Finances";
        case "hr": return "RH";
        case "compliance": return "Conformité";
        case "reporting": return "Rapports";
        case "legal": return "Juridique";
        case "meetings": return "Réunions";
        case "procurement": return "Achats";
        case "onboarding": return "Intégration";
        case "auditing": return "Audit";
        default: return groupKey;
      }
    } else if (groupBy === "due_date") {
      switch (groupKey) {
        case "overdue": return "En retard";
        case "today": return "Aujourd'hui";
        case "tomorrow": return "Demain";
        case "this_week": return "Cette semaine";
        case "later": return "Plus tard";
        case "no_date": return "Sans date";
        default: return groupKey;
      }
    }
    
    return groupKey;
  };

  // Get group color
  const getGroupColor = (groupKey: string): string => {
    if (groupBy === "status") {
      switch (groupKey) {
        case "not_started": return "bg-gray-100";
        case "in_progress": return "bg-blue-50";
        case "completed": return "bg-green-50";
        default: return "bg-gray-50";
      }
    } else if (groupBy === "priority") {
      switch (groupKey) {
        case "urgent": return "bg-red-50";
        case "high": return "bg-orange-50";
        case "medium": return "bg-yellow-50";
        case "low": return "bg-green-50";
        default: return "bg-gray-50";
      }
    } else if (groupBy === "due_date") {
      switch (groupKey) {
        case "overdue": return "bg-red-50";
        case "today": return "bg-amber-50";
        case "tomorrow": return "bg-yellow-50";
        case "this_week": return "bg-blue-50";
        case "later": return "bg-gray-50";
        case "no_date": return "bg-gray-100";
        default: return "bg-gray-50";
      }
    } else if (groupBy === "project") {
      if (groupKey === "none") return "bg-gray-100";
      const project = getProjectById(groupKey);
      if (project) {
        // Convert hex color to a light background version
        const hex = project.color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
      }
      return "bg-blue-50";
    }
    
    // For other group types, use a neutral background
    return "bg-gray-50";
  };

  // Get group badge color
  const getGroupBadgeColor = (groupKey: string): string => {
    if (groupBy === "status") {
      switch (groupKey) {
        case "not_started": return "bg-gray-100 text-gray-800";
        case "in_progress": return "bg-blue-100 text-blue-800";
        case "completed": return "bg-green-100 text-green-800";
        default: return "bg-gray-100 text-gray-800";
      }
    } else if (groupBy === "priority") {
      switch (groupKey) {
        case "urgent": return "bg-red-100 text-red-800";
        case "high": return "bg-orange-100 text-orange-800";
        case "medium": return "bg-yellow-100 text-yellow-800";
        case "low": return "bg-green-100 text-green-800";
        default: return "bg-gray-100 text-gray-800";
      }
    } else if (groupBy === "due_date") {
      switch (groupKey) {
        case "overdue": return "bg-red-100 text-red-800";
        case "today": return "bg-amber-100 text-amber-800";
        case "tomorrow": return "bg-yellow-100 text-yellow-800";
        case "this_week": return "bg-blue-100 text-blue-800";
        case "later": return "bg-gray-100 text-gray-800";
        case "no_date": return "bg-gray-100 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
      }
    }
    
    return "bg-gray-100 text-gray-800";
  };

  // Get group icon
  const getGroupIcon = (groupKey: string) => {
    if (groupBy === "status") {
      switch (groupKey) {
        case "not_started": return <ClockIcon className="h-5 w-5" />;
        case "in_progress": return <PlayIcon className="h-5 w-5" />;
        case "completed": return <CheckIcon className="h-5 w-5" />;
        default: return <TagIcon className="h-5 w-5" />;
      }
    } else if (groupBy === "priority") {
      switch (groupKey) {
        case "urgent": return <FireIcon className="h-4 w-4" />;
        case "high": return <ExclamationCircleIcon className="h-4 w-4" />;
        case "medium": return <FlagIcon className="h-4 w-4" />;
        case "low": return <ChevronDownIcon className="h-4 w-4" />;
        default: return <FlagIcon className="h-4 w-4" />;
      }
    } else if (groupBy === "due_date") {
      switch (groupKey) {
        case "overdue": return <ExclamationCircleIcon className="h-4 w-4" />;
        case "today": return <ClockIcon className="h-4 w-4" />;
        case "tomorrow": return <CalendarIcon className="h-4 w-4" />;
        case "this_week": return <CalendarIcon className="h-4 w-4" />;
        case "later": return <ArrowLongRightIcon className="h-4 w-4" />;
        case "no_date": return <NoSymbolIcon className="h-4 w-4" />;
        default: return <CalendarIcon className="h-4 w-4" />;
      }
    } else if (groupBy === "project") {
      if (groupKey === "none") return <NoSymbolIcon className="h-4 w-4" />;
      return <FolderIcon className="h-4 w-4" />;
    } else if (groupBy === "assignee") {
      if (groupKey === "unassigned") return <UserIcon className="h-4 w-4" />;
      return <UserIcon className="h-4 w-4" />;
    } else if (groupBy === "category") {
      switch (groupKey) {
        case "administrative": return <ClipboardDocumentListIcon className="h-4 w-4" />;
        case "finance": return <ChartBarIcon className="h-4 w-4" />;
        case "hr": return <UserIcon className="h-4 w-4" />;
        case "compliance": return <CheckIcon className="h-4 w-4" />;
        case "reporting": return <DocumentTextIcon className="h-4 w-4" />;
        case "legal": return <FolderIcon className="h-4 w-4" />;
        case "meetings": return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
        case "procurement": return <TagIcon className="h-4 w-4" />;
        case "onboarding": return <UserIcon className="h-4 w-4" />;
        case "auditing": return <ClipboardDocumentCheckIcon className="h-4 w-4" />;
        default: return <TagIcon className="h-4 w-4" />;
      }
    }
    
    return <TagIcon className="h-4 w-4" />;
  };

  // Render task card for kanban view
  const renderTaskCard = (task: Task) => {
    return (
      <motion.div
        key={task.id}
        className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all cursor-pointer mb-4 overflow-hidden"
        whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        onClick={() => handleTaskClick(task)}
      >
        {/* Project indicator (if task has project) */}
        {task.project_id && (
          <div 
            className="h-2 w-full" 
            style={{ 
              backgroundColor: getProjectById(task.project_id)?.color || '#cbd5e1',
            }}
          ></div>
        )}
        
        <div className="p-5">
          {/* Task title */}
          <div className="mb-3">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-medium text-gray-900 mr-2 line-clamp-2">
                {task.title}
              </h3>
              {task.is_favorite && (
                <StarIcon className="h-5 w-5 text-amber-500 flex-shrink-0" />
              )}
            </div>
            
            {/* Description preview */}
            {task.description && (
              <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">
                {task.description}
              </p>
            )}
            
            {/* Due date */}
            {task.due_date && (
              <div className={`text-sm flex items-center gap-1.5 mt-2 ${getDueDateStatusClass(task.due_date)}`}>
                <CalendarIcon className="h-4 w-4" />
                {formatDate(task.due_date, 'short')}
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          {task.completion_percentage > 0 && (
            <div className="mt-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progression</span>
                <span className="text-xs font-medium">{task.completion_percentage}%</span>
              </div>
              <ProgressBar percentage={task.completion_percentage} small={false} />
            </div>
          )}
          
          {/* Task details */}
          <div className="flex justify-between items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} />
              {task.category && (
                <CategoryBadge category={task.category} />
              )}
            </div>
            
            {/* Assignee with name */}
            <div className="flex items-center gap-2">
              {task.assignee_id ? (
                <>
                  <UserAvatar user={getUserById(task.assignee_id)} size="sm" />
                  <span className="text-xs text-gray-600">
                    {getDisplayName(getUserById(task.assignee_id))}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs text-gray-500">Non assigné</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Task meta info */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>ID: {task.id.replace('task', '#')}</span>
            </div>
            
            {/* Indicators */}
            <div className="flex items-center gap-3">
              {task.checklist && task.checklist.length > 0 && (
                <div className="flex items-center gap-1">
                  <ClipboardDocumentCheckIcon className="h-4 w-4" />
                  <span>
                    {task.checklist.reduce((total, checklist) => 
                      total + checklist.items.filter(item => item.completed).length, 0
                    )}/{task.checklist.reduce((total, checklist) => 
                      total + checklist.items.length, 0
                    )}
                  </span>
                </div>
              )}
              
              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <PaperClipIcon className="h-4 w-4" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
              
              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>{task.comments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render task row for list view
  const renderTaskRow = (task: Task) => {
    return (
      <tr 
        key={task.id}
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => handleTaskClick(task)}
      >
        <td className="px-3 py-3 whitespace-nowrap">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={task.status === "completed"}
              onClick={(e) => {
                e.stopPropagation();
                handleTaskStatusChange(
                  task.id,
                  task.status === "completed" ? "not_started" : "completed"
                );
              }}
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                {task.title}
                {task.is_favorite && (
                  <StarIcon className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="text-xs text-gray-500">
                ID: {task.id.replace('task', '#')}
              </div>
            </div>
          </div>
        </td>
        <td className="px-3 py-3 whitespace-nowrap">
          <StatusBadge status={task.status} />
        </td>
        <td className="px-3 py-3 whitespace-nowrap">
          <PriorityBadge priority={task.priority} />
        </td>
        <td className="px-3 py-3 whitespace-nowrap">
          {task.assignee_id ? (
            <div className="flex items-center gap-2">
              <UserAvatar user={getUserById(task.assignee_id)} size="sm" />
              <span className="text-sm text-gray-900">
                {getDisplayName(getUserById(task.assignee_id))}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Non assigné</span>
          )}
        </td>
        <td className="px-3 py-3 whitespace-nowrap">
          {task.due_date ? (
            <div className={`text-sm ${getDueDateStatusClass(task.due_date)}`}>
              {formatDate(task.due_date, 'short')}
            </div>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </td>
        <td className="px-3 py-3 whitespace-nowrap">
          {task.project_id ? (
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: getProjectById(task.project_id)?.color || '#64748b' }}
            >
              <div 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getProjectById(task.project_id)?.color || '#64748b' }}
              ></div>
              <span>{getProjectById(task.project_id)?.name || '-'}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </td>
        <td className="px-3 py-3 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-2">
            {task.checklist && task.checklist.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ClipboardDocumentCheckIcon className="h-4 w-4" />
                {task.checklist.reduce((total, checklist) => 
                  total + checklist.items.filter(item => item.completed).length, 0
                )}/{task.checklist.reduce((total, checklist) => 
                  total + checklist.items.length, 0
                )}
              </div>
            )}
            
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <PaperClipIcon className="h-4 w-4" />
                {task.attachments.length}
              </div>
            )}
            
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                {task.comments.length}
              </div>
            )}
            
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Calculate task statistics
  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "completed").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      notStarted: tasks.filter(t => t.status === "not_started").length,
      overdue: tasks.filter(t => {
        if (!t.due_date || t.status === "completed") return false;
        return new Date(t.due_date) < new Date();
      }).length,
      dueToday: tasks.filter(t => {
        if (!t.due_date || t.status === "completed") return false;
        const dueDate = new Date(t.due_date);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString();
      }).length,
      highPriority: tasks.filter(t => t.priority === "high" || t.priority === "urgent").length
    };
  }, [tasks]);

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <div className="p-6 md:p-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl font-bold text-[#213f5b]">
                  Tâches administratives
                </h1>
                <p className="text-gray-600">
                  Gérez vos tâches administratives, suivez leur progression et organisez votre travail
                </p>
              </motion.div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* View Selector */}
                <div className="bg-white rounded-lg shadow-sm p-1 flex">
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'kanban' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setViewType('kanban');
                      setGroupBy('status');
                    }}
                  >
                    <Squares2X2Icon className="h-4 w-4" />
                    <span className="hidden md:inline">Kanban</span>
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'list' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setViewType('list');
                      setGroupBy('none');
                    }}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Liste</span>
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'calendar' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewType('calendar')}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Calendrier</span>
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'timeline' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewType('timeline')}
                  >
                    <ClockIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Timeline</span>
                  </button>
                </div>

                <button 
                  className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm text-gray-700 flex items-center gap-1.5 hover:bg-gray-50"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtres</span>
                  {(filterStatus !== "all" || filterPriority !== "all" || filterCategory !== "all" || filterAssignee !== "all" || filterProject !== "all" || filterDueDate !== "all") && (
                    <span className="ml-1 flex h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-[#213f5b] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  onClick={() => setShowNewTaskModal(true)}
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Nouvelle tâche
                </motion.button>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "1.5rem" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Filtres et options</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Statut
                        </label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "all")}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="all">Tous les statuts</option>
                          <option value="not_started">À faire</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminé</option>
                        </select>
                      </div>
                      
                      {/* Priority Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priorité
                        </label>
                        <select
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value as TaskPriority | "all")}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="all">Toutes les priorités</option>
                          <option value="urgent">Urgent</option>
                          <option value="high">Élevée</option>
                          <option value="medium">Moyenne</option>
                          <option value="low">Basse</option>
                        </select>
                      </div>
                      
                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie
                        </label>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value as TaskCategory | "all")}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="all">Toutes les catégories</option>
                          <option value="administrative">Administratif</option>
                          <option value="finance">Finances</option>
                          <option value="hr">RH</option>
                          <option value="compliance">Conformité</option>
                          <option value="reporting">Rapports</option>
                          <option value="legal">Juridique</option>
                          <option value="meetings">Réunions</option>
                          <option value="procurement">Achats</option>
                          <option value="onboarding">Intégration</option>
                          <option value="auditing">Audit</option>
                        </select>
                      </div>
                      
                      {/* Assignee Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assigné à
                        </label>
                        <select
                          value={filterAssignee}
                          onChange={(e) => setFilterAssignee(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="all">Tous les assignés</option>
                          <option value="me">Mes tâches</option>
                          <option value="unassigned">Non assigné</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Project Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Projet
                        </label>
                        <select
                          value={filterProject}
                          onChange={(e) => setFilterProject(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="all">Tous les projets</option>
                          <option value="none">Sans projet</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Due Date Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date d&apos;échéance
                        </label>
                        <select
                          value={filterDueDate}
                          onChange={(e) => setFilterDueDate(e.target.value as typeof filterDueDate)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="all">Toutes les dates</option>
                          <option value="overdue">En retard</option>
                          <option value="today">Aujourd&apos;hui</option>
                          <option value="tomorrow">Demain</option>
                          <option value="this_week">Cette semaine</option>
                          <option value="next_week">Semaine prochaine</option>
                          <option value="this_month">Ce mois-ci</option>
                          <option value="no_date">Sans date</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
                      {/* Group By */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grouper par
                        </label>
                        <select
                          value={groupBy}
                          onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="none">Aucun groupement</option>
                          <option value="status">Statut</option>
                          <option value="priority">Priorité</option>
                          <option value="category">Catégorie</option>
                          <option value="assignee">Assigné</option>
                          <option value="project">Projet</option>
                          <option value="due_date">Date d&apos;échéance</option>
                        </select>
                      </div>
                      
                      {/* Sort By */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trier par
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as SortBy)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="priority">Priorité</option>
                          <option value="due_date">Date d&apos;échéance</option>
                          <option value="created_at">Date de création</option>
                          <option value="title">Titre</option>
                          <option value="status">Statut</option>
                        </select>
                      </div>
                      
                      {/* Sort Direction */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ordre
                        </label>
                        <select
                          value={sortDirection}
                          onChange={(e) => setSortDirection(e.target.value as SortDirection)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="asc">Croissant</option>
                          <option value="desc">Décroissant</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setFilterStatus("all");
                          setFilterPriority("all");
                          setFilterCategory("all");
                          setFilterAssignee("all");
                          setFilterProject("all");
                          setFilterDueDate("all");
                          setSortBy("priority");
                          setSortDirection("desc");
                          if (viewType === "kanban") {
                            setGroupBy("status");
                          } else {
                            setGroupBy("none");
                          }
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                        Réinitialiser
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search and Stats */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="w-full md:w-96">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une tâche..."
                    className="block w-full bg-white pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-[#213f5b] focus:border-[#213f5b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">À faire</p>
                      <p className="text-xl font-semibold">{taskStats.notStarted}</p>
                    </div>
                    <div className="h-8 w-8 bg-gray-100 flex items-center justify-center rounded-full">
                      <ClockIcon className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">En cours</p>
                      <p className="text-xl font-semibold">{taskStats.inProgress}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 flex items-center justify-center rounded-full">
                      <PlayIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Retard</p>
                      <p className="text-xl font-semibold">{taskStats.overdue}</p>
                    </div>
                    <div className="h-8 w-8 bg-red-100 flex items-center justify-center rounded-full">
                      <ExclamationCircleIcon className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Terminé</p>
                      <p className="text-xl font-semibold">{taskStats.completed}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 flex items-center justify-center rounded-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks View */}
            <div className="bg-white rounded-xl shadow-sm p-1 mb-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <div className="h-6 w-6 border-2 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
                    <span>Chargement des tâches...</span>
                  </div>
                </div>
              ) : (
                <>
                  {viewType === 'kanban' && (
                    <div className="p-4">
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                          {Object.keys(groupedTasks).map(groupKey => {
                            // Only render columns for valid task statuses
                            // This ensures our drag and drop works properly between different status columns
                            if (validTaskStatuses.includes(groupKey as TaskStatus)) {
                              return (
                                <div 
                                  key={groupKey}
                                  id={groupKey} // Important: add id for direct column drops
                                  className={`rounded-lg overflow-hidden ${getGroupColor(groupKey)}`}
                                  data-droppable-id={groupKey} // Add data attribute for better debugging
                                >
                                  <div className="p-3 flex items-center justify-between border-b">
                                    <div className="flex items-center gap-2">
                                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${getGroupBadgeColor(groupKey)}`}>
                                        {getGroupIcon(groupKey)}
                                      </div>
                                      <h3 className="font-medium">
                                        {getGroupLabel(groupKey)}
                                      </h3>
                                      <span className="text-xs bg-white bg-opacity-60 py-0.5 px-2 rounded-full">
                                        {groupedTasks[groupKey].length}
                                      </span>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <EllipsisHorizontalIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                  <div 
                                    className="p-2 overflow-y-auto"
                                    style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '100px' }}
                                  >
                                    <SortableContext 
                                      items={groupedTasks[groupKey].map(task => task.id)}
                                      strategy={verticalListSortingStrategy}
                                      id={groupKey} // Identify this container to help with drop targets
                                    >
                                      {groupedTasks[groupKey].map((task) => (
                                        <SortableTaskCard 
                                          key={task.id} 
                                          task={task} 
                                          renderTaskCard={renderTaskCard} 
                                        />
                                      ))}
                                    </SortableContext>
                                  </div>
                                </div>
                              );
                            } else {
                              // For non-status columns when grouping by other criteria
                              return (
                                <div 
                                  key={groupKey}
                                  className={`rounded-lg overflow-hidden ${getGroupColor(groupKey)}`}
                                >
                                  <div className="p-3 flex items-center justify-between border-b">
                                    <div className="flex items-center gap-2">
                                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${getGroupBadgeColor(groupKey)}`}>
                                        {getGroupIcon(groupKey)}
                                      </div>
                                      <h3 className="font-medium">
                                        {getGroupLabel(groupKey)}
                                      </h3>
                                      <span className="text-xs bg-white bg-opacity-60 py-0.5 px-2 rounded-full">
                                        {groupedTasks[groupKey].length}
                                      </span>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <EllipsisHorizontalIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                  <div 
                                    className="p-2 overflow-y-auto"
                                    style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '100px' }}
                                  >
                                    <SortableContext 
                                      items={groupedTasks[groupKey].map(task => task.id)}
                                      strategy={verticalListSortingStrategy}
                                      id={groupKey} 
                                    >
                                      {groupedTasks[groupKey].map((task) => (
                                        <SortableTaskCard 
                                          key={task.id} 
                                          task={task} 
                                          renderTaskCard={renderTaskCard} 
                                        />
                                      ))}
                                    </SortableContext>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                        
                        {/* Add drag overlay for better visual feedback */}
                        <DragOverlay>
                          {activeTask ? renderTaskCard(activeTask) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  )}

                  {viewType === 'list' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                              Tâche
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                              Statut
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                              Priorité
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                              Assigné à
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                              Échéance
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                              Projet
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-gray-900">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {groupedTasks.all.map(task => renderTaskRow(task))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {viewType === 'calendar' && (
                    <EnhancedCalendar onTimeSlotSelect={function ( ): void {
                        throw new Error("Function not implemented.");
                      } }/>
                  )}

                  {viewType === 'timeline' && (
                    <TimelineView
                      tasks={filteredTasks}
                      users={users}
                      projects={projects}
                      selectedTask={selectedTask}
                      setSelectedTask={setSelectedTask}
                      setShowTaskModal={setShowTaskModal}
                      filterPriority={filterPriority}
                      filterStatus={filterStatus}
                      filterAssignee={filterAssignee}
                      filterProject={filterProject}
                      filterCategory={filterCategory}
                      getUserById={getUserById}
                      getProjectById={getProjectById}
                      formatDate={formatDate}
                      getDueDateStatusClass={getDueDateStatusClass}
                    />
                  )}

                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Task details modal */}
      {selectedTask && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-start overflow-y-auto p-4 ${
            showTaskModal ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity duration-300`}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start p-4 border-b sticky top-0 bg-white rounded-t-xl z-10">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {selectedTask.title}
                  {selectedTask.is_favorite && (
                    <StarIcon className="h-5 w-5 text-amber-500" />
                  )}
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  ID: {selectedTask.id.replace('task', '#')} • Créé le {formatDate(selectedTask.created_at, 'short')}
                </div>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Statut</h4>
                    <StatusBadge status={selectedTask.status} />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Priorité</h4>
                    <PriorityBadge priority={selectedTask.priority} />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Catégorie</h4>
                    <CategoryBadge category={selectedTask.category} />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Description</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedTask.description || "Aucune description"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Informations</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <dl className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Assigné à</dt>
                        <dd className="font-medium text-gray-900">
                          {selectedTask.assignee_id ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar user={getUserById(selectedTask.assignee_id)} size="sm" />
                              <span>
                                {getDisplayName(getUserById(selectedTask.assignee_id))}
                              </span>
                            </div>
                          ) : (
                            "Non assigné"
                          )}
                        </dd>
                      </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Projet</dt>
                          <dd className="font-medium text-gray-900">
                            {selectedTask.project_id ? (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: getProjectById(selectedTask.project_id)?.color || '#64748b' }}
                                ></div>
                                <span>{getProjectById(selectedTask.project_id)?.name || '-'}</span>
                              </div>
                            ) : (
                              "Sans projet"
                            )}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Date d&apos;échéance</dt>
                          <dd className={`font-medium ${getDueDateStatusClass(selectedTask.due_date)}`}>
                            {selectedTask.due_date ? formatDate(selectedTask.due_date) : "Non définie"}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Date de début</dt>
                          <dd className="font-medium text-gray-900">
                            {selectedTask.start_date ? formatDate(selectedTask.start_date) : "Non définie"}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Dernière mise à jour</dt>
                          <dd className="font-medium text-gray-900">
                            {formatDate(selectedTask.updated_at)}
                          </dd>
                        </div>
                        {selectedTask.estimated_hours && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Heures estimées</dt>
                            <dd className="font-medium text-gray-900">
                              {selectedTask.estimated_hours}h
                            </dd>
                          </div>
                        )}
                        {selectedTask.actual_hours !== null && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Heures réelles</dt>
                            <dd className="font-medium text-gray-900">
                              {selectedTask.actual_hours}h
                            </dd>
                          </div>
                        )}
                        {selectedTask.location && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Lieu</dt>
                            <dd className="font-medium text-gray-900">
                              {selectedTask.location}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                  
                  <div>
                    {/* Progress */}
                    <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Progression</h3>
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Pourcentage de complétion</span>
                        <span className="text-sm font-medium">{selectedTask.completion_percentage}%</span>
                      </div>
                      <ProgressBar percentage={selectedTask.completion_percentage} />
                    </div>
                    
                    {/* Tags */}
                    {selectedTask.tags && selectedTask.tags.length > 0 && (
                      <>
                        <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Tags</h3>
                        <div className="bg-gray-50 p-3 rounded-lg mb-4 flex flex-wrap gap-2">
                          {selectedTask.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* External links */}
                    {selectedTask.external_links && selectedTask.external_links.length > 0 && (
                      <>
                        <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Liens externes</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <ul className="space-y-2">
                            {selectedTask.external_links.map((link, index) => (
                              <li key={index}>
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                  {link.title}
                                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 ml-1" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Checklist */}
              {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                <div className="px-4 pb-4">
                  <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Liste de contrôle</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {selectedTask.checklist.map((checklist) => (
                      <div key={checklist.id} className="mb-4 last:mb-0">
                        <h4 className="font-medium text-gray-900 mb-2">{checklist.title}</h4>
                        <ul className="space-y-2">
                          {checklist.items.map((item) => (
                            <li key={item.id} className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                readOnly
                              />
                              <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Attachments */}
              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <div className="px-4 pb-4">
                  <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Pièces jointes</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <ul className="divide-y divide-gray-200">
                      {selectedTask.attachments.map((attachment) => (
                        <li key={attachment.id} className="py-2 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                <p className="text-xs text-gray-500">
                                  {attachment.size} KB • Ajouté le {formatDate(attachment.uploaded_at, 'short')}
                                </p>
                              </div>
                            </div>
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Related events */}
              {selectedTask.related_events && selectedTask.related_events.length > 0 && (
                <div className="px-4 pb-4">
                  <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Événements associés</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <ul className="divide-y divide-gray-200">
                      {selectedTask.related_events.map((event) => (
                        <li key={event.id} className="py-2 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{event.title}</p>
                              <p className="text-xs text-gray-500">
                                {formatDate(event.start_time, 'short')} {formatDate(event.start_time, 'time')} - {formatDate(event.end_time, 'time')}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Comments */}
              {selectedTask.comments && selectedTask.comments.length > 0 && (
                <div className="px-4 pb-4">
                  <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Commentaires</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <ul className="space-y-4">
                      {selectedTask.comments.map((comment) => (
                        <li key={comment.id} className="flex gap-3">
                          <UserAvatar user={getUserById(comment.user_id)} size="sm" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div className="font-medium text-sm text-gray-900">
                                {getDisplayName(getUserById(comment.user_id))}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(comment.created_at, 'short')}
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                              {comment.content}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 border-t pt-4">
                      <div className="flex gap-3">
                        <UserAvatar user={getUserById(userInfo?._id || "")} size="sm" />
                        <div className="flex-1">
                          <textarea
                            placeholder="Ajouter un commentaire..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            rows={3}
                          ></textarea>
                          <div className="mt-2 flex justify-between">
                            <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                              <PaperClipIcon className="h-4 w-4" />
                              <span className="text-sm">Joindre</span>
                            </button>
                            <button className="bg-blue-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5">
                              <PaperAirplaneIcon className="h-4 w-4" />
                              Envoyer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-between sticky bottom-0 bg-white rounded-b-xl">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  {selectedTask.is_favorite ? (
                    <StarIcon className="h-5 w-5 text-amber-500" />
                  ) : (
                    <StarIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium">
                  Annuler
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Sauvegarder les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-start overflow-y-auto p-4 transition-opacity duration-300"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start p-4 border-b sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-xl font-semibold text-gray-900">Nouvelle tâche</h2>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Titre de la tâche"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Description détaillée"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      id="status"
                      value={newTask.status}
                      onChange={(e) => setNewTask({...newTask, status: e.target.value as TaskStatus})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="not_started">À faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priorité
                    </label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as TaskPriority})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      id="category"
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value as TaskCategory})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="administrative">Administratif</option>
                      <option value="finance">Finances</option>
                      <option value="hr">RH</option>
                      <option value="compliance">Conformité</option>
                      <option value="reporting">Rapports</option>
                      <option value="legal">Juridique</option>
                      <option value="meetings">Réunions</option>
                      <option value="procurement">Achats</option>
                      <option value="onboarding">Intégration</option>
                      <option value="auditing">Audit</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                      Assigné à
                    </label>
                    <select
                      id="assignee"
                      value={newTask.assignee_id ?? ""}
                      onChange={(e) => setNewTask({...newTask, assignee_id: e.target.value || null})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Non assigné</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                      Projet
                    </label>
                    <select
                      id="project"
                      value={newTask.project_id ?? ""}
                      onChange={(e) => setNewTask({...newTask, project_id: e.target.value || null})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Sans projet</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date d&apos;échéance
                    </label>
                    <input
                      type="datetime-local"
                      id="due_date"
                      value={newTask.due_date ?? ""}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        due_date: e.target.value || null, // fallback to null
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    placeholder="projet, important, phase1"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => setNewTask({
                      ...newTask, 
                      tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                    })}
                  />
                </div>
                
                <div>
                  <label htmlFor="completion" className="block text-sm font-medium text-gray-700 mb-1">
                    Pourcentage de complétion
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      id="completion"
                      min="0"
                      max="100"
                      step="5"
                      value={newTask.completion_percentage}
                      onChange={(e) => setNewTask({...newTask, completion_percentage: parseInt(e.target.value)})}
                      className="block w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-900">{newTask.completion_percentage}%</span>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="border-t p-4 flex justify-end gap-2 sticky bottom-0 bg-white rounded-b-xl">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const newTaskId = `task${String(tasks.length + 1).padStart(3, '0')}`;
                  const timestamp = new Date().toISOString();
                  
                  const taskToAdd: Task = {
                    id: newTaskId,
                    title: newTask.title || "Nouvelle tâche",
                    description: newTask.description || "",
                    status: newTask.status || "not_started",
                    priority: newTask.priority || "medium",
                    category: newTask.category || "administrative",
                    created_at: timestamp,
                    updated_at: timestamp,
                    due_date: newTask.due_date ?? null,
                    start_date: null,
                    assignee_id: newTask.assignee_id ?? null,
                    creator_id: userInfo?._id || "user001",
                    project_id: newTask.project_id ?? null,
                    parent_task_id: null,
                    estimated_hours: null,
                    actual_hours: null,
                    completion_percentage: newTask.completion_percentage || 0,
                    tags: newTask.tags || [],
                    watchers: [],
                  };
                  
                  setTasks([taskToAdd, ...tasks]);
                  setShowNewTaskModal(false);
                  
                  // Reset form
                  setNewTask({
                    title: "",
                    description: "",
                    status: "not_started",
                    priority: "medium",
                    category: "administrative",
                    due_date: null,
                    assignee_id: null,
                    project_id: null,
                    tags: [],
                    completion_percentage: 0
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Créer la tâche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
