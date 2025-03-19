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
  // ChevronLeftIcon,
  // ChevronRightIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  // AdjustmentsHorizontalIcon,
  ListBulletIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  // BuildingOfficeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  // VideoCameraIcon,
  // PhoneIcon,
  // BellAlertIcon,
  Squares2X2Icon,
  // ArrowLongLeftIcon,
  ArrowLongRightIcon,
  // InformationCircleIcon,
  CubeIcon,
  // BellIcon,
  PencilIcon,
  LinkIcon,
  TrashIcon,
  FolderIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  TagIcon,
  // QueueListIcon,
  // CheckCircleIcon,
  NoSymbolIcon,
  PlayIcon,
  FunnelIcon,
  FireIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  // UserCircleIcon,
  StarIcon,
  // PlusIcon,
  // ArrowsUpDownIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  // ArrowUturnLeftIcon,
  // ArrowUturnRightIcon,
  // BookmarkIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
type TaskPriority = "low" | "medium" | "high" | "urgent";
type TaskStatus = "not_started" | "in_progress" | "under_review" | "completed" | "blocked" | "canceled" | "deferred";
type TaskCategory = 
  | "administrative" 
  | "technical" 
  | "communication" 
  | "planning" 
  | "development"
  | "research"
  | "reporting"
  | "installation"
  | "maintenance"
  | "documentation";
type ViewType = "kanban" | "list" | "calendar" | "timeline" | "gantt";
type GroupBy = "status" | "priority" | "category" | "assignee" | "project" | "due_date" | "none";
type SortBy = "priority" | "due_date" | "created_at" | "title" | "status";
type SortDirection = "asc" | "desc";

interface Checklist {
  id: string;
  title: string;
  items: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number; // in KB
  url: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface TaskEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar_url?: string;
  department?: string;
}

interface Project {
  id: string;
  name: string;
  client_name?: string;
  color: string;
  status: "active" | "completed" | "on_hold" | "planned";
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  start_date: string | null;
  assignee_id: string | null;
  creator_id: string;
  project_id: string | null;
  parent_task_id: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  completion_percentage: number;
  tags: string[];
  watchers: string[];
  checklist?: Checklist[];
  comments?: Comment[];
  attachments?: Attachment[];
  related_events?: TaskEvent[];
  related_tasks?: string[];
  location?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  is_favorite?: boolean;
  external_links?: { title: string; url: string }[];
}

