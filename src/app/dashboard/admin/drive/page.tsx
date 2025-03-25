"use client";

import { useState, useEffect } from "react";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  FolderIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon,
  // ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  // PlusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ShareIcon,
  TrashIcon,
  // PencilIcon,
  FolderPlusIcon,
  // CalendarIcon,
  UserPlusIcon,
  XMarkIcon,
  ArrowDownOnSquareIcon,
  StarIcon,
  // BarsArrowDownIcon,
  // BarsArrowUpIcon,
  // UserCircleIcon,
  FunnelIcon,
  TableCellsIcon,
  Squares2X2Icon,
  // LinkIcon,
  // ArrowRightCircleIcon,
  // EyeIcon,
  // LockClosedIcon,
  PhotoIcon,
  FilmIcon,
  // CubeIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  ClockIcon,
  CheckIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

// Import modals
import { CreateFolderModal } from "./CreateFolderModal";
import { ShareFileModal } from "./ShareFileModal";
import { UploadFileModal } from "./UploadFileModal";
import { ConnectDriveModal } from "./ConnectDriveModal";
import { FileDetailsModal } from "./FileDetailsModal";

// Types for Drive integration
export interface IDriveAccount {
  _id: string;
  email: string;
  name: string;
  status: "connected" | "disconnected" | "connecting";
  quota: {
    used: number;
    total: number;
  }
  lastSynced: string;
  isDefault: boolean;
}

export interface IDriveItem {
  _id: string;
  name: string;
  type: "folder" | "document" | "spreadsheet" | "presentation" | "pdf" | "image" | "video" | "audio" | "archive" | "other";
  mimeType: string;
  size: number;
  owner: {
    name: string;
    email: string;
    picture?: string;
  };
  createdAt: string;
  modifiedAt: string;
  parentId: string | null;
  path: string[];
  shared: boolean;
  sharedWith?: {
    type: "user" | "group" | "domain" | "anyone";
    email?: string;
    name?: string;
    role: "viewer" | "commenter" | "editor" | "owner";
  }[];
  starred: boolean;
  webViewLink?: string;
  webContentLink?: string;
  thumbnail?: string;
  accountId: string;
}

// Helper utilities
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) {
    return 'Aujourd\'hui ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (dayDiff === 1) {
    return 'Hier ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (dayDiff < 7) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()] + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  }
};

// Pre-defined folders/views
const specialFolders = [
  { id: "root", name: "Mon Drive", icon: FolderIcon, color: "#213f5b" },
  { id: "shared-with-me", name: "Partagés avec moi", icon: ShareIcon, color: "#0ea5e9" },
  { id: "starred", name: "Suivis", icon: StarIcon, color: "#f59e0b" },
  { id: "recent", name: "Récents", icon: ClockIcon, color: "#8b5cf6" },
  { id: "trash", name: "Corbeille", icon: TrashIcon, color: "#6b7280" },
];

// File type icons and colors mapping
const fileTypeIcons: Record<string, { 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  color: string; 
  bgColor: string 
}> = {
  "folder": { icon: FolderIcon, color: "#213f5b", bgColor: "#f0f7ff" },
  "document": { icon: DocumentIcon, color: "#3b82f6", bgColor: "#eff6ff" },
  "spreadsheet": { icon: TableCellsIcon, color: "#10b981", bgColor: "#ecfdf5" },
  "presentation": { icon: Squares2X2Icon, color: "#f59e0b", bgColor: "#fffbeb" },
  "pdf": { icon: DocumentDuplicateIcon, color: "#ef4444", bgColor: "#fef2f2" },
  "image": { icon: PhotoIcon, color: "#8b5cf6", bgColor: "#f5f3ff" },
  "video": { icon: FilmIcon, color: "#ec4899", bgColor: "#fdf2f8" },
  "audio": { icon: MusicalNoteIcon, color: "#0ea5e9", bgColor: "#f0f9ff" },
  "archive": { icon: ArchiveBoxIcon, color: "#6b7280", bgColor: "#f3f4f6" },
  "other": { icon: DocumentIcon, color: "#6b7280", bgColor: "#f3f4f6" },
};

