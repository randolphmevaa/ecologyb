// 2. ShareFileModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  ShareIcon,
  // UserPlusIcon,
  ExclamationCircleIcon,
  CheckIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { IDriveItem } from "./page";

interface ShareFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (itemId: string, shareWith: { email: string; role: string }[]) => void;
  selectedItems: string[];
  items: IDriveItem[];
}

export const ShareFileModal: React.FC<ShareFileModalProps> = ({
  isOpen,
  onClose,
  onShare,
  selectedItems,
  items,
}) => {
  const [shareEmails, setShareEmails] = useState<{ email: string; role: string }[]>([
    { email: "", role: "viewer" }
  ]);
  const [error, setError] = useState<string | null>(null);
  
  // Get the first selected item for display purposes
  const selectedItem = selectedItems.length > 0
    ? items.find(item => item._id === selectedItems[0])
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate emails
    const validEmails = shareEmails.filter(share => share.email.trim() !== "");
    
    if (validEmails.length === 0) {
      setError("Veuillez saisir au moins une adresse email");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const share of validEmails) {
      if (!emailRegex.test(share.email)) {
        setError(`L'adresse email "${share.email}" n'est pas valide`);
        return;
      }
    }
    
    if (selectedItems.length === 0) {
      setError("Aucun élément n'est sélectionné");
      return;
    }
    
    onShare(selectedItems[0], validEmails);
    setShareEmails([{ email: "", role: "viewer" }]);
    setError(null);
  };

  const addEmailField = () => {
    setShareEmails([...shareEmails, { email: "", role: "viewer" }]);
  };

  const removeEmailField = (index: number) => {
    if (shareEmails.length > 1) {
      const newEmails = [...shareEmails];
      newEmails.splice(index, 1);
      setShareEmails(newEmails);
    }
  };

  const updateEmail = (index: number, email: string) => {
    const newEmails = [...shareEmails];
    newEmails[index].email = email;
    setShareEmails(newEmails);
  };

  const updateRole = (index: number, role: string) => {
    const newEmails = [...shareEmails];
    newEmails[index].role = role;
    setShareEmails(newEmails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0] transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#f0f7ff] flex items-center justify-center">
            <ShareIcon className="h-6 w-6 text-[#213f5b]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#213f5b]">Partager</h2>
            <p className="text-sm text-[#213f5b] opacity-75">
              {selectedItems.length > 1 
                ? `Partager ${selectedItems.length} éléments` 
                : selectedItem 
                  ? `Partager "${selectedItem.name}"` 
                  : "Partager l'élément"}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#213f5b] mb-1">
              Partager avec
            </label>
            
            {shareEmails.map((share, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={share.email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="email@example.com"
                    className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                  />
                </div>
                <select
                  value={share.role}
                  onChange={(e) => updateRole(index, e.target.value)}
                  className="rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm"
                >
                  <option value="viewer">Lecteur</option>
                  <option value="commenter">Commentateur</option>
                  <option value="editor">Éditeur</option>
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeEmailField(index)}
                  className="p-2 text-[#213f5b] hover:bg-[#f0f0f0] rounded-full"
                  title="Supprimer"
                  disabled={shareEmails.length === 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="ghost"
              onClick={addEmailField}
              className="mt-2 text-[#213f5b] hover:bg-[#f0f0f0] transition-colors rounded-lg py-1.5 px-3 text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Ajouter une personne</span>
            </Button>
          </div>
          
          <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#eaeaea] mb-6">
            <div className="flex items-center gap-3">
              <LinkIcon className="h-5 w-5 text-[#213f5b]" />
              <div>
                <h3 className="text-sm font-medium text-[#213f5b]">Obtenir un lien de partage</h3>
                <p className="text-xs text-[#213f5b] opacity-75">
                  Les personnes disposant du lien pourront voir le fichier
                </p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#bfddf9] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3978b5]"></div>
                </label>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc] transition-colors rounded-lg py-2.5 px-5"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 px-5 flex items-center shadow-md hover:shadow-lg"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              <span>Partager</span>
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
