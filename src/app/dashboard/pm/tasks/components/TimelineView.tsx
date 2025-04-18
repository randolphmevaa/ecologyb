// Enhanced Timeline Component with improved UI and TypeScript fixes
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
//   UserIcon,
//   ArrowsPointingOutIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
//   PlusCircleIcon,
  FolderIcon,
//   TagIcon,
  CheckIcon,
  PlayIcon,
//   ExclamationCircleIcon,
//   EllipsisHorizontalIcon,
//   ChartBarIcon,
  ArrowTopRightOnSquareIcon,
//   InformationCircleIcon,
//   SquaresPlusIcon,
  ListBulletIcon
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

// Import shared types instead of redefining them here
import { Task, User, Project, TaskStatus, TaskPriority } from "../types";

interface TimelineProps {
  tasks: Task[];
  users: User[];
  projects: Project[];
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setShowTaskModal: (show: boolean) => void;
  filterPriority: string;
  filterStatus: string;
  filterAssignee: string;
  filterProject: string;
  filterCategory: string;
  getUserById: (userId: string | null) => User | string;
  getProjectById: (projectId: string | null) => Project | null;
  formatDate: (dateString: string | null, format?: 'full' | 'short' | 'time') => string;
  getDueDateStatusClass: (dueDate: string | null) => string;
}

interface GroupedTasks {
  [key: string]: {
    id: string;
    name: string;
    color?: string;
    tasks: Task[];
  };
}

interface DateInfo {
  date: Date;
  endDate?: Date;
  isToday: boolean;
  label: string;
  fullLabel: string;
  dateString: string;
}

interface ExpandedState {
  [key: string]: boolean;
}

