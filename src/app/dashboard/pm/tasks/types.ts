// types.ts - Comprehensive type definitions for the Task management system

export type TaskStatus = "not_started" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskCategory = 
  | "administrative" 
  | "finance" 
  | "hr" 
  | "compliance" 
  | "reporting"
  | "legal"
  | "meetings"
  | "procurement"
  | "onboarding"
  | "auditing";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number; // in KB
  url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  attachments?: Attachment[];
}

export interface TaskEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
}

export interface ExternalLink {
  title: string;
  url: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar_url?: string;
  department?: string;
}

export interface Project {
  id: string;
  name: string;
  client_name?: string;
  color: string;
  status: "active" | "completed" | "on_hold" | "planned";
}

export interface Task {
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
  is_favorite?: boolean;
  location?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  
  // Complex objects
  checklist?: Checklist[];
  comments?: Comment[];
  attachments?: Attachment[];
  related_events?: TaskEvent[];
  related_tasks?: string[];
  external_links?: ExternalLink[];
  
  // Index signature to allow for additional properties
  // Note that we've updated this to include more complex types
  [key: string]: string | number | boolean | null | string[] | undefined |
    Checklist[] | Comment[] | Attachment[] | TaskEvent[] | ExternalLink[] | 
    { title: string; url: string }[];
}