export default function GoogleDrivePage() {
  // States for Drive integration
  const [driveAccounts, setDriveAccounts] = useState<IDriveAccount[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [items, setItems] = useState<IDriveItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string; name: string}[]>([{ id: "root", name: "Mon Drive" }]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false);
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [sharedFilter, setSharedFilter] = useState<boolean | null>(null);
  
  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState<boolean>(false);
  const [isShareFileModalOpen, setIsShareFileModalOpen] = useState<boolean>(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState<boolean>(false);
  const [isConnectDriveModalOpen, setIsConnectDriveModalOpen] = useState<boolean>(false);
  const [fileDetailsModal, setFileDetailsModal] = useState<{isOpen: boolean; fileId: string | null}>({
    isOpen: false,
    fileId: null
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    totalShared: 0,
    recentlyModified: 0
  });

  // Fetch Drive accounts and files
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Mock fetching Drive accounts
        // In a real implementation, this would be an API call
        const mockAccounts: IDriveAccount[] = [
          {
            _id: "1",
            email: "contact@votreentreprise.com",
            name: "Professionnel",
            status: "connected",
            quota: {
              used: 5.2 * 1024 * 1024 * 1024, // 5.2 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            },
            lastSynced: new Date().toISOString(),
            isDefault: true
          },
          {
            _id: "2",
            email: "marketing@votreentreprise.com",
            name: "Marketing",
            status: "connected",
            quota: {
              used: 8.7 * 1024 * 1024 * 1024, // 8.7 GB
              total: 30 * 1024 * 1024 * 1024  // 30 GB
            },
            lastSynced: new Date().toISOString(),
            isDefault: false
          },
          {
            _id: "3",
            email: "personnel@gmail.com",
            name: "Personnel",
            status: "disconnected",
            quota: {
              used: 0,
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            },
            lastSynced: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            isDefault: false
          }
        ];
        
        // Set default account
        const defaultAccount = mockAccounts.find(a => a.status === "connected" && a.isDefault);
        
        if (defaultAccount) {
          setCurrentAccount(defaultAccount._id);
        } else {
          const firstConnected = mockAccounts.find(a => a.status === "connected");
          if (firstConnected) {
            setCurrentAccount(firstConnected._id);
          }
        }
        
        setDriveAccounts(mockAccounts);
        
        // Mock Drive items
        await fetchDriveItems();
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Fetch Drive items based on current folder
  const fetchDriveItems = async (folderId: string = "root") => {
    setLoading(true);
    try {
      // Mock fetching files and folders
      // In a real implementation, this would be an API call
      
      // Generate random files and folders
      // Use type assertion to tell TypeScript these are valid IDriveItem type values
      const types = Object.keys(fileTypeIcons) as Array<IDriveItem['type']>;
      const sharedOptions = [true, false, false, false]; // 25% chance of being shared
      
      const folderCount = Math.floor(Math.random() * 5) + 2; // 2-6 folders
      const fileCount = Math.floor(Math.random() * 15) + 5; // 5-19 files
      
      // Generate folders
      const folders: IDriveItem[] = Array.from({ length: folderCount }, (_, i) => {
        const isShared = sharedOptions[Math.floor(Math.random() * sharedOptions.length)];
        
        return {
          _id: `folder_${folderId}_${i}`,
          name: `Dossier ${i + 1}`,
          type: "folder", // This is explicitly a valid type
          mimeType: "application/vnd.google-apps.folder",
          size: 0,
          owner: {
            name: "Vous",
            email: currentAccount ? driveAccounts.find(a => a._id === currentAccount)?.email || "" : "",
            picture: "https://ui-avatars.com/api/?name=You&background=213f5b&color=fff"
          },
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          modifiedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
          parentId: folderId,
          path: folderId === "root" ? ["root"] : ["root", folderId],
          shared: isShared,
          starred: Math.random() > 0.8,
          accountId: currentAccount || "1"
        };
      });
      
      // Generate files with proper type handling
      const files: IDriveItem[] = Array.from({ length: fileCount }, (_, i) => {
        // Filter out folder type and select from remaining valid types
        const fileTypes = types.filter(t => t !== "folder");
        const type = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        
        const isShared = sharedOptions[Math.floor(Math.random() * sharedOptions.length)];
        const size = Math.floor(Math.random() * 100000000) + 500000; // 500KB to 100MB
        
        let fileName = `Fichier ${i + 1}`;
        const fileExtensions: Record<string, string> = {
          "document": ".docx",
          "spreadsheet": ".xlsx",
          "presentation": ".pptx",
          "pdf": ".pdf",
          "image": [".jpg", ".png", ".gif"][Math.floor(Math.random() * 3)],
          "video": [".mp4", ".mov", ".avi"][Math.floor(Math.random() * 3)],
          "audio": [".mp3", ".wav", ".flac"][Math.floor(Math.random() * 3)],
          "archive": [".zip", ".rar", ".tar.gz"][Math.floor(Math.random() * 3)],
          "other": [".txt", ".json", ".xml", ".html"][Math.floor(Math.random() * 4)]
        };
        
        fileName += fileExtensions[type] || "";
        
        return {
          _id: `file_${folderId}_${i}`,
          name: fileName,
          type: type, // Now this is guaranteed to be a valid IDriveItem type
          mimeType: `application/${type}`,
          size: size,
          owner: {
            name: "Vous",
            email: currentAccount ? driveAccounts.find(a => a._id === currentAccount)?.email || "" : "",
            picture: "https://ui-avatars.com/api/?name=You&background=213f5b&color=fff"
          },
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          modifiedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
          parentId: folderId,
          path: folderId === "root" ? ["root"] : ["root", folderId],
          shared: isShared,
          sharedWith: isShared ? [
            {
              type: "user",
              email: "collaborateur@example.com",
              name: "Collaborateur",
              role: ["viewer", "commenter", "editor"][Math.floor(Math.random() * 3)] as "viewer" | "commenter" | "editor"
            }
          ] : undefined,
          starred: Math.random() > 0.8,
          webViewLink: `https://drive.google.com/file/d/${i}/view`,
          webContentLink: `https://drive.google.com/uc?id=${i}`,
          thumbnail: type === "image" ? `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/300` : undefined,
          accountId: currentAccount || "1"
        };
      });
      
      // Combine and sort items
      const allItems = [...folders, ...files];
      allItems.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
      
      setItems(allItems);
      
      // Update breadcrumbs if necessary
      if (folderId === "root") {
        setBreadcrumbs([{ id: "root", name: "Mon Drive" }]);
      } else if (folderId === "shared-with-me") {
        setBreadcrumbs([{ id: "shared-with-me", name: "Partagés avec moi" }]);
      } else if (folderId === "starred") {
        setBreadcrumbs([{ id: "starred", name: "Suivis" }]);
      } else if (folderId === "recent") {
        setBreadcrumbs([{ id: "recent", name: "Récents" }]);
      } else if (folderId === "trash") {
        setBreadcrumbs([{ id: "trash", name: "Corbeille" }]);
      }
      // For other folders, would typically fetch the folder details to build breadcrumbs
      
      // Update stats
      const mockStats = {
        totalFiles: fileCount,
        totalFolders: folderCount,
        totalShared: allItems.filter(item => item.shared).length,
        recentlyModified: allItems.filter(item => {
          const modified = new Date(item.modifiedAt);
          const now = new Date();
          const diff = now.getTime() - modified.getTime();
          const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
          return dayDiff < 7;
        }).length
      };
      
      setStats(mockStats);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle folder navigation
  const navigateToFolder = (folderId: string, folderName?: string) => {
    setSelectedItems([]);
    setCurrentFolder(folderId);
    
    // Handle special folders
    if (specialFolders.some(f => f.id === folderId)) {
      const specialFolder = specialFolders.find(f => f.id === folderId);
      if (specialFolder) {
        setBreadcrumbs([{ id: specialFolder.id, name: specialFolder.name }]);
      }
    } else {
      // For normal folders
      if (folderName) {
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
      }
    }
    
    fetchDriveItems(folderId);
  };

  // Navigate up one level in the folder hierarchy
  const navigateUp = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setBreadcrumbs(newBreadcrumbs);
      const parentFolder = newBreadcrumbs[newBreadcrumbs.length - 1];
      setCurrentFolder(parentFolder.id);
      fetchDriveItems(parentFolder.id);
    } else {
      // Already at root level, do nothing or navigate to a default view
    }
  };

  // Handle selecting items
  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Apply filters and sorting to items
  const filteredAndSortedItems = items
    .filter(item => {
      // Apply search
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply file type filter
      if (fileTypeFilter && item.type !== fileTypeFilter) {
        return false;
      }
      
      // Apply shared filter
      if (sharedFilter !== null && item.shared !== sharedFilter) {
        return false;
      }
      
      // Special folder filters
      if (currentFolder === "shared-with-me" && !item.shared) {
        return false;
      }
      
      if (currentFolder === "starred" && !item.starred) {
        return false;
      }
      
      if (currentFolder === "recent") {
        const modified = new Date(item.modifiedAt);
        const now = new Date();
        const diff = now.getTime() - modified.getTime();
        const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
        return dayDiff < 7;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Always show folders first
      if (a.type === "folder" && b.type !== "folder") {
        return -1;
      }
      if (a.type !== "folder" && b.type === "folder") {
        return 1;
      }
      
      // Then apply the selected sort
      switch (sortBy) {
        case "name":
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "modified":
          return sortDirection === "asc"
            ? new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime()
            : new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
        case "size":
          return sortDirection === "asc"
            ? a.size - b.size
            : b.size - a.size;
        default:
          return 0;
      }
    });

  // Handle uploading a file (mock implementation)
  const handleUpload = (file: File) => {
    console.log("Uploading file:", file);
    // In a real implementation, this would upload the file to Google Drive
    setIsUploadFileModalOpen(false);
  };

  // Handle creating a folder (mock implementation)
  const handleCreateFolder = (folderName: string) => {
    const newFolder: IDriveItem = {
      _id: `folder_${Date.now()}`,
      name: folderName,
      type: "folder",
      mimeType: "application/vnd.google-apps.folder",
      size: 0,
      owner: {
        name: "Vous",
        email: currentAccount ? driveAccounts.find(a => a._id === currentAccount)?.email || "" : "",
        picture: "https://ui-avatars.com/api/?name=You&background=213f5b&color=fff"
      },
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      parentId: currentFolder,
      path: currentFolder === "root" ? ["root"] : ["root", currentFolder],
      shared: false,
      starred: false,
      accountId: currentAccount || "1"
    };
    
    setItems([newFolder, ...items]);
    setIsCreateFolderModalOpen(false);
  };

  // Instead of using 'any' for the role, we should use the proper union type that's defined in the IDriveItem interface
// Accept the more generic type for compatibility with component props
const handleShare = (itemId: string, shareWith: { email: string; role: string }[]) => {
  setItems(items.map(item => {
    if (item._id === itemId || selectedItems.includes(item._id)) {
      return {
        ...item,
        shared: true,
        sharedWith: shareWith.map(share => {
          // Validate that the role is a valid one before assigning
          const validRole = ["viewer", "commenter", "editor", "owner"].includes(share.role) 
            ? share.role as "viewer" | "commenter" | "editor" | "owner"
            : "viewer"; // Default to viewer if an invalid role is provided
            
          return {
            type: "user",
            email: share.email,
            name: share.email.split("@")[0],
            role: validRole
          };
        })
      };
    }
    return item;
  }));
  
  setIsShareFileModalOpen(false);
};

  // Delete selected items (mock implementation)
  const deleteItems = () => {
    if (selectedItems.length === 0) return;
    
    // In a real implementation, would make API call to Google Drive
    setItems(items.filter(item => !selectedItems.includes(item._id)));
    setSelectedItems([]);
  };

  // Toggle star status for items (mock implementation)
  const toggleStarred = () => {
    if (selectedItems.length === 0) return;
    
    setItems(items.map(item => {
      if (selectedItems.includes(item._id)) {
        return { ...item, starred: !item.starred };
      }
      return item;
    }));
  };

  // Connect a new Google Drive account (mock implementation)
  const handleConnectDrive = (account: IDriveAccount) => {
    setDriveAccounts([...driveAccounts, account]);
    setCurrentAccount(account._id);
    setIsConnectDriveModalOpen(false);
  };

  // View file details
  const viewFileDetails = (fileId: string) => {
    setFileDetailsModal({
      isOpen: true,
      fileId
    });
  };

  // Render file/folder icon based on type
  const renderItemIcon = (type: string) => {
    const fileType = fileTypeIcons[type] || fileTypeIcons.other;
    const Icon = fileType.icon;
    
    return (
      <div className="rounded-lg p-2" style={{ backgroundColor: fileType.bgColor }}>
        <Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: fileType.color }} />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="max-w-full h-full flex flex-col">
            {/* Dashboard Header with Stats */}
            <div className="bg-white border-b border-[#eaeaea] px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                <div className="relative">
                  <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#bfddf9] to-[#d2fcb2] rounded-full"></div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-1 pl-2">Google Drive</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gérez vos fichiers et dossiers Google Drive</p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="flex items-center gap-3 self-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsConnectDriveModalOpen(true)}
                    className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un compte
                  </Button>
                  <Button
                    onClick={() => setIsUploadFileModalOpen(true)}
                    className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                  >
                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#bfddf9] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Fichiers</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalFiles}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">documents, images, etc.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-200">
                      <DocumentIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#213f5b] to-[#415d7c] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#213f5b] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Dossiers</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalFolders}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">dossiers organisés</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-lg shadow-indigo-200">
                      <FolderIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d2fcb2] to-[#a7f17f] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#d2fcb2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Partagés</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalShared}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">fichiers collaboratifs</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-200">
                      <ShareIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-[#f0f0f0] hover:border-[#bfddf9] transition-colors overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bfddf9] to-[#8cc7ff] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#bfddf9] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#213f5b] font-medium">Récents</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.recentlyModified}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">derniers 7 jours</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200">
                      <ClockIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Storage Usage */}
              {currentAccount && (
                <div className="mt-4 bg-white rounded-xl border border-[#eaeaea] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-medium text-[#213f5b]">Espace de stockage</h3>
                      <select
                        value={currentAccount}
                        onChange={(e) => setCurrentAccount(e.target.value)}
                        className="text-xs bg-[#f8fafc] border-[#eaeaea] rounded-lg text-[#213f5b] focus:ring-[#bfddf9] focus:border-[#bfddf9] py-1"
                      >
                        {driveAccounts.map(account => (
                          <option key={account._id} value={account._id} disabled={account.status === "disconnected"}>
                            {account.name} ({account.email})
                            {account.status === "disconnected" ? " - Déconnecté" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-xs text-[#213f5b]">
                      {formatFileSize(driveAccounts.find(a => a._id === currentAccount)?.quota.used || 0)}
                      {" / "}
                      {formatFileSize(driveAccounts.find(a => a._id === currentAccount)?.quota.total || 0)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#bfddf9] to-[#3978b5] rounded-full"
                      style={{ 
                        width: `${(driveAccounts.find(a => a._id === currentAccount)?.quota.used || 0) / (driveAccounts.find(a => a._id === currentAccount)?.quota.total || 1) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Main Content - Drive */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Navigation */}
              <div className="w-48 xl:w-56 border-r border-[#eaeaea] flex flex-col bg-white">
                {/* Actions Buttons */}
                <div className="p-3">
                  <Button
                    onClick={() => setIsCreateFolderModalOpen(true)}
                    className="w-full bg-[#f0f7ff] hover:bg-[#e0f2fe] text-[#213f5b] transition-all rounded-lg py-2 flex items-center justify-center shadow-sm hover:shadow"
                  >
                    <FolderPlusIcon className="h-4 w-4 mr-2" />
                    Nouveau dossier
                  </Button>
                </div>
                
                {/* Folders Navigation */}
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="space-y-1">
                    {specialFolders.map((folder) => {
                      const FolderIconComponent = folder.icon;
                      const isActive = currentFolder === folder.id;
                      
                      return (
                        <button
                          key={folder.id}
                          className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive 
                              ? 'bg-[#f0f7ff] text-[#213f5b]' 
                              : 'text-[#213f5b] hover:bg-[#f8fafc]'
                          }`}
                          onClick={() => navigateToFolder(folder.id)}
                        >
                          <FolderIconComponent className="h-5 w-5 mr-3" style={{ color: folder.color }} />
                          <span>{folder.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#eaeaea]">
                    <h3 className="px-3 mb-2 text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Stockage</h3>
                    <div className="space-y-2">
                      {driveAccounts.filter(account => account.status === "connected").map(account => (
                        <div 
                          key={account._id}
                          className={`flex flex-col px-3 py-2 rounded-lg transition-colors text-[#213f5b] ${
                            currentAccount === account._id ? 'bg-[#f0f7ff]' : 'hover:bg-[#f8fafc]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full overflow-hidden bg-[#213f5b] flex items-center justify-center text-white text-xs font-bold">
                              {account.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium truncate flex-1">{account.name}</span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-xs">
                            <span className="opacity-75 truncate">{account.email.split('@')[0]}</span>
                            <span className="opacity-75">{formatFileSize(account.quota.used)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Panel - File Explorer */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Search and Filter Toolbar */}
                <div className="p-4 bg-white border-b border-[#eaeaea]">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px] relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher dans Drive..."
                        className="pl-10 pr-10 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] bg-[#f8fafc]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#213f5b] hover:text-[#152a3d]"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className="flex items-center gap-1 text-xs text-[#213f5b] border-[#eaeaea] hover:border-[#bfddf9] hover:bg-[#f8fafc] rounded-lg py-1.5 px-3 shadow-sm transition-all"
                      >
                        <FunnelIcon className="h-3 w-3" />
                        <span>Filtres</span>
                        {(fileTypeFilter || sharedFilter !== null) && (
                          <span className="flex items-center justify-center h-4 w-4 bg-[#d2fcb2] text-[#213f5b] text-xs font-medium rounded-full">
                            {(fileTypeFilter ? 1 : 0) + (sharedFilter !== null ? 1 : 0)}
                          </span>
                        )}
                      </Button>
                      
                      <div className="h-6 border-r border-[#eaeaea]"></div>
                      
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            viewMode === "grid" ? 'bg-[#f0f7ff] text-[#213f5b]' : 'text-[#213f5b] hover:bg-[#f8fafc]'
                          }`}
                          title="Vue en grille"
                        >
                          <Squares2X2Icon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            viewMode === "list" ? 'bg-[#f0f7ff] text-[#213f5b]' : 'text-[#213f5b] hover:bg-[#f8fafc]'
                          }`}
                          title="Vue en liste"
                        >
                          <TableCellsIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f8fafc]"
                          onClick={() => fetchDriveItems(currentFolder)}
                          title="Actualiser"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Breadcrumbs */}
                  <div className="flex items-center mt-3 text-sm">
                    {breadcrumbs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={navigateUp}
                        className="mr-1 h-6 w-6 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f8fafc]"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-1">
                      {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.id} className="flex items-center">
                          {index > 0 && (
                            <ChevronRightIcon className="h-3 w-3 mx-1 text-[#213f5b] opacity-50" />
                          )}
                          <button
                            onClick={() => navigateToFolder(crumb.id)}
                            className={`px-2 py-1 rounded hover:bg-[#f0f7ff] ${
                              index === breadcrumbs.length - 1 
                                ? 'font-medium text-[#213f5b]' 
                                : 'text-[#213f5b] opacity-75'
                            }`}
                          >
                            {crumb.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Expanded Filters */}
                  <AnimatePresence>
                    {isFiltersVisible && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="pt-3 border-t border-[#eaeaea]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#213f5b] mb-1">Type de fichier</label>
                              <select
                                value={fileTypeFilter || ""}
                                onChange={(e) => setFileTypeFilter(e.target.value || null)}
                                className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm bg-[#f8fafc]"
                              >
                                <option value="">Tous les types</option>
                                {Object.keys(fileTypeIcons).map(type => (
                                  <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-[#213f5b] mb-1">Partage</label>
                              <select
                                value={sharedFilter === null ? "" : sharedFilter ? "shared" : "not-shared"}
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    setSharedFilter(null);
                                  } else {
                                    setSharedFilter(e.target.value === "shared");
                                  }
                                }}
                                className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm bg-[#f8fafc]"
                              >
                                <option value="">Tous</option>
                                <option value="shared">Partagés</option>
                                <option value="not-shared">Non partagés</option>
                              </select>
                            </div>
                          </div>
                          
                          {(fileTypeFilter || sharedFilter !== null) && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setFileTypeFilter(null);
                                setSharedFilter(null);
                              }}
                              className="mt-2 text-[#213f5b] hover:text-[#152a3d] text-xs"
                            >
                              Effacer les filtres
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Selection Actions */}
                <AnimatePresence>
                  {selectedItems.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[#f0f7ff] border-b border-[#bfddf9] overflow-hidden"
                    >
                      <div className="px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#213f5b]">
                            {selectedItems.length} {selectedItems.length > 1 ? 'éléments sélectionnés' : 'élément sélectionné'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedItems([])}
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs"
                          >
                            Annuler
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleStarred}
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs flex items-center"
                          >
                            <StarIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Suivre</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsShareFileModalOpen(true)}
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs flex items-center"
                          >
                            <ShareIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Partager</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#213f5b] hover:bg-[#e0f2fe] py-1 px-2 rounded text-xs flex items-center"
                          >
                            <ArrowDownOnSquareIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Télécharger</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={deleteItems}
                            className="text-red-500 hover:bg-red-50 py-1 px-2 rounded text-xs flex items-center"
                          >
                            <TrashIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Sorting Options (List View) */}
                {viewMode === "list" && (
                  <div className="bg-[#f8fafc] border-b border-[#eaeaea] px-4 py-2">
                    <div className="flex items-center text-xs font-medium text-[#213f5b]">
                      <div className="w-12 px-2"></div> {/* Checkbox column */}
                      <button
                        className="flex-1 flex items-center px-2 py-1 hover:bg-[#f0f7ff] rounded"
                        onClick={() => handleSort("name")}
                      >
                        <span>Nom</span>
                        {sortBy === "name" && (
                          sortDirection === "asc" 
                            ? <ChevronUpIcon className="h-3 w-3 ml-1" /> 
                            : <ChevronDownIcon className="h-3 w-3 ml-1" />
                        )}
                      </button>
                      <button
                        className="w-40 flex items-center px-2 py-1 hover:bg-[#f0f7ff] rounded"
                        onClick={() => handleSort("modified")}
                      >
                        <span>Dernière modification</span>
                        {sortBy === "modified" && (
                          sortDirection === "asc" 
                            ? <ChevronUpIcon className="h-3 w-3 ml-1" /> 
                            : <ChevronDownIcon className="h-3 w-3 ml-1" />
                        )}
                      </button>
                      <button
                        className="w-28 flex items-center px-2 py-1 hover:bg-[#f0f7ff] rounded"
                        onClick={() => handleSort("size")}
                      >
                        <span>Taille</span>
                        {sortBy === "size" && (
                          sortDirection === "asc" 
                            ? <ChevronUpIcon className="h-3 w-3 ml-1" /> 
                            : <ChevronDownIcon className="h-3 w-3 ml-1" />
                        )}
                      </button>
                      <div className="w-10"></div> {/* Actions column */}
                    </div>
                  </div>
                )}
                
                {/* File/Folder List */}
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                  {loading ? (
                    <div className="flex flex-col justify-center items-center p-12">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full blur opacity-30 animate-pulse"></div>
                        <div className="relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#213f5b]"></div>
                      </div>
                      <p className="mt-4 text-[#213f5b] animate-pulse">Chargement des fichiers...</p>
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                      <p className="text-red-700 mb-4">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-red-600 border-red-300 hover:bg-red-100 rounded-lg"
                        onClick={() => fetchDriveItems(currentFolder)}
                      >
                        Réessayer
                      </Button>
                    </div>
                  ) : filteredAndSortedItems.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="relative mx-auto mb-6 w-20 h-20">
                        <div className="absolute inset-0 bg-[#bfddf9] opacity-20 rounded-full animate-pulse"></div>
                        <FolderIcon className="h-20 w-20 text-[#bfddf9] opacity-60" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#213f5b] mb-2">Dossier vide</h3>
                      <p className="text-[#213f5b] opacity-75 mb-4">
                        {searchTerm || fileTypeFilter || sharedFilter !== null
                          ? "Aucun élément ne correspond à vos critères de recherche."
                          : "Ce dossier ne contient aucun élément."}
                      </p>
                      {(searchTerm || fileTypeFilter || sharedFilter !== null) && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm("");
                            setFileTypeFilter(null);
                            setSharedFilter(null);
                          }}
                          className="border-[#bfddf9] bg-white text-[#213f5b] hover:bg-[#bfddf9] transition-all rounded-lg py-2 px-4"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      )}
                    </div>
                  ) : (
                    // Grid or List view based on viewMode
                    viewMode === "grid" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {filteredAndSortedItems.map(item => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`relative group rounded-xl border transition-all cursor-pointer ${
                              selectedItems.includes(item._id)
                                ? 'border-[#3978b5] bg-[#f0f7ff] shadow-md'
                                : 'border-[#eaeaea] hover:border-[#bfddf9] hover:shadow-sm bg-white'
                            }`}
                            onClick={() => {
                              if (item.type === "folder") {
                                navigateToFolder(item._id, item.name);
                              } else {
                                viewFileDetails(item._id);
                              }
                            }}
                          >
                            {/* Selection Checkbox */}
                            <div
                              className={`absolute top-2 left-2 z-10 rounded-full p-1 ${
                                selectedItems.includes(item._id)
                                  ? 'bg-[#3978b5] text-white'
                                  : 'bg-white text-[#213f5b] opacity-0 group-hover:opacity-100 border border-[#eaeaea] shadow-sm'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectItem(item._id);
                              }}
                            >
                              <CheckIcon className="h-3 w-3" />
                            </div>
                            
                            {/* Star Indicator */}
                            {item.starred && (
                              <div className="absolute top-2 right-2 z-10 text-[#f59e0b]">
                                <StarIcon className="h-4 w-4 fill-[#f59e0b]" />
                              </div>
                            )}
                            
                            {/* Share Indicator */}
                            {item.shared && (
                              <div className="absolute bottom-2 right-2 z-10 text-[#3978b5]">
                                <ShareIcon className="h-4 w-4" />
                              </div>
                            )}
                            
                            {/* File/Folder Preview */}
                            <div className="h-32 flex items-center justify-center p-4">
                              {item.type === "image" && item.thumbnail ? (
                                <img 
                                  src={item.thumbnail} 
                                  alt={item.name} 
                                  className="max-h-full max-w-full object-contain rounded"
                                />
                              ) : (
                                <div className="h-16 w-16 flex items-center justify-center">
                                  {renderItemIcon(item.type)}
                                </div>
                              )}
                            </div>
                            
                            {/* File/Folder Info */}
                            <div className="p-3 border-t border-[#eaeaea] bg-[#f8fafc] rounded-b-xl">
                              <p className="text-sm font-medium text-[#213f5b] truncate mb-1" title={item.name}>
                                {item.name}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-[#213f5b] opacity-60">
                                  {item.type !== "folder" ? formatFileSize(item.size) : ''}
                                </span>
                                <span className="text-xs text-[#213f5b] opacity-60">
                                  {formatDate(item.modifiedAt).split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      // List View
                      <div className="overflow-hidden rounded-xl border border-[#eaeaea]">
                        {filteredAndSortedItems.map(item => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-center border-b border-[#eaeaea] last:border-b-0 group transition-colors ${
                              selectedItems.includes(item._id)
                                ? 'bg-[#f0f7ff]'
                                : 'bg-white hover:bg-[#f8fafc]'
                            }`}
                          >
                            <div className="w-12 px-2 py-3 flex justify-center">
                              <div
                                className={`rounded-full p-1 ${
                                  selectedItems.includes(item._id)
                                    ? 'bg-[#3978b5] text-white'
                                    : 'bg-white text-[#213f5b] opacity-0 group-hover:opacity-100 border border-[#eaeaea] shadow-sm'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelectItem(item._id);
                                }}
                              >
                                <CheckIcon className="h-3 w-3" />
                              </div>
                            </div>
                            
                            <div 
                              className="flex-1 flex items-center py-3 px-2 cursor-pointer"
                              onClick={() => {
                                if (item.type === "folder") {
                                  navigateToFolder(item._id, item.name);
                                } else {
                                  viewFileDetails(item._id);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {renderItemIcon(item.type)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center">
                                    <p className="text-sm font-medium text-[#213f5b] truncate mr-2">
                                      {item.name}
                                    </p>
                                    {item.starred && (
                                      <StarIcon className="h-3.5 w-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                                    )}
                                    {item.shared && (
                                      <ShareIcon className="h-3.5 w-3.5 text-[#3978b5] ml-1" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="w-40 px-2 py-3 text-xs text-[#213f5b] opacity-75">
                              {formatDate(item.modifiedAt)}
                            </div>
                            
                            <div className="w-28 px-2 py-3 text-xs text-[#213f5b] opacity-75">
                              {item.type !== "folder" ? formatFileSize(item.size) : '-'}
                            </div>
                            
                            <div className="w-10 px-2 py-3 flex justify-center">
                              <Button
                                variant="ghost"
                                className="h-6 w-6 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f7ff] opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewFileDetails(item._id);
                                }}
                              >
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {isCreateFolderModalOpen && (
          <CreateFolderModal
            isOpen={isCreateFolderModalOpen}
            onClose={() => setIsCreateFolderModalOpen(false)}
            onCreateFolder={handleCreateFolder}
          />
        )}
        
        {isShareFileModalOpen && (
          <ShareFileModal
            isOpen={isShareFileModalOpen}
            onClose={() => setIsShareFileModalOpen(false)}
            onShare={handleShare}
            selectedItems={selectedItems}
            items={items}
          />
        )}
        
        {isUploadFileModalOpen && (
          <UploadFileModal
            isOpen={isUploadFileModalOpen}
            onClose={() => setIsUploadFileModalOpen(false)}
            onUpload={handleUpload}
            currentFolder={currentFolder}
            folderName={breadcrumbs[breadcrumbs.length - 1]?.name || ""}
          />
        )}
        
        {isConnectDriveModalOpen && (
          <ConnectDriveModal
            isOpen={isConnectDriveModalOpen}
            onClose={() => setIsConnectDriveModalOpen(false)}
            onConnectDrive={handleConnectDrive}
          />
        )}
        
        {fileDetailsModal.isOpen && fileDetailsModal.fileId && (
          <FileDetailsModal
            isOpen={fileDetailsModal.isOpen}
            fileId={fileDetailsModal.fileId}
            onClose={() => setFileDetailsModal({ isOpen: false, fileId: null })}
            onShare={(itemId, shareWith) => handleShare(itemId, shareWith)}
            items={items}
          />
        )}
      </AnimatePresence>
    </div>
  );
}