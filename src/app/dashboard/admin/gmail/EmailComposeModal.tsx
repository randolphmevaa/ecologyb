"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  UserPlusIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  FaceSmileIcon,
  ArrowPathIcon,
  MinusCircleIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

// Type definitions
export interface EmailRecipient {
  name: string;
  email: string;
  avatar?: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'spreadsheet' | 'presentation' | 'other';
  size: number;
  url: string;
  thumbnail?: string;
}

export interface Email {
  _id?: string;
  subject: string;
  sender?: EmailRecipient;
  recipients: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  body: string;
  snippet?: string;
  timestamp?: string;
  isRead?: boolean;
  isStarred?: boolean;
  isImportant?: boolean;
  labels?: string[];
  folder?: string;
  attachments?: EmailAttachment[];
  threadId?: string;
  accountId?: string;
}

interface EmailAccount {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  signature?: string;
}

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
}

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSent: (email: Email) => void;
  editingEmail: Email | null;
  accounts: EmailAccount[];
  selectedAccount: string | null;
  templates: EmailTemplate[];
}


export const EmailComposeModal: React.FC<EmailComposeModalProps> = ({
  isOpen,
  onClose,
  onEmailSent,
  editingEmail,
  accounts,
  selectedAccount: initialSelectedAccount,
  templates,
}) => {
  const [to, setTo] = useState<string>("");
  const [cc, setCc] = useState<string>("");
  const [bcc, setBcc] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(initialSelectedAccount);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCc, setShowCc] = useState<boolean>(false);
  const [showBcc, setShowBcc] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);

  // Initialize form with editing email if provided
  useEffect(() => {
    if (editingEmail) {
      const recipientsStr = editingEmail.recipients.map((r: EmailRecipient) => r.email).join(", ");
      setTo(recipientsStr);
      
      if (editingEmail.cc && editingEmail.cc.length > 0) {
        setCc(editingEmail.cc.map((r: EmailRecipient) => r.email).join(", "));
        setShowCc(true);
      }
      
      if (editingEmail.bcc && editingEmail.bcc.length > 0) {
        setBcc(editingEmail.bcc.map((r: EmailRecipient) => r.email).join(", "));
        setShowBcc(true);
      }
      
      setSubject(editingEmail.subject || "");
      
      // Extract plain text from HTML body
      if (editingEmail.body) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = editingEmail.body;
        setBody(tempDiv.textContent || tempDiv.innerText || "");
      }
      
      if (editingEmail.accountId) {
        setSelectedAccount(editingEmail.accountId);
      }
      
      if (editingEmail.attachments) {
        setAttachments(editingEmail.attachments);
      }
    }
  }, [editingEmail]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!to.trim()) {
      setError("Veuillez spécifier au moins un destinataire");
      return;
    }
    
    if (!selectedAccount) {
      setError("Veuillez sélectionner un compte expéditeur");
      return;
    }
    
    setError(null);
    setIsSending(true);
    
    // In a real implementation, this would be an API call to send the email
    // Here we just simulate sending with a timeout
    setTimeout(() => {
      const account = accounts.find(a => a._id === selectedAccount);
      
      // Parse recipients
      const parseRecipients = (recipientString: string): EmailRecipient[] => {
        if (!recipientString.trim()) return [];
        
        return recipientString.split(",").map(email => {
          const trimmedEmail = email.trim();
          return {
            name: trimmedEmail.split("@")[0],
            email: trimmedEmail,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedEmail.split("@")[0])}&background=4f46e5&color=fff`
          };
        });
      };
      
      const recipients = parseRecipients(to);
      const ccRecipients = parseRecipients(cc);
      const bccRecipients = parseRecipients(bcc);
      
      // Create new email object
      const newEmail: Email = {
        _id: `email_${Date.now()}`,
        subject: subject || "(Sans objet)",
        sender: {
          name: account?.name || "Vous",
          email: account?.email || "",
          avatar: account?.avatar
        },
        recipients,
        cc: ccRecipients.length > 0 ? ccRecipients : undefined,
        bcc: bccRecipients.length > 0 ? bccRecipients : undefined,
        body: `<p>${body.replace(/\n/g, '</p><p>')}</p>${account?.signature || ""}`,
        snippet: body.substring(0, 100) + "...",
        timestamp: new Date().toISOString(),
        isRead: true,
        isStarred: false,
        isImportant: false,
        labels: [],
        folder: "sent",
        attachments: attachments.length > 0 ? attachments : undefined,
        threadId: editingEmail?.threadId || `thread_new_${Date.now()}`,
        accountId: selectedAccount
      };
      
      // Call onEmailSent callback
      onEmailSent(newEmail);
      
      // Reset states
      setTo("");
      setCc("");
      setBcc("");
      setSubject("");
      setBody("");
      setAttachments([]);
      setIsSending(false);
      
      // Close modal
      onClose();
    }, 1500);
  };

  // Handle adding attachments
  const handleAddAttachment = () => {
    // In a real app, this would open a file picker
    // Here we just simulate adding a random attachment
    type FileType = 'pdf' | 'image' | 'document' | 'spreadsheet' | 'presentation' | 'other';
    const types: FileType[] = ["pdf", "image", "document", "spreadsheet", "presentation", "other"];
    const randomType: FileType = types[Math.floor(Math.random() * types.length)];
    
    const fileNames: Record<FileType, string[]> = {
      "pdf": ["rapport.pdf", "facture.pdf", "contrat.pdf", "documentation.pdf"],
      "image": ["photo.jpg", "capture.png", "image.jpg", "logo.png"],
      "document": ["document.docx", "compte-rendu.doc", "proposition.docx"],
      "spreadsheet": ["données.xlsx", "statistiques.xlsx", "budget.xls"],
      "presentation": ["présentation.pptx", "slides.ppt", "conférence.pptx"],
      "other": ["fichier.zip", "archive.rar", "data.json", "config.xml"]
    };
    
    const randomFileName = fileNames[randomType][Math.floor(Math.random() * fileNames[randomType].length)];
    
    const newAttachment: EmailAttachment = {
      id: `attachment_${Date.now()}`,
      name: randomFileName,
      type: randomType,
      size: Math.floor(Math.random() * 5000000) + 100000, // Between 100KB and 5MB
      url: "#",
      thumbnail: randomType === "image" ? `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300` : undefined
    };
    
    setAttachments([...attachments, newAttachment]);
  };

  // Handle removing an attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  // Handle applying a template
  const handleApplyTemplate = (template: EmailTemplate) => {
    setSubject(template.subject.replace(/{{([^}]+)}}/g, '___'));
    
    // Extract plain text from HTML template body
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template.body;
    let plainText = tempDiv.textContent || tempDiv.innerText || "";
    plainText = plainText.replace(/{{([^}]+)}}/g, '___');
    
    setBody(plainText);
    setShowTemplates(false);
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-[#f8fafc] px-6 py-4 border-b border-[#eaeaea] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#213f5b]">
            {editingEmail ? "Modifier l'email" : "Nouveau message"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0] transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="divide-y divide-[#eaeaea]">
          {/* Account Selector */}
          <div className="px-6 py-3 bg-white">
            <label htmlFor="account" className="block text-sm font-medium text-[#213f5b] mb-1">
              De
            </label>
            <select
              id="account"
              value={selectedAccount || ""}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] bg-[#f8fafc]"
              required
            >
              <option value="" disabled>Sélectionnez un compte</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.name} ({account.email})
                </option>
              ))}
            </select>
          </div>
          
          {/* Recipients */}
          <div className="px-6 py-3 bg-white">
            <div className="mb-3">
              <label htmlFor="to" className="block text-sm font-medium text-[#213f5b] mb-1">
                À
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="email@example.com, autre@example.com"
                  className="flex-1 px-4 py-2 rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="ml-2 p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0]"
                  title="Ajouter depuis les contacts"
                >
                  <UserPlusIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* CC & BCC Toggles */}
            {!showCc && !showBcc && (
              <div className="flex items-center gap-3 mb-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCc(true)}
                  className="text-xs text-[#213f5b] hover:bg-[#f0f0f0] py-1 px-2 rounded"
                >
                  Ajouter Cc
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowBcc(true)}
                  className="text-xs text-[#213f5b] hover:bg-[#f0f0f0] py-1 px-2 rounded"
                >
                  Ajouter Cci
                </Button>
              </div>
            )}
            
            {/* CC Field */}
            {showCc && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="cc" className="block text-sm font-medium text-[#213f5b]">
                    Cc
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setCc("");
                      setShowCc(false);
                    }}
                    className="text-xs text-[#213f5b] hover:bg-[#f0f0f0] py-1 px-2 rounded"
                  >
                    <MinusCircleIcon className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  type="text"
                  id="cc"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="email@example.com, autre@example.com"
                  className="w-full px-4 py-2 rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                />
              </div>
            )}
            
            {/* BCC Field */}
            {showBcc && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="bcc" className="block text-sm font-medium text-[#213f5b]">
                    Cci
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setBcc("");
                      setShowBcc(false);
                    }}
                    className="text-xs text-[#213f5b] hover:bg-[#f0f0f0] py-1 px-2 rounded"
                  >
                    <MinusCircleIcon className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  type="text"
                  id="bcc"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="email@example.com, autre@example.com"
                  className="w-full px-4 py-2 rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                />
              </div>
            )}
            
            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#213f5b] mb-1">
                Objet
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de l'email"
                className="w-full px-4 py-2 rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
              />
            </div>
          </div>
          
          {/* Templates */}
          <div className="px-6 py-3 bg-white">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-[#213f5b]">
                Templates
              </h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-xs text-[#213f5b] hover:bg-[#f0f0f0] py-1 px-2 rounded flex items-center"
              >
                {showTemplates ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4 mr-1" />
                    <span>Masquer</span>
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                    <span>Afficher</span>
                  </>
                )}
              </Button>
            </div>
            
            {showTemplates && (
              <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#eaeaea] mb-2 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {templates.length === 0 ? (
                    <p className="text-sm text-[#213f5b] opacity-75 col-span-2">
                      Aucun template disponible
                    </p>
                  ) : (
                    templates.map((template) => (
                      <motion.div
                        key={template._id}
                        className="p-2 rounded-lg border border-[#eaeaea] bg-white hover:border-[#bfddf9] cursor-pointer transition-colors"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleApplyTemplate(template)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="rounded-md p-1.5 bg-[#f0f7ff]">
                            <DocumentDuplicateIcon className="h-3.5 w-3.5 text-[#213f5b]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-[#213f5b] truncate">{template.name}</h4>
                            <p className="text-xs text-[#213f5b] opacity-75 truncate">
                              {template.subject}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Message Body */}
          <div className="px-6 py-3 bg-white flex-1">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Rédigez votre message ici..."
              className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] h-48 resize-none p-3"
            />
          </div>
          
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="px-6 py-3 bg-white">
              <h3 className="text-sm font-medium text-[#213f5b] mb-2">
                Pièces jointes ({attachments.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center p-2 bg-[#f8fafc] rounded-lg border border-[#eaeaea]"
                  >
                    <div className="flex-1 flex items-center">
                      <div className="mr-2">
                        {attachment.type === "image" ? (
                          <div className="h-10 w-10 rounded overflow-hidden bg-[#f0f0f0]">
                            {attachment.thumbnail && (
                              <img
                                src={attachment.thumbnail}
                                alt={attachment.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded bg-[#f0f7ff] flex items-center justify-center">
                            <PaperClipIcon className="h-5 w-5 text-[#213f5b]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#213f5b] truncate">{attachment.name}</p>
                        <p className="text-xs text-[#213f5b] opacity-60">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="ml-2 p-1 text-[#213f5b] hover:text-red-500 hover:bg-[#f0f0f0] rounded-full"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="px-6 py-3 bg-red-50">
              <div className="flex items-center gap-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          {/* Action Bar */}
          <div className="px-6 py-3 bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isSending}
                className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 px-4 flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    <span>Envoyer</span>
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f0f0f0] transition-colors rounded-lg py-2.5 px-4"
              >
                Annuler
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddAttachment}
                className="p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0]"
                title="Ajouter une pièce jointe"
              >
                <PaperClipIcon className="h-5 w-5" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0]"
                title="Insérer un emoji"
              >
                <FaceSmileIcon className="h-5 w-5" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0]"
                title="Utiliser un template"
              >
                <SquaresPlusIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