// Helper components
const TimelineTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
    left: "right-full mr-1",
    right: "left-full ml-1"
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 5 : position === "bottom" ? -5 : 0, x: position === "left" ? 5 : position === "right" ? -5 : 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[position]} px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-lg whitespace-nowrap`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskBadge: React.FC<{ task: Task }> = ({ task }) => {
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      case "not_started": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center gap-1 ml-1">
      <div className={`h-2 w-2 rounded-full ${getStatusColor(task.status)}`} title={task.status === "completed" ? "Terminé" : task.status === "in_progress" ? "En cours" : "À faire"}></div>
      <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} title={task.priority === "urgent" ? "Urgent" : task.priority === "high" ? "Élevée" : task.priority === "medium" ? "Moyenne" : "Basse"}></div>
    </div>
  );
};

// Main Timeline component
const TimelineView: React.FC<TimelineProps> = ({ 
  tasks,
//   users,
//   projects,
  selectedTask,
  setSelectedTask,
  setShowTaskModal,
  filterPriority,
  filterStatus,
  filterAssignee,
  filterProject,
  filterCategory,
  getUserById,
  getProjectById,
  formatDate,
//   getDueDateStatusClass
}) => {
  // Timeline state
  const [timeScale, setTimeScale] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
  const [timelineStart, setTimelineStart] = useState<Date>(getEarliestDate());
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [timelineMode, setTimelineMode] = useState<"standard" | "grouped">("standard");
  const [groupBy, setGroupBy] = useState<"project" | "assignee" | "status" | "priority" | "category">("project");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  
  // Get the earliest task date to determine timeline start
  function getEarliestDate(): Date {
    // Default to current month start if no tasks or dates
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    if (!tasks || tasks.length === 0) return thisMonthStart;
    
    const dates = tasks
      .map(task => [
        task.start_date ? new Date(task.start_date) : null,
        task.due_date ? new Date(task.due_date) : null
      ])
      .flat()
      .filter((date): date is Date => date !== null);
    
    if (dates.length === 0) return thisMonthStart;
    
    // Get earliest date, then return the first day of its month
    const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    return new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
  }
  
  // Get display name
  function getDisplayName(userOrString: User | string): string {
    if (typeof userOrString === "string") {
      return userOrString;
    }
    return `${userOrString.firstName} ${userOrString.lastName}`;
  }

  // Move timeline
  const moveTimeline = (direction: number): void => {
    const newDate = new Date(timelineStart);
    if (timeScale === "day") {
      newDate.setDate(newDate.getDate() + (direction * 7)); // Week at a time for days
    } else if (timeScale === "week") {
      newDate.setDate(newDate.getDate() + (direction * 14)); // 2 weeks
    } else if (timeScale === "month") {
      newDate.setMonth(newDate.getMonth() + (direction * 3)); // 3 months
    } else if (timeScale === "quarter") {
      newDate.setMonth(newDate.getMonth() + (direction * 6)); // 6 months
    } else {
      newDate.setFullYear(newDate.getFullYear() + direction); // 1 year
    }
    setTimelineStart(newDate);
  };

  // Reset timeline to the earliest task date or today
  const resetTimeline = (): void => {
    setTimelineStart(getEarliestDate());
  };

  // Generate timeline dates
  const generateTimelineDates = (): DateInfo[] => {
    const dates: DateInfo[] = [];
    const startDate = new Date(timelineStart);
    const today = new Date();
    
    // Determine how many units to show based on the time scale
    const unitsToShow = timeScale === "day" ? 60 : 
                        timeScale === "week" ? 26 : 
                        timeScale === "month" ? 12 : 
                        timeScale === "quarter" ? 8 : 4;
    
    for (let i = 0; i < unitsToShow; i++) {
      const currentDate = new Date(startDate);
      
      if (timeScale === "day") {
        currentDate.setDate(startDate.getDate() + i);
        dates.push({
          date: currentDate,
          isToday: currentDate.toDateString() === today.toDateString(),
          label: currentDate.toLocaleDateString('fr-FR', { day: 'numeric', weekday: 'short' }),
          fullLabel: currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          dateString: currentDate.toISOString().split('T')[0]
        });
      } else if (timeScale === "week") {
        currentDate.setDate(startDate.getDate() + (i * 7));
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 6);
        
        dates.push({
          date: currentDate,
          endDate: endDate,
          isToday: currentDate <= today && today <= endDate,
          label: `Sem. ${getWeekNumber(currentDate)}`,
          fullLabel: `${currentDate.toLocaleDateString('fr-FR', { day: 'numeric' })} - ${endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`,
          dateString: currentDate.toISOString().split('T')[0]
        });
      } else if (timeScale === "month") {
        currentDate.setMonth(startDate.getMonth() + i);
        
        const isThisMonth = currentDate.getMonth() === today.getMonth() && 
                          currentDate.getFullYear() === today.getFullYear();
        
        dates.push({
          date: currentDate,
          isToday: isThisMonth,
          label: currentDate.toLocaleDateString('fr-FR', { month: 'short' }),
          fullLabel: currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
          dateString: currentDate.toISOString().split('T')[0]
        });
      } else if (timeScale === "quarter") {
        currentDate.setMonth(startDate.getMonth() + (i * 3));
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        
        const isThisQuarter = Math.floor(today.getMonth() / 3) + 1 === quarter && 
                            currentDate.getFullYear() === today.getFullYear();
        
        dates.push({
          date: currentDate,
          isToday: isThisQuarter,
          label: `T${quarter}`,
          fullLabel: `T${quarter} ${currentDate.getFullYear()}`,
          dateString: currentDate.toISOString().split('T')[0]
        });
      } else { // year
        currentDate.setFullYear(startDate.getFullYear() + i);
        
        const isThisYear = currentDate.getFullYear() === today.getFullYear();
        
        dates.push({
          date: currentDate,
          isToday: isThisYear,
          label: currentDate.getFullYear().toString(),
          fullLabel: currentDate.getFullYear().toString(),
          dateString: `${currentDate.getFullYear()}-01-01`
        });
      }
    }
    
    return dates;
  };

  // Get the ISO week number
  function getWeekNumber(date: Date): number {
    const target = new Date(date);
    const dayNum = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNum + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  // Get tasks that should appear on the timeline
  const timelineTasks = useMemo(() => {
    // Apply filters and only include tasks with start_date or due_date
    return tasks
      .filter(task => {
        // Only include tasks with dates
        const hasDate = task.start_date || task.due_date;
        if (!hasDate) return false;
        
        // Filter by status
        if (filterStatus !== "all" && task.status !== filterStatus) {
          return false;
        }
        
        // Skip completed tasks if not showing them
        if (!showCompleted && task.status === "completed") {
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
        } else if (filterAssignee !== "all" && filterAssignee !== "unassigned" && task.assignee_id !== filterAssignee) {
          return false;
        }
        
        // Filter by project
        if (filterProject === "none" && task.project_id) {
          return false;
        } else if (filterProject !== "all" && filterProject !== "none" && task.project_id !== filterProject) {
          return false;
        }
        
        return true;
      });
  }, [tasks, filterStatus, filterPriority, filterCategory, filterAssignee, filterProject, showCompleted]);

  // Group tasks for the timeline
  const groupedTasks = useMemo<GroupedTasks>(() => {
    if (timelineMode !== "grouped") {
      return { "all": { id: "all", name: "Toutes les tâches", tasks: timelineTasks } };
    }
    
    const groups: GroupedTasks = {};
    
    timelineTasks.forEach(task => {
      let key = ""; // Initialize key to prevent TypeScript error
      
      if (groupBy === "project") {
        key = task.project_id || "none";
        if (!groups[key]) {
          const project = getProjectById(task.project_id);
          groups[key] = {
            id: key,
            name: project ? project.name : "Sans projet",
            color: project ? project.color : "#cbd5e1",
            tasks: []
          };
        }
      } else if (groupBy === "assignee") {
        key = task.assignee_id || "unassigned";
        if (!groups[key]) {
          const user = getUserById(task.assignee_id);
          groups[key] = {
            id: key,
            name: typeof user === "string" ? user : `${user.firstName} ${user.lastName}`,
            tasks: []
          };
        }
      } else if (groupBy === "status") {
        key = task.status;
        if (!groups[key]) {
          groups[key] = {
            id: key,
            name: key === "not_started" ? "À faire" : 
                 key === "in_progress" ? "En cours" : 
                 key === "completed" ? "Terminé" : key,
            tasks: []
          };
        }
      } else if (groupBy === "priority") {
        key = task.priority;
        if (!groups[key]) {
          groups[key] = {
            id: key,
            name: key === "low" ? "Basse" : 
                 key === "medium" ? "Moyenne" : 
                 key === "high" ? "Élevée" : 
                 key === "urgent" ? "Urgent" : key,
            tasks: []
          };
        }
      } else if (groupBy === "category") {
        key = task.category;
        if (!groups[key]) {
          groups[key] = {
            id: key,
            name: key === "administrative" ? "Administratif" :
                 key === "finance" ? "Finances" :
                 key === "hr" ? "RH" :
                 key === "compliance" ? "Conformité" :
                 key === "reporting" ? "Rapports" :
                 key === "legal" ? "Juridique" :
                 key === "meetings" ? "Réunions" :
                 key === "procurement" ? "Achats" :
                 key === "onboarding" ? "Intégration" :
                 key === "auditing" ? "Audit" : key,
            tasks: []
          };
        }
      }
      
      if (key && groups[key]) {
        groups[key].tasks.push(task);
      }
    });
    
    return groups;
  }, [timelineTasks, groupBy, timelineMode, getUserById, getProjectById]);

  // Toggle expand/collapse for a group
  const toggleExpand = (groupId: string): void => {
    setExpanded(prev => ({
      ...prev,
      [groupId]: !(prev[groupId] ?? true)
    }));
  };

  // Calculate task position and width on the timeline
  const getTaskTimelineStyle = (task: Task, timelineDates: DateInfo[]): React.CSSProperties => {
    const start = task.start_date ? new Date(task.start_date) : null;
    const end = task.due_date ? new Date(task.due_date) : null;
    
    if (!start && !end) return { display: 'none' };
    
    const firstDate = timelineDates[0].date;
    const lastDate = timelineDates[timelineDates.length - 1].date;
    
    if (timeScale === "day") {
      // For day scale
      const timelineStartTime = firstDate.getTime();
      const timelineEndTime = new Date(lastDate);
      timelineEndTime.setDate(timelineEndTime.getDate() + 1);
      const timelineDuration = timelineEndTime.getTime() - timelineStartTime;
      
      // If task has both start and end dates
      if (start && end) {
        // Check if task is outside timeline range
        if (end < firstDate || start > lastDate) {
          return { display: 'none' };
        }
        
        // Calculate left and width percentages
        const taskStart = Math.max(start.getTime(), timelineStartTime);
        const taskEnd = Math.min(end.getTime(), timelineEndTime.getTime());
        
        const left = ((taskStart - timelineStartTime) / timelineDuration) * 100;
        const width = ((taskEnd - taskStart) / timelineDuration) * 100;
        
        return {
          left: `${left}%`,
          width: `${Math.max(width, 3)}%`, // Ensure minimum width for visibility
        };
      } 
      // If task only has due date (milestone)
      else if (end) {
        // Check if milestone is outside timeline range
        if (end < firstDate || end > lastDate) {
          return { display: 'none' };
        }
        
        const left = ((end.getTime() - timelineStartTime) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      }
      // If task only has start date (milestone)
      else if (start) {
        // Check if milestone is outside timeline range
        if (start < firstDate || start > lastDate) {
          return { display: 'none' };
        }
        
        const left = ((start.getTime() - timelineStartTime) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      }
    } else if (timeScale === "week") {
      // Very similar to day scale but with weekly units
      const timelineStartTime = firstDate.getTime();
      const timelineEndTime = new Date(lastDate);
      timelineEndTime.setDate(timelineEndTime.getDate() + 7); // Add a week
      const timelineDuration = timelineEndTime.getTime() - timelineStartTime;
      
      if (start && end) {
        if (end < firstDate || start > timelineEndTime) return { display: 'none' };
        
        const taskStart = Math.max(start.getTime(), timelineStartTime);
        const taskEnd = Math.min(end.getTime(), timelineEndTime.getTime());
        
        const left = ((taskStart - timelineStartTime) / timelineDuration) * 100;
        const width = ((taskEnd - taskStart) / timelineDuration) * 100;
        
        return {
          left: `${left}%`,
          width: `${Math.max(width, 2)}%`,
        };
      } else if (end) {
        if (end < firstDate || end > timelineEndTime) return { display: 'none' };
        
        const left = ((end.getTime() - timelineStartTime) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      } else if (start) {
        if (start < firstDate || start > timelineEndTime) return { display: 'none' };
        
        const left = ((start.getTime() - timelineStartTime) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      }
    } else if (timeScale === "month") {
      // For month scale
      const timelineStartMonth = firstDate.getMonth() + firstDate.getFullYear() * 12;
      const lastMonth = lastDate.getMonth() + lastDate.getFullYear() * 12;
      const timelineDuration = lastMonth - timelineStartMonth + 1; // +1 to include the last month
      
      if (start && end) {
        const startMonth = start.getMonth() + start.getFullYear() * 12;
        const endMonth = end.getMonth() + end.getFullYear() * 12;
        
        // Check if task is outside timeline range
        if (endMonth < timelineStartMonth || startMonth > lastMonth) {
          return { display: 'none' };
        }
        
        const taskStartMonth = Math.max(startMonth, timelineStartMonth);
        const taskEndMonth = Math.min(endMonth, lastMonth) + 1; // +1 to include the end month
        
        const left = ((taskStartMonth - timelineStartMonth) / timelineDuration) * 100;
        const width = ((taskEndMonth - taskStartMonth) / timelineDuration) * 100;
        
        return {
          left: `${left}%`,
          width: `${Math.max(width, 2)}%`,
        };
      } else if (end) {
        const endMonth = end.getMonth() + end.getFullYear() * 12;
        if (endMonth < timelineStartMonth || endMonth > lastMonth) {
          return { display: 'none' };
        }
        
        const left = ((endMonth - timelineStartMonth) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      } else if (start) {
        const startMonth = start.getMonth() + start.getFullYear() * 12;
        if (startMonth < timelineStartMonth || startMonth > lastMonth) {
          return { display: 'none' };
        }
        
        const left = ((startMonth - timelineStartMonth) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      }
    } else if (timeScale === "quarter") {
      // For quarter scale
      const timelineStartQuarter = Math.floor(firstDate.getMonth() / 3) + firstDate.getFullYear() * 4;
      const lastQuarter = Math.floor(lastDate.getMonth() / 3) + lastDate.getFullYear() * 4;
      const timelineDuration = lastQuarter - timelineStartQuarter + 1;
      
      if (start && end) {
        const startQuarter = Math.floor(start.getMonth() / 3) + start.getFullYear() * 4;
        const endQuarter = Math.floor(end.getMonth() / 3) + end.getFullYear() * 4;
        
        if (endQuarter < timelineStartQuarter || startQuarter > lastQuarter) {
          return { display: 'none' };
        }
        
        const taskStartQuarter = Math.max(startQuarter, timelineStartQuarter);
        const taskEndQuarter = Math.min(endQuarter, lastQuarter) + 1;
        
        const left = ((taskStartQuarter - timelineStartQuarter) / timelineDuration) * 100;
        const width = ((taskEndQuarter - taskStartQuarter) / timelineDuration) * 100;
        
        return {
          left: `${left}%`,
          width: `${Math.max(width, 2)}%`,
        };
      } else if (end) {
        const endQuarter = Math.floor(end.getMonth() / 3) + end.getFullYear() * 4;
        if (endQuarter < timelineStartQuarter || endQuarter > lastQuarter) {
          return { display: 'none' };
        }
        
        const left = ((endQuarter - timelineStartQuarter) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      } else if (start) {
        const startQuarter = Math.floor(start.getMonth() / 3) + start.getFullYear() * 4;
        if (startQuarter < timelineStartQuarter || startQuarter > lastQuarter) {
          return { display: 'none' };
        }
        
        const left = ((startQuarter - timelineStartQuarter) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      }
    } else { // year
      // For year scale
      const timelineStartYear = firstDate.getFullYear();
      const lastYear = lastDate.getFullYear();
      const timelineDuration = lastYear - timelineStartYear + 1;
      
      if (start && end) {
        if (end.getFullYear() < timelineStartYear || start.getFullYear() > lastYear) {
          return { display: 'none' };
        }
        
        const taskStartYear = Math.max(start.getFullYear(), timelineStartYear);
        const taskEndYear = Math.min(end.getFullYear(), lastYear) + 1;
        
        const left = ((taskStartYear - timelineStartYear) / timelineDuration) * 100;
        const width = ((taskEndYear - taskStartYear) / timelineDuration) * 100;
        
        return {
          left: `${left}%`,
          width: `${Math.max(width, 2)}%`,
        };
      } else if (end) {
        if (end.getFullYear() < timelineStartYear || end.getFullYear() > lastYear) {
          return { display: 'none' };
        }
        
        const left = ((end.getFullYear() - timelineStartYear) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      } else if (start) {
        if (start.getFullYear() < timelineStartYear || start.getFullYear() > lastYear) {
          return { display: 'none' };
        }
        
        const left = ((start.getFullYear() - timelineStartYear) / timelineDuration) * 100;
        return {
          left: `${left}%`,
          width: '12px',
          marginLeft: '-6px',
          borderRadius: '50%'
        };
      }
    }
    
    return { display: 'none' };
  };

  // Determine task CSS classes based on its properties
  const getTaskClasses = (task: Task): string => {
    let baseClasses = "absolute h-7 shadow-sm cursor-pointer transition-all border flex items-center overflow-hidden";
    
    // If task has only start or due date (milestone), style differently
    if ((task.start_date && !task.due_date) || (!task.start_date && task.due_date)) {
      baseClasses += " h-7 w-7 rounded-full flex items-center justify-center";
    } else {
      baseClasses += " rounded-md";
    }
    
    // Add status-based classes
    if (task.status === "completed") {
      baseClasses += " bg-green-100 border-green-500";
    } else if (task.status === "in_progress") {
      baseClasses += " bg-blue-100 border-blue-500";
    } else {
      baseClasses += " bg-gray-100 border-gray-400";
    }
    
    // Add priority classes
    if (task.priority === "urgent") {
      baseClasses += " border-l-4 border-l-red-500";
    } else if (task.priority === "high") {
      baseClasses += " border-l-4 border-l-orange-400";
    } else if (task.priority === "medium") {
      baseClasses += " border-l-4 border-l-yellow-400";
    } else {
      baseClasses += " border-l-4 border-l-green-400";
    }
    
    // Additional classes for selected or hovered tasks
    if (selectedTask && selectedTask.id === task.id) {
      baseClasses += " ring-2 ring-blue-500 ring-offset-1 shadow-md";
    }
    
    if (hoveredTask === task.id) {
      baseClasses += " shadow-md";
    }
    
    // If task is favorite, add a special indicator
    if (task.is_favorite) {
      baseClasses += " border-r-4 border-r-amber-400";
    }
    
    return baseClasses;
  };

  // Generate the timeline
  const timelineDates = generateTimelineDates();
  
  // Initialize expanded state for each group
  useEffect(() => {
    const initialExpanded: ExpandedState = {};
    Object.keys(groupedTasks).forEach(key => {
      initialExpanded[key] = true;
    });
    setExpanded(initialExpanded);
  }, [groupBy, timelineMode]);

  // Task popup information
  const TaskPopup: React.FC<{ task: Task }> = ({ task }) => {
    if (!task) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute z-50 bg-white rounded-lg shadow-xl p-3 border border-gray-200 min-w-[250px] max-w-sm"
        style={{ top: '100%', left: '0' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {task.status === "completed" ? (
              <CheckIcon className="h-4 w-4 text-green-500 mr-1.5" />
            ) : task.status === "in_progress" ? (
              <PlayIcon className="h-4 w-4 text-blue-500 mr-1.5" />
            ) : (
              <ClockIcon className="h-4 w-4 text-gray-500 mr-1.5" />
            )}
            <h3 className="font-medium text-gray-900">
              {task.title}
            </h3>
            {task.is_favorite && <StarIcon className="h-4 w-4 text-amber-400 ml-1" />}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-2">
          {task.description.substring(0, 120)}{task.description.length > 120 ? '...' : ''}
        </div>
        
        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs mb-2">
          <div className="text-gray-500">Priorité:</div>
          <div className="font-medium">
            {task.priority === "urgent" ? "Urgent" : 
             task.priority === "high" ? "Élevée" : 
             task.priority === "medium" ? "Moyenne" : "Basse"}
          </div>
          
          <div className="text-gray-500">Statut:</div>
          <div className="font-medium">
            {task.status === "completed" ? "Terminé" : 
             task.status === "in_progress" ? "En cours" : "À faire"}
          </div>
          
          <div className="text-gray-500">Assigné à:</div>
          <div className="font-medium">
            {task.assignee_id ? getDisplayName(getUserById(task.assignee_id)) : "Non assigné"}
          </div>
          
          <div className="text-gray-500">Échéance:</div>
          <div className="font-medium">
            {task.due_date ? formatDate(task.due_date, 'short') : "Non définie"}
          </div>
          
          {task.start_date && (
            <>
              <div className="text-gray-500">Début:</div>
              <div className="font-medium">
                {formatDate(task.start_date, 'short')}
              </div>
            </>
          )}
          
          {task.completion_percentage > 0 && (
            <>
              <div className="text-gray-500">Progression:</div>
              <div className="font-medium">
                {task.completion_percentage}%
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(task);
              setShowTaskModal(true);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowTopRightOnSquareIcon className="h-3 w-3 mr-1" />
            Voir les détails
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
              Timeline
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({timelineTasks.length} tâches)
              </span>
            </h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* View mode toggle */}
            <div className="flex items-center bg-white border rounded-lg p-1 shadow-sm">
              <TimelineTooltip content="Vue simple">
                <button
                  onClick={() => setTimelineMode("standard")}
                  className={`p-1.5 rounded ${timelineMode === "standard" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
              </TimelineTooltip>
              
              <TimelineTooltip content="Vue groupée">
                <button
                  onClick={() => setTimelineMode("grouped")}
                  className={`p-1.5 rounded ${timelineMode === "grouped" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <FolderIcon className="h-4 w-4" />
                </button>
              </TimelineTooltip>
              
              <TimelineTooltip content="Options d'affichage">
                <button
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  className={`p-1.5 rounded ${isFilterPanelOpen ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                </button>
              </TimelineTooltip>
            </div>
            
            {/* Zoom controls */}
            <div className="flex items-center bg-white border rounded-lg shadow-sm">
              <TimelineTooltip content="Zoom arrière">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-l-lg disabled:opacity-30 disabled:hover:bg-white"
                  disabled={zoom <= 0.5}
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </TimelineTooltip>
              
              <span className="px-2 text-xs font-medium text-gray-600">
                {Math.round(zoom * 100)}%
              </span>
              
              <TimelineTooltip content="Zoom avant">
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-r-lg disabled:opacity-30 disabled:hover:bg-white"
                  disabled={zoom >= 2}
                >
                  <ChevronUpIcon className="h-4 w-4" />
                </button>
              </TimelineTooltip>
            </div>
            
            {/* Scale buttons */}
            <div className="flex items-center bg-white border rounded-lg shadow-sm overflow-hidden">
              <TimelineTooltip content="Jour">
                <button
                  onClick={() => setTimeScale("day")}
                  className={`px-3 py-1.5 text-xs font-medium ${timeScale === "day" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  J
                </button>
              </TimelineTooltip>
              
              <TimelineTooltip content="Semaine">
                <button
                  onClick={() => setTimeScale("week")}
                  className={`px-3 py-1.5 text-xs font-medium ${timeScale === "week" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  S
                </button>
              </TimelineTooltip>
              
              <TimelineTooltip content="Mois">
                <button
                  onClick={() => setTimeScale("month")}
                  className={`px-3 py-1.5 text-xs font-medium ${timeScale === "month" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  M
                </button>
              </TimelineTooltip>
              
              <TimelineTooltip content="Trimestre">
                <button
                  onClick={() => setTimeScale("quarter")}
                  className={`px-3 py-1.5 text-xs font-medium ${timeScale === "quarter" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  T
                </button>
              </TimelineTooltip>
              
              <TimelineTooltip content="Année">
                <button
                  onClick={() => setTimeScale("year")}
                  className={`px-3 py-1.5 text-xs font-medium ${timeScale === "year" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  A
                </button>
              </TimelineTooltip>
            </div>
          </div>
        </div>
        
        {/* Filter panel */}
        <AnimatePresence>
          {isFilterPanelOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3"
            >
              <div className="py-3 px-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
                {/* Group by options */}
                {timelineMode === "grouped" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Grouper par
                    </label>
                    <select
                      value={groupBy}
                      onChange={(e) => setGroupBy(e.target.value as "project" | "assignee" | "status" | "priority" | "category")}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="project">Projet</option>
                      <option value="assignee">Assigné</option>
                      <option value="status">Statut</option>
                      <option value="priority">Priorité</option>
                      <option value="category">Catégorie</option>
                    </select>
                  </div>
                )}
                
                {/* Show completed checkbox */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 inline-flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={showCompleted}
                      onChange={() => setShowCompleted(!showCompleted)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    />
                    Afficher les tâches terminées
                  </label>
                </div>
                
                {/* Period navigation */}
                <div className="flex items-center justify-start gap-2">
                  <TimelineTooltip content="Période précédente">
                    <button
                      onClick={() => moveTimeline(-1)}
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                  </TimelineTooltip>
                  
                  <TimelineTooltip content="Réinitialiser">
                    <button
                      onClick={resetTimeline}
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                  </TimelineTooltip>
                  
                  <TimelineTooltip content="Période suivante">
                    <button
                      onClick={() => moveTimeline(1)}
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </TimelineTooltip>
                  
                  <span className="text-sm text-gray-600 font-medium ml-1">
                    {timeScale === "day" &&
                      `${timelineDates[0].date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - 
                      ${timelineDates[timelineDates.length - 1].date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}
                    {timeScale === "week" &&
                      `${timelineDates[0].date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - 
                      ${timelineDates[timelineDates.length - 1].endDate?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}
                    {timeScale === "month" &&
                      `${timelineDates[0].date.toLocaleDateString('fr-FR', { month: 'long' })} - 
                      ${timelineDates[timelineDates.length - 1].date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}
                    {timeScale === "quarter" &&
                      `${timelineDates[0].fullLabel} - ${timelineDates[timelineDates.length - 1].fullLabel}`}
                    {timeScale === "year" &&
                      `${timelineDates[0].label} - ${timelineDates[timelineDates.length - 1].label}`}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Timeline Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Timeline Header */}
        <div className="flex py-2 border-b bg-gray-50 sticky top-0 z-10">
          <div className={`w-48 sm:w-56 md:w-64 lg:w-80 flex-shrink-0 px-2 sm:px-4 ${timelineMode === "grouped" ? "text-center" : ""}`}>
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {timelineMode === "grouped" ? 
                groupBy === "project" ? "Projet" :
                groupBy === "assignee" ? "Assigné" :
                groupBy === "status" ? "Statut" :
                groupBy === "priority" ? "Priorité" :
                "Catégorie"
                : "Tâches"
              }
            </span>
          </div>
          
          <div className="flex-1 overflow-x-auto pl-2 sm:pl-4">
            <div 
              className="flex"
              style={{ 
                minWidth: timeScale === "day" ? `${timelineDates.length * (40 * zoom)}px` :
                          `${timelineDates.length * (80 * zoom)}px` 
              }}
            >
              {timelineDates.map((dateInfo, idx) => (
                <div 
                  key={`date-${idx}`}
                  className={`text-center border-r ${dateInfo.isToday ? "bg-blue-50" : ""}`}
                  style={{ 
                    minWidth: timeScale === "day" ? `${40 * zoom}px` : `${80 * zoom}px`,
                    maxWidth: timeScale === "day" ? `${120 * zoom}px` : undefined
                  }}
                >
                  <div className={`text-xs px-1 py-0.5 rounded-sm truncate font-medium ${dateInfo.isToday ? "text-blue-600" : "text-gray-500"}`}>
                    {dateInfo.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Timeline Content */}
        <div className="flex-1 overflow-auto relative">
          <div className="flex h-full">
            {/* Projects/Categories column */}
            <div className="w-48 sm:w-56 md:w-64 lg:w-80 flex-shrink-0 overflow-y-auto border-r bg-white">
              {timelineMode === "grouped" ? (
                // Grouped view (by project, assignee, etc.)
                <div className="divide-y">
                  {Object.keys(groupedTasks).map(groupId => {
                    const group = groupedTasks[groupId];
                    const isExpanded = expanded[groupId] !== false;
                    
                    return (
                      <div key={`group-${groupId}`} className="py-1 relative">
                        <div 
                          className="flex items-center py-2 px-2 sm:px-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleExpand(groupId)}
                        >
                          <button className="p-1 rounded-md mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            {isExpanded ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4" />
                            )}
                          </button>
                          
                          {groupBy === "project" && group.color && (
                            <div 
                              className="h-3 w-3 rounded-full mr-2 flex-shrink-0" 
                              style={{ backgroundColor: group.color }}
                            ></div>
                          )}
                          
                          <div className="flex items-center">
                            <span className="font-medium text-xs sm:text-sm truncate text-gray-900">
                              {group.name}
                            </span>
                            <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                              {group.tasks.length}
                            </span>
                          </div>
                        </div>
                        
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-8 pr-2 sm:pr-4 pb-1"
                            >
                              <div className="space-y-1">
                                {group.tasks.map(task => (
                                  <div 
                                    key={`group-task-${task.id}`}
                                    className={`py-1.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm truncate cursor-pointer hover:bg-gray-50 ${
                                      selectedTask && selectedTask.id === task.id ? "bg-blue-50 text-blue-700" : ""
                                    }`}
                                    onClick={() => {
                                      setSelectedTask(task);
                                      setShowTaskModal(true);
                                    }}
                                    onMouseEnter={() => setHoveredTask(task.id)}
                                    onMouseLeave={() => setHoveredTask(null)}
                                  >
                                    <div className="flex items-center">
                                      {task.status === "completed" ? (
                                        <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 flex-shrink-0" />
                                      ) : task.status === "in_progress" ? (
                                        <PlayIcon className="h-4 w-4 text-blue-500 mr-1.5 flex-shrink-0" />
                                      ) : (
                                        <ClockIcon className="h-4 w-4 text-gray-500 mr-1.5 flex-shrink-0" />
                                      )}
                                      <span className={`truncate ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-700"}`}>
                                        {task.title}
                                      </span>
                                      <TaskBadge task={task} />
                                      {task.is_favorite && (
                                        <StarIcon className="h-3.5 w-3.5 text-amber-400 ml-1 flex-shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Standard view (flat list of tasks)
                <div className="py-1">
                  {timelineTasks.map(task => (
                    <div 
                      key={`task-list-${task.id}`}
                      className={`py-1.5 px-2 sm:px-4 text-xs sm:text-sm truncate cursor-pointer hover:bg-gray-50 relative ${
                        selectedTask && selectedTask.id === task.id ? "bg-blue-50 shadow-sm" : ""
                      }`}
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskModal(true);
                      }}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      <div className="flex items-center">
                        {task.status === "completed" ? (
                          <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 flex-shrink-0" />
                        ) : task.status === "in_progress" ? (
                          <PlayIcon className="h-4 w-4 text-blue-500 mr-1.5 flex-shrink-0" />
                        ) : (
                          <ClockIcon className="h-4 w-4 text-gray-500 mr-1.5 flex-shrink-0" />
                        )}
                        <span className={`truncate ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-700"}`}>
                          {task.title}
                        </span>
                        <TaskBadge task={task} />
                        {task.is_favorite && (
                          <StarIcon className="h-3.5 w-3.5 text-amber-400 ml-1 flex-shrink-0" />
                        )}
                      </div>
                      
                      {/* Task popup on hover */}
                      {hoveredTask === task.id && (
                        <div className="absolute left-full ml-2 top-0 z-50">
                          <TaskPopup task={task} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Timeline grid */}
            <div className="flex-1 overflow-x-auto relative">
              {timelineMode === "grouped" ? (
                // Grouped timeline view
                <div>
                  {Object.keys(groupedTasks).map(groupId => {
                    const group = groupedTasks[groupId];
                    const isExpanded = expanded[groupId] !== false;
                    
                    return (
                      <div key={`timeline-group-${groupId}`}>
                        {/* Group header (empty row) */}
                        <div 
                          className={`h-10 border-b border-gray-100 ${isExpanded ? "" : ""}`}
                          style={{ 
                            minWidth: timeScale === "day" ? `${timelineDates.length * (40 * zoom)}px` :
                                      `${timelineDates.length * (80 * zoom)}px` 
                          }}
                        >
                          {/* Empty space matching the group header */}
                        </div>
                        
                        {/* Group tasks */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {group.tasks.map(task => (
                                <div 
                                  key={`timeline-task-${task.id}`}
                                  className="h-8 relative mb-1 border-b border-gray-100"
                                  style={{ 
                                    minWidth: timeScale === "day" ? `${timelineDates.length * (40 * zoom)}px` :
                                              `${timelineDates.length * (80 * zoom)}px` 
                                  }}
                                >
                                  {/* Background grid lines */}
                                  <div className="absolute inset-0 grid" style={{ 
                                    gridTemplateColumns: `repeat(${timelineDates.length}, minmax(${
                                      timeScale === "day" ? 40 * zoom : 80 * zoom}px, 1fr))` 
                                  }}>
                                    {timelineDates.map((date, idx) => (
                                      <div 
                                        key={`grid-${idx}`} 
                                        className={`border-r ${date.isToday ? "bg-blue-50/20" : ""}`}
                                      ></div>
                                    ))}
                                  </div>
                                  
                                  {/* Task bar */}
                                  <motion.div
                                    className={getTaskClasses(task)}
                                    style={{
                                      ...getTaskTimelineStyle(task, timelineDates),
                                      top: "2px"
                                    }}
                                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                    onClick={() => {
                                      setSelectedTask(task);
                                      setShowTaskModal(true);
                                    }}
                                    onMouseEnter={() => setHoveredTask(task.id)}
                                    onMouseLeave={() => setHoveredTask(null)}
                                  >
                                    {/* If not a milestone, show task info */}
                                    {!(
                                      (task.start_date && !task.due_date) || 
                                      (!task.start_date && task.due_date)
                                    ) && (
                                      <div className="px-2 truncate text-xs font-medium">
                                        {task.title}
                                      </div>
                                    )}
                                    
                                    {/* If milestone, show icon */}
                                    {((task.start_date && !task.due_date) || (!task.start_date && task.due_date)) && (
                                      <div className="flex items-center justify-center w-full h-full">
                                        <FlagIcon className="h-3.5 w-3.5" />
                                      </div>
                                    )}
                                  </motion.div>
                                  
                                  {/* Task popup on hover */}
                                  {hoveredTask === task.id && (
                                    <div className="absolute z-50" style={{
                                      ...getTaskTimelineStyle(task, timelineDates),
                                      top: "36px" // Position below the task bar
                                    }}>
                                      <TaskPopup task={task} />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Standard timeline view (flat list)
                <div>
                  {timelineTasks.map(task => (
                    <div 
                      key={`timeline-standard-${task.id}`}
                      className="h-8 relative mb-1 border-b border-gray-100"
                      style={{ 
                        minWidth: timeScale === "day" ? `${timelineDates.length * (40 * zoom)}px` :
                                  `${timelineDates.length * (80 * zoom)}px` 
                      }}
                    >
                      {/* Background grid */}
                      <div className="absolute inset-0 grid" style={{ 
                        gridTemplateColumns: `repeat(${timelineDates.length}, minmax(${
                          timeScale === "day" ? 40 * zoom : 80 * zoom}px, 1fr))` 
                      }}>
                        {timelineDates.map((date, idx) => (
                          <div 
                            key={`grid-${idx}`} 
                            className={`border-r ${date.isToday ? "bg-blue-50/20" : ""}`}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Task bar */}
                      <motion.div
                        className={getTaskClasses(task)}
                        style={{
                          ...getTaskTimelineStyle(task, timelineDates),
                          top: "2px"
                        }}
                        whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                      >
                        {/* If not a milestone, show task info */}
                        {!(
                          (task.start_date && !task.due_date) || 
                          (!task.start_date && task.due_date)
                        ) && (
                          <div className="px-2 truncate text-xs font-medium">
                            {task.title}
                          </div>
                        )}
                        
                        {/* If milestone, show icon */}
                        {((task.start_date && !task.due_date) || (!task.start_date && task.due_date)) && (
                          <div className="flex items-center justify-center w-full h-full">
                            <FlagIcon className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </motion.div>
                      
                      {/* Task popup on hover */}
                      {hoveredTask === task.id && (
                        <div className="absolute z-50" style={{
                          ...getTaskTimelineStyle(task, timelineDates),
                          top: "36px" // Position below the task bar
                        }}>
                          <TaskPopup task={task} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Today marker */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                style={{ 
                  left: (() => {
                    const today = new Date();
                    const timelineStartTime = timelineDates[0].date.getTime();
                    const timelineEndTime = timeScale === "day" 
                      ? timelineDates[timelineDates.length - 1].date.getTime() + 24 * 60 * 60 * 1000
                      : timeScale === "week"
                      ? (timelineDates[timelineDates.length - 1].endDate?.getTime() || 0) + 24 * 60 * 60 * 1000
                      : timeScale === "month"
                      ? new Date(timelineDates[timelineDates.length - 1].date.getFullYear(), timelineDates[timelineDates.length - 1].date.getMonth() + 1, 1).getTime()
                      : timeScale === "quarter"
                      ? new Date(timelineDates[timelineDates.length - 1].date.getFullYear(), (Math.floor(timelineDates[timelineDates.length - 1].date.getMonth() / 3) + 1) * 3, 1).getTime()
                      : new Date(timelineDates[timelineDates.length - 1].date.getFullYear() + 1, 0, 1).getTime();
                    
                    const timelineDuration = timelineEndTime - timelineStartTime;
                    if (today < new Date(timelineStartTime) || today > new Date(timelineEndTime)) {
                      return "-9999px"; // Hide if today is outside range
                    }
                    
                    const left = ((today.getTime() - timelineStartTime) / timelineDuration) * 100;
                    return `${left}%`;
                  })()
                }}
              >
                <div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-red-500"></div>
                <div className="absolute -left-[30px] -top-8 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Aujourd&apos;hui
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Empty state */}
        {timelineTasks.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20">
            <div className="text-center max-w-md p-6">
                
              <div className="mx-auto bg-gray-100 p-3 rounded-full h-16 w-16 flex items-center justify-center text-gray-400 mb-4">
                <CalendarIcon className="h-8 w-8" />
                </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche à afficher</h3>
              <p className="text-gray-500 mb-4">
                Il n&apos;y a pas de tâches avec des dates définies qui correspondent à vos filtres actuels.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    // Reset filters (this would need to be implemented in the parent component)
                    alert("Réinitialisation des filtres");
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Réinitialiser les filtres
                </button>
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {showCompleted ? "Masquer" : "Afficher"} les tâches terminées
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;