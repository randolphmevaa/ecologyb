// 5. FileDetailsModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  DocumentIcon,
  ShareIcon,
  ExclamationCircleIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownOnSquareIcon,
  StarIcon,
  EyeIcon,
  UserPlusIcon,
  ClockIcon,
  InformationCircleIcon,
  LinkIcon,
  LockClosedIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  FilmIcon,
  MusicalNoteIcon,
  PhotoIcon,
  Squares2X2Icon,
  TableCellsIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { IDriveItem } from "./page";

interface FileDetailsModalProps {
  isOpen: boolean;
  fileId: string;
  onClose: () => void;
  onShare: (itemId: string, shareWith: { email: string; role: string }[]) => void;
  items: IDriveItem[];
}

export const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  isOpen,
  fileId,
  onClose,
  // onShare,
  items,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "sharing">("details");
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // Get file details
  const file = items.find(item => item._id === fileId);
  
  if (!isOpen || !file) return null;
  
  // File type icon and colors
  const getFileIcon = () => {
    switch (file.type) {
      case "folder":
        return <FolderIcon className="h-8 w-8 text-[#213f5b]" />;
      case "document":
        return <DocumentIcon className="h-8 w-8 text-[#3b82f6]" />;
      case "spreadsheet":
        return <TableCellsIcon className="h-8 w-8 text-[#10b981]" />;
      case "presentation":
        return <Squares2X2Icon className="h-8 w-8 text-[#f59e0b]" />;
      case "pdf":
        return <DocumentDuplicateIcon className="h-8 w-8 text-[#ef4444]" />;
      case "image":
        return <PhotoIcon className="h-8 w-8 text-[#8b5cf6]" />;
      case "video":
        return <FilmIcon className="h-8 w-8 text-[#ec4899]" />;
      case "audio":
        return <MusicalNoteIcon className="h-8 w-8 text-[#0ea5e9]" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-[#6b7280]" />;
    }
  };
  
  // Format date
  const formatDetailedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Handle renaming
  const handleRename = () => {
    if (!newName.trim()) {
      setError("Le nom du fichier ne peut pas être vide");
      return;
    }
    
    // In a real implementation, would make API call to Google Drive
    setIsRenaming(false);
    setError(null);
  };
  
  // Start rename process
  const startRename = () => {
    setNewName(file.name);
    setIsRenaming(true);
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eaeaea] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              {isRenaming ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-2 py-1 rounded border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-[#213f5b] font-medium"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleRename}
                    className="text-[#213f5b] hover:bg-[#f0f0f0] p-1 rounded"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsRenaming(false)}
                    className="text-[#213f5b] hover:bg-[#f0f0f0] p-1 rounded"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#213f5b]">{file.name}</h2>
                  <Button
                    type="button"
                    size="sm"
                    onClick={startRename}
                    className="text-[#213f5b] hover:bg-[#f0f0f0] p-1 rounded"
                    title="Renommer"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <p className="text-sm text-[#213f5b] opacity-75">
                {file.type.charAt(0).toUpperCase() + file.type.slice(1)} • {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0] transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-[#eaeaea]">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "details" 
                ? 'text-[#3978b5]' 
                : 'text-[#213f5b] opacity-75 hover:opacity-100'
            }`}
            onClick={() => setActiveTab("details")}
          >
            Détails
            {activeTab === "details" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3978b5]"
              />
            )}
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "sharing" 
                ? 'text-[#3978b5]' 
                : 'text-[#213f5b] opacity-75 hover:opacity-100'
            }`}
            onClick={() => setActiveTab("sharing")}
          >
            Partage
            {activeTab === "sharing" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3978b5]"
              />
            )}
          </button>
        </div>
        
        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Preview */}
              {file.type === "image" && file.thumbnail && (
                <div className="rounded-lg overflow-hidden border border-[#eaeaea] bg-[#f8fafc] flex items-center justify-center h-52">
                  <img 
                    src={file.thumbnail} 
                    alt={file.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              
              {/* File Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-[#213f5b] opacity-75" />
                  <span className="font-medium text-[#213f5b]">Créé le:</span>
                  <span className="text-[#213f5b] opacity-90">{formatDetailedDate(file.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-[#213f5b] opacity-75" />
                  <span className="font-medium text-[#213f5b]">Modifié le:</span>
                  <span className="text-[#213f5b] opacity-90">{formatDetailedDate(file.modifiedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserCircleIcon className="h-4 w-4 text-[#213f5b] opacity-75" />
                  <span className="font-medium text-[#213f5b]">Propriétaire:</span>
                  <span className="text-[#213f5b] opacity-90">{file.owner.name} ({file.owner.email})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <InformationCircleIcon className="h-4 w-4 text-[#213f5b] opacity-75" />
                  <span className="font-medium text-[#213f5b]">Taille:</span>
                  <span className="text-[#213f5b] opacity-90">{formatFileSize(file.size)}</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Button
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#eaeaea] hover:bg-[#f8fafc] hover:border-[#bfddf9] bg-white text-[#213f5b] transition-colors"
                >
                  <EyeIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Aperçu</span>
                </Button>
                <Button
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#eaeaea] hover:bg-[#f8fafc] hover:border-[#bfddf9] bg-white text-[#213f5b] transition-colors"
                >
                  <ArrowDownOnSquareIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Télécharger</span>
                </Button>
                <Button
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#eaeaea] hover:bg-[#f8fafc] hover:border-[#bfddf9] bg-white text-[#213f5b] transition-colors"
                  onClick={() => setActiveTab("sharing")}
                >
                  <ShareIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Partager</span>
                </Button>
                <Button
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#eaeaea] hover:bg-[#f8fafc] hover:border-[#bfddf9] bg-white text-[#213f5b] transition-colors"
                >
                  <StarIcon className={`h-5 w-5 mb-1 ${file.starred ? 'text-[#f59e0b] fill-[#f59e0b]' : ''}`} />
                  <span className="text-xs">{file.starred ? 'Ne plus suivre' : 'Suivre'}</span>
                </Button>
                <Button
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#eaeaea] hover:bg-[#f8fafc] hover:border-[#bfddf9] bg-white text-[#213f5b] transition-colors"
                >
                  <PencilIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Modifier</span>
                </Button>
                <Button
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#eaeaea] hover:bg-red-50 hover:border-red-200 hover:text-red-500 bg-white text-[#213f5b] transition-colors"
                >
                  <TrashIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Supprimer</span>
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "sharing" && (
            <div className="space-y-6">
              {/* Current Sharing Status */}
              <div className="p-4 bg-[#f8fafc] rounded-lg border border-[#eaeaea]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-[#213f5b]" />
                    <h3 className="text-sm font-medium text-[#213f5b]">Lien de partage</h3>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" checked={file.shared} readOnly />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#bfddf9] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3978b5]"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center bg-white rounded-lg border border-[#eaeaea] p-2">
                  <input
                    type="text"
                    value={file.webViewLink || "https://drive.google.com/file/d/example/view"}
                    className="text-sm text-[#213f5b] bg-transparent border-none outline-none flex-1 px-2"
                    readOnly
                  />
                  <Button
                    className="text-[#213f5b] hover:bg-[#f0f0f0] p-2 rounded"
                    title="Copier le lien"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#213f5b] opacity-90">
                    <LockClosedIcon className="h-3 w-3" />
                    <span>Accessible uniquement aux personnes ayant le lien</span>
                  </div>
                </div>
              </div>
              
              {/* People with Access */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-[#213f5b]">Personnes ayant accès</h3>
                  <Button
                    className="text-xs text-[#213f5b] hover:bg-[#f0f0f0] py-1 px-2 rounded flex items-center gap-1"
                  >
                    <UserPlusIcon className="h-3.5 w-3.5" />
                    <span>Ajouter</span>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {/* Owner */}
                  <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#eaeaea]">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#213f5b] flex items-center justify-center text-white font-bold">
                        {file.owner.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#213f5b]">{file.owner.name} (vous)</p>
                        <p className="text-xs text-[#213f5b] opacity-75">{file.owner.email}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium bg-[#213f5b] text-white px-2 py-1 rounded-full">
                        Propriétaire
                      </span>
                    </div>
                  </div>
                  
                  {/* Shared With */}
                  {file.sharedWith && file.sharedWith.map((share, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#eaeaea]">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#3978b5] flex items-center justify-center text-white font-bold">
                          {share.name ? share.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#213f5b]">{share.name || share.email}</p>
                          <p className="text-xs text-[#213f5b] opacity-75">{share.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="text-xs bg-[#f8fafc] border-[#eaeaea] rounded-lg text-[#213f5b] focus:ring-[#bfddf9] focus:border-[#bfddf9] py-1 px-2"
                          value={share.role}
                        >
                          <option value="viewer">Lecteur</option>
                          <option value="commenter">Commentateur</option>
                          <option value="editor">Éditeur</option>
                        </select>
                        <Button
                          className="text-[#213f5b] hover:text-red-500 hover:bg-[#f0f0f0] p-1 rounded"
                          title="Supprimer"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eaeaea] bg-[#f8fafc] flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg py-2.5 px-5"
          >
            Fermer
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