const validTaskStatuses: TaskStatus[] = [
  "not_started", 
  "in_progress", 
  "under_review", 
  "completed", 
  "blocked", 
  "canceled", 
  "deferred"
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
      case "under_review":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "blocked":
        return "bg-red-100 text-red-800 border-red-300";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-300";
      case "deferred":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return <ClockIcon className="h-3.5 w-3.5" />;
      case "in_progress":
        return <PlayIcon className="h-3.5 w-3.5" />;
      case "under_review":
        return <MagnifyingGlassIcon className="h-3.5 w-3.5" />;
      case "completed":
        return <CheckIcon className="h-3.5 w-3.5" />;
      case "blocked":
        return <NoSymbolIcon className="h-3.5 w-3.5" />;
      case "canceled":
        return <XMarkIcon className="h-3.5 w-3.5" />;
      case "deferred":
        return <ArrowPathIcon className="h-3.5 w-3.5" />;
      default:
        return <ClockIcon className="h-3.5 w-3.5" />;
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return "À faire";
      case "in_progress":
        return "En cours";
      case "under_review":
        return "En revue";
      case "completed":
        return "Terminé";
      case "blocked":
        return "Bloqué";
      case "canceled":
        return "Annulé";
      case "deferred":
        return "Reporté";
      default:
        return "Non défini";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusClasses(status)}`}>
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
      case "documentation":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "administrative":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "technical":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "communication":
        return "bg-pink-100 text-pink-800 border-pink-300";
      case "planning":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "development":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "research":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "reporting":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "installation":
        return "bg-lime-100 text-lime-800 border-lime-300";
      case "maintenance":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case "documentation":
        return <DocumentTextIcon className="h-3.5 w-3.5" />;
      case "administrative":
        return <ClipboardDocumentListIcon className="h-3.5 w-3.5" />;
      case "technical":
        return <CubeIcon className="h-3.5 w-3.5" />;
      case "communication":
        return <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />;
      case "planning":
        return <CalendarIcon className="h-3.5 w-3.5" />;
      case "development":
        return <ChartBarIcon className="h-3.5 w-3.5" />;
      case "research":
        return <MagnifyingGlassIcon className="h-3.5 w-3.5" />;
      case "reporting":
        return <DocumentTextIcon className="h-3.5 w-3.5" />;
      case "installation":
        return <ArrowDownTrayIcon className="h-3.5 w-3.5" />;
      case "maintenance":
        return <ArrowPathIcon className="h-3.5 w-3.5" />;
      default:
        return <TagIcon className="h-3.5 w-3.5" />;
    }
  };

  const getCategoryLabel = (category: TaskCategory) => {
    switch (category) {
      case "documentation":
        return "Documentation";
      case "administrative":
        return "Administratif";
      case "technical":
        return "Technique";
      case "communication":
        return "Communication";
      case "planning":
        return "Planification";
      case "development":
        return "Développement";
      case "research":
        return "Recherche";
      case "reporting":
        return "Rapport";
      case "installation":
        return "Installation";
      case "maintenance":
        return "Maintenance";
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
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@ecologyb.fr",
      role: "Admin",
      avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      department: "Direction"
    },
    {
      id: "user002",
      firstName: "Léa",
      lastName: "Martin",
      email: "lea.martin@ecologyb.fr",
      role: "Support",
      avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      department: "Support Client"
    },
    {
      id: "user003",
      firstName: "Pierre",
      lastName: "Laurent",
      email: "pierre.laurent@ecologyb.fr",
      role: "Technique",
      avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
      department: "Technique"
    },
    {
      id: "user004",
      firstName: "Sophie",
      lastName: "Legrand",
      email: "sophie.legrand@ecologyb.fr",
      role: "Finance",
      avatar_url: "https://randomuser.me/api/portraits/women/17.jpg",
      department: "Finance"
    },
    {
      id: "user005",
      firstName: "Alexandre",
      lastName: "Martin",
      email: "a.martin@ecologyb.fr",
      role: "Commercial",
      avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
      department: "Commercial"
    }
  ];
  
  // Sample projects data
  const sampleProjects: Project[] = [
    {
      id: "project001",
      name: "Projet Solaire Montpellier",
      client_name: "Mairie de Montpellier",
      color: "#4f46e5", // indigo-600
      status: "active"
    },
    {
      id: "project002",
      name: "Bornes de recharge Lattes",
      client_name: "Centre Commercial Grand Sud",
      color: "#0891b2", // cyan-600
      status: "active"
    },
    {
      id: "project003",
      name: "Parc éolien Les Hauteurs",
      client_name: "Département de l'Hérault",
      color: "#65a30d", // lime-600
      status: "active"
    },
    {
      id: "project004",
      name: "Système de monitoring",
      client_name: "Interne",
      color: "#0284c7", // sky-600
      status: "active"
    },
    {
      id: "project005",
      name: "Étude stockage d'énergie",
      client_name: "GreenTech Innovations",
      color: "#9333ea", // purple-600
      status: "planned"
    }
  ];
  
  // Sample tasks data
  const sampleTasks: Task[] = [
    {
      id: "task001",
      title: "Finaliser le dossier de subvention pour le projet Mobilité Verte",
      description: "Compléter tous les documents requis, vérifier les pièces justificatives et soumettre le dossier avant la date limite du 15 avril.",
      status: "in_progress",
      priority: "high",
      category: "administrative",
      created_at: "2025-03-10T11:30:00Z",
      updated_at: "2025-03-15T14:30:00Z",
      due_date: "2025-04-12T18:00:00Z",
      start_date: "2025-03-10T09:00:00Z",
      assignee_id: "user004",
      creator_id: "user001",
      project_id: "project001",
      parent_task_id: null,
      estimated_hours: 16,
      actual_hours: 8,
      completion_percentage: 50,
      tags: ["subvention", "administratif", "deadline"],
      watchers: ["user001", "user003"],
      checklist: [
        {
          id: "checklist001",
          title: "Documents à inclure",
          items: [
            { id: "item001", text: "Formulaire principal", completed: true },
            { id: "item002", text: "Étude d'impact environnemental", completed: true },
            { id: "item003", text: "Budget prévisionnel", completed: true },
            { id: "item004", text: "Lettres de soutien", completed: false },
            { id: "item005", text: "Plans techniques", completed: false }
          ]
        }
      ],
      comments: [
        {
          id: "comment001",
          user_id: "user001",
          content: "N'oubliez pas d'inclure les lettres de soutien des partenaires locaux, c'est un élément crucial pour l'évaluation du dossier.",
          created_at: "2025-03-12T10:15:00Z"
        },
        {
          id: "comment002",
          user_id: "user004",
          content: "J'ai contacté tous les partenaires et j'attends leurs réponses. Je devrais avoir toutes les lettres d'ici la fin de la semaine.",
          created_at: "2025-03-12T11:30:00Z"
        }
      ],
      related_events: [
        {
          id: "event003",
          title: "Date limite - Soumission dossier subvention",
          start_time: "2025-04-15T23:59:59Z",
          end_time: "2025-04-15T23:59:59Z"
        }
      ],
      location: "Bureau principal"
    },
    {
      id: "task002",
      title: "Préparer présentation technique pour la réunion mairie",
      description: "Créer des slides détaillant les spécifications techniques des panneaux solaires et le plan d'installation pour présentation à la mairie de Montpellier.",
      status: "in_progress",
      priority: "high",
      category: "technical",
      created_at: "2025-03-14T09:30:00Z",
      updated_at: "2025-03-15T16:45:00Z",
      due_date: "2025-03-17T17:00:00Z",
      start_date: "2025-03-14T09:00:00Z",
      assignee_id: "user003",
      creator_id: "user001",
      project_id: "project001",
      parent_task_id: null,
      estimated_hours: 8,
      actual_hours: 5,
      completion_percentage: 60,
      tags: ["présentation", "client", "technique"],
      watchers: ["user001"],
      checklist: [
        {
          id: "checklist002",
          title: "Contenu de la présentation",
          items: [
            { id: "item006", text: "Introduction du projet", completed: true },
            { id: "item007", text: "Spécifications techniques des panneaux", completed: true },
            { id: "item008", text: "Plan d'installation", completed: true },
            { id: "item009", text: "Calendrier des travaux", completed: false },
            { id: "item010", text: "Estimation des économies d'énergie", completed: false }
          ]
        }
      ],
      related_events: [
        {
          id: "event001",
          title: "Réunion projet photovoltaïque - Mairie de Montpellier",
          start_time: "2025-03-18T10:00:00Z",
          end_time: "2025-03-18T11:30:00Z"
        }
      ],
      is_favorite: true
    },
    {
      id: "task003",
      title: "Commander le matériel pour l'installation des panneaux",
      description: "Passer commande des panneaux solaires et du matériel de fixation nécessaire pour l'installation à l'École Jean Jaurès.",
      status: "not_started",
      priority: "urgent",
      category: "administrative",
      created_at: "2025-03-15T11:20:00Z",
      updated_at: "2025-03-15T11:20:00Z",
      due_date: "2025-03-19T12:00:00Z",
      start_date: null,
      assignee_id: "user003",
      creator_id: "user001",
      project_id: "project001",
      parent_task_id: null,
      estimated_hours: 2,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["commande", "matériel", "installation"],
      watchers: ["user001", "user004"],
      related_events: [
        {
          id: "event004",
          title: "Installation panneaux solaires - Phase 1",
          start_time: "2025-03-23T08:00:00Z",
          end_time: "2025-03-25T18:00:00Z"
        }
      ],
      external_links: [
        { title: "Catalogue fournisseur", url: "https://example.com/catalogue" },
        { title: "Bon de commande", url: "https://example.com/commande" }
      ]
    },
    {
      id: "task004",
      title: "Mettre à jour le manuel d'utilisation du système de monitoring",
      description: "Intégrer les modifications récentes de l'interface et ajouter les nouvelles fonctionnalités au manuel d'utilisation destiné aux clients.",
      status: "not_started",
      priority: "medium",
      category: "documentation",
      created_at: "2025-03-16T09:45:00Z",
      updated_at: "2025-03-16T09:45:00Z",
      due_date: "2025-03-27T18:00:00Z",
      start_date: null,
      assignee_id: "user002",
      creator_id: "user003",
      project_id: "project004",
      parent_task_id: null,
      estimated_hours: 12,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["documentation", "formation", "mise à jour"],
      watchers: ["user003"],
      related_events: [
        {
          id: "event006",
          title: "Formation utilisation système de monitoring",
          start_time: "2025-03-29T13:30:00Z",
          end_time: "2025-03-29T16:30:00Z"
        }
      ],
      attachments: [
        {
          id: "att001",
          name: "Manuel_v1.2.pdf",
          type: "application/pdf",
          size: 2450,
          url: "#",
          uploaded_at: "2025-03-16T09:45:00Z",
          uploaded_by: "user003"
        }
      ]
    },
    {
      id: "task005",
      title: "Réaliser étude de faisabilité - Extension parc éolien",
      description: "Analyser les données de vent et évaluer la faisabilité technique et économique d'extension du parc éolien existant Les Hauteurs.",
      status: "not_started",
      priority: "medium",
      category: "research",
      created_at: "2025-03-16T14:30:00Z",
      updated_at: "2025-03-16T14:30:00Z",
      due_date: "2025-04-10T18:00:00Z",
      start_date: null,
      assignee_id: "user003",
      creator_id: "user001",
      project_id: "project003",
      parent_task_id: null,
      estimated_hours: 40,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["étude", "éolien", "développement"],
      watchers: ["user001"],
      related_tasks: ["task007"],
      checklist: [
        {
          id: "checklist003",
          title: "Éléments à analyser",
          items: [
            { id: "item011", text: "Données de vent sur 12 mois", completed: false },
            { id: "item012", text: "Contraintes réglementaires", completed: false },
            { id: "item013", text: "Impact environnemental", completed: false },
            { id: "item014", text: "Aspects économiques", completed: false },
            { id: "item015", text: "Raccordement réseau", completed: false }
          ]
        }
      ]
    },
    {
      id: "task006",
      title: "Préparer le devis pour GreenTech Innovations",
      description: "Établir un devis détaillé pour la collaboration sur les solutions de stockage d'énergie avec GreenTech Innovations.",
      status: "not_started",
      priority: "high",
      category: "administrative",
      created_at: "2025-03-16T10:30:00Z",
      updated_at: "2025-03-16T10:30:00Z",
      due_date: "2025-03-20T12:00:00Z",
      start_date: null,
      assignee_id: "user005",
      creator_id: "user001",
      project_id: "project005",
      parent_task_id: null,
      estimated_hours: 4,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["devis", "commercial", "collaboration"],
      watchers: ["user001"],
      related_events: [
        {
          id: "event008",
          title: "Appel client - GreenTech Innovations",
          start_time: "2025-03-18T15:00:00Z",
          end_time: "2025-03-18T15:30:00Z"
        }
      ]
    },
    {
      id: "task007",
      title: "Obtenir autorisations administratives - Extension parc éolien",
      description: "Préparer et soumettre les dossiers de demande d'autorisation pour l'extension du parc éolien Les Hauteurs.",
      status: "deferred",
      priority: "medium",
      category: "administrative",
      created_at: "2025-03-12T11:15:00Z",
      updated_at: "2025-03-16T09:30:00Z",
      due_date: "2025-05-15T18:00:00Z",
      start_date: null,
      assignee_id: "user004",
      creator_id: "user001",
      project_id: "project003",
      parent_task_id: null,
      estimated_hours: 30,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["autorisation", "administratif", "éolien"],
      watchers: ["user001", "user003"],
      related_tasks: ["task005"],
      comments: [
        {
          id: "comment003",
          user_id: "user001",
          content: "Cette tâche doit attendre les résultats de l'étude de faisabilité. Je la reporte à plus tard.",
          created_at: "2025-03-16T09:30:00Z"
        }
      ]
    },
    {
      id: "task008",
      title: "Organiser la maintenance trimestrielle des bornes de recharge",
      description: "Planifier et coordonner la maintenance trimestrielle des bornes de recharge installées au Centre Commercial Grand Sud.",
      status: "completed",
      priority: "medium",
      category: "maintenance",
      created_at: "2025-03-01T10:00:00Z",
      updated_at: "2025-03-10T16:45:00Z",
      due_date: "2025-03-15T18:00:00Z",
      start_date: "2025-03-05T09:00:00Z",
      assignee_id: "user003",
      creator_id: "user003",
      project_id: "project002",
      parent_task_id: null,
      estimated_hours: 8,
      actual_hours: 6,
      completion_percentage: 100,
      tags: ["maintenance", "bornes", "trimestriel"],
      watchers: [],
      checklist: [
        {
          id: "checklist004",
          title: "Opérations de maintenance",
          items: [
            { id: "item016", text: "Contrôle visuel des équipements", completed: true },
            { id: "item017", text: "Test de fonctionnement", completed: true },
            { id: "item018", text: "Vérification connexions électriques", completed: true },
            { id: "item019", text: "Mise à jour logicielle", completed: true },
            { id: "item020", text: "Nettoyage", completed: true }
          ]
        }
      ],
      comments: [
        {
          id: "comment004",
          user_id: "user003",
          content: "Maintenance effectuée avec succès. Toutes les bornes fonctionnent correctement. Prochaine maintenance prévue en juin.",
          created_at: "2025-03-10T16:45:00Z"
        }
      ]
    },
    {
      id: "task009",
      title: "Analyser les données de performance du système solaire pilote",
      description: "Recueillir et analyser les données de production et de performance du système solaire pilote installé sur le toit de la mairie.",
      status: "in_progress",
      priority: "medium",
      category: "technical",
      created_at: "2025-03-08T09:30:00Z",
      updated_at: "2025-03-14T11:20:00Z",
      due_date: "2025-03-22T18:00:00Z",
      start_date: "2025-03-08T09:30:00Z",
      assignee_id: "user003",
      creator_id: "user001",
      project_id: "project001",
      parent_task_id: null,
      estimated_hours: 16,
      actual_hours: 7,
      completion_percentage: 45,
      tags: ["analyse", "données", "performance", "solaire"],
      watchers: ["user001"],
      attachments: [
        {
          id: "att002",
          name: "Données_Production_Février.xlsx",
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 1280,
          url: "#",
          uploaded_at: "2025-03-08T09:45:00Z",
          uploaded_by: "user003"
        },
        {
          id: "att003",
          name: "Rapport_Préliminaire.pdf",
          type: "application/pdf",
          size: 1845,
          url: "#",
          uploaded_at: "2025-03-14T11:20:00Z",
          uploaded_by: "user003"
        }
      ],
      comments: [
        {
          id: "comment005",
          user_id: "user003",
          content: "Les données montrent une performance supérieure de 12% aux prévisions initiales. Je vais approfondir l'analyse pour comprendre les facteurs contribuant à cette surperformance.",
          created_at: "2025-03-14T11:20:00Z"
        }
      ]
    },
    {
      id: "task010",
      title: "Réviser le plan de communication pour le projet éolien",
      description: "Mettre à jour la stratégie et le plan de communication pour le projet d'extension du parc éolien Les Hauteurs afin d'améliorer l'acceptation locale.",
      status: "not_started",
      priority: "medium",
      category: "communication",
      created_at: "2025-03-16T15:45:00Z",
      updated_at: "2025-03-16T15:45:00Z",
      due_date: "2025-03-31T18:00:00Z",
      start_date: null,
      assignee_id: "user002",
      creator_id: "user001",
      project_id: "project003",
      parent_task_id: null,
      estimated_hours: 12,
      actual_hours: 0,
      completion_percentage: 0,
      tags: ["communication", "éolien", "acceptation", "local"],
      watchers: ["user001", "user005"],
      is_favorite: true
    },
    {
      id: "task011",
      title: "Programmer la réunion d'avancement mensuelle",
      description: "Organiser la réunion d'avancement mensuelle avec tous les chefs de projet et préparer l'ordre du jour.",
      status: "completed",
      priority: "medium",
      category: "administrative",
      created_at: "2025-03-10T09:15:00Z",
      updated_at: "2025-03-12T14:30:00Z",
      due_date: "2025-03-12T12:00:00Z",
      start_date: "2025-03-10T09:15:00Z",
      assignee_id: "user001",
      creator_id: "user001",
      project_id: null,
      parent_task_id: null,
      estimated_hours: 2,
      actual_hours: 1.5,
      completion_percentage: 100,
      tags: ["réunion", "interne", "mensuel"],
      watchers: [],
      checklist: [
        {
          id: "checklist005",
          title: "À faire",
          items: [
            { id: "item021", text: "Réserver la salle de conférence", completed: true },
            { id: "item022", text: "Préparer l'ordre du jour", completed: true },
            { id: "item023", text: "Envoyer les invitations", completed: true },
            { id: "item024", text: "Rassembler les rapports d'avancement", completed: true }
          ]
        }
      ],
      is_recurring: true,
      recurrence_pattern: "FREQ=MONTHLY;BYMONTHDAY=15"
    },
    {
      id: "task012",
      title: "Résoudre le problème de connexion des bornes de recharge",
      description: "Enquêter et résoudre le problème de connexion intermittente affectant trois bornes de recharge au Centre Commercial Grand Sud.",
      status: "blocked",
      priority: "high",
      category: "technical",
      created_at: "2025-03-15T09:30:00Z",
      updated_at: "2025-03-16T14:15:00Z",
      due_date: "2025-03-18T18:00:00Z",
      start_date: "2025-03-15T09:30:00Z",
      assignee_id: "user003",
      creator_id: "user002",
      project_id: "project002",
      parent_task_id: null,
      estimated_hours: 4,
      actual_hours: 3,
      completion_percentage: 30,
      tags: ["dépannage", "bornes", "connexion", "urgent"],
      watchers: ["user001", "user002"],
      comments: [
        {
          id: "comment006",
          user_id: "user003",
          content: "Après analyse, il semble que le problème vienne du serveur central. Nous devons attendre l'intervention du fournisseur pour accéder au système backend.",
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
      setTasks(sampleTasks);
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
      ["not_started", "in_progress", "under_review", "completed", "blocked", "deferred", "canceled"].forEach(status => {
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
            under_review: 2, 
            completed: 3, 
            blocked: 4, 
            deferred: 5, 
            canceled: 6 
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
  // Updated handleDragEnd function with proper null checks
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
        case "under_review": return "En revue";
        case "completed": return "Terminé";
        case "blocked": return "Bloqué";
        case "deferred": return "Reporté";
        case "canceled": return "Annulé";
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
        case "technical": return "Technique";
        case "communication": return "Communication";
        case "planning": return "Planification";
        case "development": return "Développement";
        case "research": return "Recherche";
        case "reporting": return "Rapport";
        case "installation": return "Installation";
        case "maintenance": return "Maintenance";
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
        case "under_review": return "bg-purple-50";
        case "completed": return "bg-green-50";
        case "blocked": return "bg-red-50";
        case "deferred": return "bg-amber-50";
        case "canceled": return "bg-red-50";
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
        case "under_review": return "bg-purple-100 text-purple-800";
        case "completed": return "bg-green-100 text-green-800";
        case "blocked": return "bg-red-100 text-red-800";
        case "deferred": return "bg-amber-100 text-amber-800";
        case "canceled": return "bg-red-100 text-red-800";
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
        case "not_started": return <ClockIcon className="h-4 w-4" />;
        case "in_progress": return <PlayIcon className="h-4 w-4" />;
        case "under_review": return <MagnifyingGlassIcon className="h-4 w-4" />;
        case "completed": return <CheckIcon className="h-4 w-4" />;
        case "blocked": return <NoSymbolIcon className="h-4 w-4" />;
        case "deferred": return <ArrowPathIcon className="h-4 w-4" />;
        case "canceled": return <XMarkIcon className="h-4 w-4" />;
        default: return <TagIcon className="h-4 w-4" />;
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
        case "technical": return <CubeIcon className="h-4 w-4" />;
        case "communication": return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
        case "planning": return <CalendarIcon className="h-4 w-4" />;
        case "development": return <ChartBarIcon className="h-4 w-4" />;
        case "research": return <MagnifyingGlassIcon className="h-4 w-4" />;
        case "reporting": return <DocumentTextIcon className="h-4 w-4" />;
        case "installation": return <ArrowDownTrayIcon className="h-4 w-4" />;
        case "maintenance": return <ArrowPathIcon className="h-4 w-4" />;
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
        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer mb-2 overflow-hidden"
        whileHover={{ y: -2 }}
        onClick={() => handleTaskClick(task)}
      >
        {/* Project indicator (if task has project) */}
        {task.project_id && (
          <div 
            className="h-1.5 w-full" 
            style={{ 
              backgroundColor: getProjectById(task.project_id)?.color || '#cbd5e1',
            }}
          ></div>
        )}
        
        <div className="p-3">
          {/* Task title */}
          <div className="mb-2">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-gray-900 mr-2">
                {task.title}
              </h3>
              {task.is_favorite && (
                <StarIcon className="h-4 w-4 text-amber-500 flex-shrink-0" />
              )}
            </div>
            
            {/* Due date */}
            {task.due_date && (
              <div className={`text-xs flex items-center gap-1 mt-1 ${getDueDateStatusClass(task.due_date)}`}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatDate(task.due_date, 'short')}
              </div>
            )}
          </div>
          
          {/* Task details */}
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <PriorityBadge priority={task.priority} />
              {task.category && (
                <CategoryBadge category={task.category} />
              )}
            </div>
            
            {/* Assignee */}
            <div className="flex justify-end">
              {task.assignee_id ? (
                <UserAvatar user={getUserById(task.assignee_id)} size="sm" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          {task.completion_percentage > 0 && (
            <div className="mt-2">
              <ProgressBar percentage={task.completion_percentage} small />
            </div>
          )}
          
          {/* Task meta info */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>ID: {task.id.replace('task', '#')}</span>
            </div>
            
            {/* Indicators */}
            <div className="flex items-center gap-2">
              {task.checklist && task.checklist.length > 0 && (
                <div className="flex items-center gap-0.5">
                  <ClipboardDocumentCheckIcon className="h-3.5 w-3.5" />
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
                <div className="flex items-center gap-0.5">
                  <PaperClipIcon className="h-3.5 w-3.5" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
              
              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center gap-0.5">
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
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
      blocked: tasks.filter(t => t.status === "blocked").length,
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
                  Tâches
                </h1>
                <p className="text-gray-600">
                  Gérez vos tâches, suivez leur progression et organisez votre travail
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
                          <option value="under_review">En revue</option>
                          <option value="completed">Terminé</option>
                          <option value="blocked">Bloqué</option>
                          <option value="deferred">Reporté</option>
                          <option value="canceled">Annulé</option>
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
                          <option value="technical">Technique</option>
                          <option value="communication">Communication</option>
                          <option value="planning">Planification</option>
                          <option value="development">Développement</option>
                          <option value="research">Recherche</option>
                          <option value="reporting">Rapport</option>
                          <option value="installation">Installation</option>
                          <option value="maintenance">Maintenance</option>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                    <div className="p-6 flex justify-center items-center text-gray-500">
                      <div className="text-center">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <h3 className="text-lg font-medium mb-1">Vue calendrier</h3>
                        <p>Cette vue n&apos;est pas encore disponible.</p>
                      </div>
                    </div>
                  )}

                  {viewType === 'timeline' && (
                    <div className="p-6 flex justify-center items-center text-gray-500">
                      <div className="text-center">
                        <ClockIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <h3 className="text-lg font-medium mb-1">Vue timeline</h3>
                        <p>Cette vue n&apos;est pas encore disponible.</p>
                      </div>
                    </div>
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
                      <option value="under_review">En revue</option>
                      <option value="completed">Terminé</option>
                      <option value="blocked">Bloqué</option>
                      <option value="deferred">Reporté</option>
                      <option value="canceled">Annulé</option>
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
                      <option value="technical">Technique</option>
                      <option value="communication">Communication</option>
                      <option value="planning">Planification</option>
                      <option value="development">Développement</option>
                      <option value="research">Recherche</option>
                      <option value="reporting">Rapport</option>
                      <option value="installation">Installation</option>
                      <option value="maintenance">Maintenance</option>
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
