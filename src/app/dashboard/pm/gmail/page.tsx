"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  EnvelopeIcon,
  InboxIcon,
  TrashIcon,
  StarIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ArchiveBoxIcon,
  TagIcon,
  PencilIcon,
  UserPlusIcon,
  // BellIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon,
  // ChevronDownIcon,
  PlusIcon,
  // ChevronRightIcon,
  // QuestionMarkCircleIcon,
  // CheckCircleIcon,
  ExclamationCircleIcon,
  PaperClipIcon,
  XMarkIcon,
  // ArrowUpOnSquareIcon,
  ArrowDownOnSquareIcon,
  // BookmarkIcon,
  // CalendarIcon,
  // ChevronLeftIcon,
  DocumentTextIcon,
  // EyeIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  // ArrowRightIcon,
  FunnelIcon,
  // AdjustmentsHorizontalIcon,
  // Cog6ToothIcon,
  // CheckIcon,
  // BackwardIcon,
  // ForwardIcon,
  SquaresPlusIcon,
  DocumentDuplicateIcon,
//   PhotographIcon,
  PlayCircleIcon,
  // LinkIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";

// Import modals for Gmail account management
import { AddGmailAccountModal } from "./AddGmailAccountModal";
import { CreateEmailTemplateModal } from "./CreateEmailTemplateModal";
// import { Email as EmailComposeType } from './EmailComposeModal';

// Email type definitions
export interface IEmail {
  _id: string;
  subject: string;
  sender: ISender;
  recipients: IRecipient[];
  cc?: IRecipient[];
  bcc?: IRecipient[];
  body: string;
  snippet: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labels: string[];
  folder: "inbox" | "sent" | "drafts" | "trash" | "spam" | "archived";
  attachments?: IAttachment[];
  threadId: string;
  accountId: string;
}

export interface ISender {
  name: string;
  email: string;
  avatar?: string;
}

export interface IRecipient {
  name: string;
  email: string;
  avatar?: string;
}

export interface IAttachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "document" | "spreadsheet" | "presentation" | "other";
  size: number;
  url?: string;
  thumbnail?: string;
}

// Gmail account type
export interface IGmailAccount {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  status: "connected" | "disconnected" | "connecting";
  unreadCount: number;
  lastChecked: string;
  signature?: string;
  isDefault: boolean;
  quota: {
    used: number;
    total: number;
  }
}

// Email template type
export interface IEmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: "sales" | "marketing" | "support" | "general";
  isSystem: boolean;
  lastUsed?: string;
}

// Email label/folder colors
const labelColors = {
  "inbox": { bg: "#f0f7ff", text: "#213f5b", icon: InboxIcon },
  "sent": { bg: "#f0fff5", text: "#0f766e", icon: PaperAirplaneIcon },
  "drafts": { bg: "#f9fafb", text: "#6b7280", icon: PencilIcon },
  "starred": { bg: "#fffbeb", text: "#b45309", icon: StarIcon },
  "important": { bg: "#fef2f2", text: "#b91c1c", icon: ExclamationCircleIcon },
  "spam": { bg: "#fff5f5", text: "#e53e3e", icon: ExclamationCircleIcon },
  "trash": { bg: "#f3f4f6", text: "#4b5563", icon: TrashIcon },
  "archived": { bg: "#f5f3ff", text: "#6d28d9", icon: ArchiveBoxIcon },
  "social": { bg: "#eef2ff", text: "#4338ca", icon: ChatBubbleLeftRightIcon },
  "updates": { bg: "#ecfeff", text: "#0e7490", icon: ArrowPathIcon },
  "promotions": { bg: "#f0f9ff", text: "#0369a1", icon: TagIcon },
  "forums": { bg: "#fff7ed", text: "#c2410c", icon: UserCircleIcon },
  "work": { bg: "#f8fafc", text: "#0f172a", icon: DocumentTextIcon },
  "personal": { bg: "#fffbeb", text: "#b45309", icon: UserCircleIcon },
  "scheduled": { bg: "#f5f3ff", text: "#7e22ce", icon: ClockIcon },
};

// Template category colors
const templateCategories = {
  "sales": { color: "#bfddf9", gradient: "from-blue-500 to-blue-600" },
  "marketing": { color: "#d2fcb2", gradient: "from-green-500 to-green-600" },
  "support": { color: "#89c4f7", gradient: "from-cyan-500 to-cyan-600" },
  "general": { color: "#d1d5db", gradient: "from-gray-400 to-gray-500" },
};

// This should be replaced with the actual Email interface from EmailComposeModal.tsx
// interface Email {
//   _id?: string;
//   subject: string;
//   sender: {
//     name: string;
//     email: string;
//     avatar?: string;
//   };
//   recipients: {
//     name: string;
//     email: string;
//     avatar?: string;
//   }[];
//   cc?: {
//     name: string;
//     email: string;
//     avatar?: string;
//   }[];
//   bcc?: {
//     name: string;
//     email: string;
//     avatar?: string;
//   }[];
//   body: string;
//   snippet: string;
//   timestamp: string;
//   isRead: boolean;
//   isStarred: boolean;
//   isImportant: boolean;
//   labels: string[];
//   folder: "inbox" | "sent" | "drafts" | "trash" | "spam" | "archived";
//   attachments?: EmailAttachment[];
//   threadId: string;
//   accountId: string;
// }
import { EmailComposeModal, Email as EmailComposeType } from './EmailComposeModal';

// This should be replaced with the actual EmailAttachment interface
// interface EmailAttachment {
//   id: string;
//   name: string;
//   type: "pdf" | "image" | "document" | "spreadsheet" | "presentation" | "other";
//   size: number;
//   url: string; // Note: not optional in Email type
//   thumbnail?: string;
// }

const convertToEmailType = (email: IEmail | null): EmailComposeType | null => {
  if (!email) return null;
  
  return {
    _id: email._id,
    subject: email.subject,
    // Handle the optional sender field
    sender: {
      name: email.sender.name,
      email: email.sender.email,
      avatar: email.sender.avatar
    },
    recipients: email.recipients,
    cc: email.cc || [],
    bcc: email.bcc || [],
    body: email.body,
    snippet: email.snippet,
    timestamp: email.timestamp,
    isRead: email.isRead,
    isStarred: email.isStarred,
    isImportant: email.isImportant,
    labels: email.labels,
    folder: email.folder,
    attachments: email.attachments?.map(attachment => ({
      ...attachment,
      url: attachment.url || ''
    })) || [],
    threadId: email.threadId,
    accountId: email.accountId
  };
};

const convertToIEmailType = (email: EmailComposeType): IEmail => {
  return {
    _id: email._id || `temp_${Date.now()}`,
    subject: email.subject,
    sender: email.sender || { name: "", email: "" }, // Provide a default if sender is undefined
    recipients: email.recipients,
    cc: email.cc,
    bcc: email.bcc,
    body: email.body,
    snippet: email.snippet || email.body.substring(0, 100) + "...",
    timestamp: email.timestamp || new Date().toISOString(),
    isRead: email.isRead ?? true,
    isStarred: email.isStarred ?? false,
    isImportant: email.isImportant ?? false,
    labels: email.labels || [],
    folder: email.folder as "inbox" | "sent" | "drafts" | "trash" | "spam" | "archived" || "sent",
    attachments: email.attachments,
    threadId: email.threadId || `thread_${Date.now()}`,
    accountId: email.accountId || ""
  };
};

export default function GmailPage() {
  // States for the Gmail integration
  const [gmailAccounts, setGmailAccounts] = useState<IGmailAccount[]>([]);
  const [emails, setEmails] = useState<IEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<IEmail | null>(null);
  const [emailThreads, setEmailThreads] = useState<IEmail[]>([]);
  const [templates, setTemplates] = useState<IEmailTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>("inbox");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const emailContentRef = useRef<null | HTMLDivElement>(null);

  // Modal states
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState<boolean>(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState<boolean>(false);
  const [editingEmail, setEditingEmail] = useState<IEmail | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalEmails: 0,
    unreadEmails: 0,
    sentToday: 0,
    avgResponseTime: 0
  });

  // Navigation options
  const navigationOptions = [
    { key: "inbox", label: "Boîte de réception", icon: InboxIcon, color: "#213f5b" },
    { key: "starred", label: "Suivis", icon: StarIcon, color: "#f59e0b" },
    { key: "important", label: "Importants", icon: ExclamationCircleIcon, color: "#ef4444" },
    { key: "sent", label: "Envoyés", icon: PaperAirplaneIcon, color: "#10b981" },
    { key: "drafts", label: "Brouillons", icon: PencilIcon, color: "#6b7280" },
    { key: "scheduled", label: "Programmés", icon: ClockIcon, color: "#8b5cf6" },
    { key: "archived", label: "Archivés", icon: ArchiveBoxIcon, color: "#6366f1" },
    { key: "spam", label: "Spam", icon: ExclamationCircleIcon, color: "#ef4444" },
    { key: "trash", label: "Corbeille", icon: TrashIcon, color: "#6b7280" },
  ];

  // Label options
  const labelOptions = [
    { key: "social", label: "Social", color: "#4338ca" },
    { key: "updates", label: "Mises à jour", color: "#0e7490" },
    { key: "promotions", label: "Promotions", color: "#0369a1" },
    { key: "forums", label: "Forums", color: "#c2410c" },
    { key: "work", label: "Travail", color: "#0f172a" },
    { key: "personal", label: "Personnel", color: "#b45309" },
  ];

  // Fetch Gmail accounts and emails
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Mock fetching Gmail accounts
        // In a real implementation, this would be an API call
        const mockAccounts: IGmailAccount[] = [
          {
            _id: "1",
            email: "contact@votreentreprise.com",
            name: "Contact",
            avatar: "https://ui-avatars.com/api/?name=Contact&background=213f5b&color=fff",
            status: "connected",
            unreadCount: 14,
            lastChecked: new Date().toISOString(),
            signature: "<p>Cordialement,<br>L'équipe Support</p>",
            isDefault: true,
            quota: {
              used: 5.2 * 1024 * 1024 * 1024, // 5.2 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            }
          },
          {
            _id: "2",
            email: "support@votreentreprise.com",
            name: "Support Technique",
            avatar: "https://ui-avatars.com/api/?name=Support&background=2cb67d&color=fff",
            status: "connected",
            unreadCount: 7,
            lastChecked: new Date().toISOString(),
            signature: "<p>À votre service,<br>L'équipe Support Technique</p>",
            isDefault: false,
            quota: {
              used: 8.7 * 1024 * 1024 * 1024, // 8.7 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            }
          },
          {
            _id: "3",
            email: "marketing@votreentreprise.com",
            name: "Marketing",
            avatar: "https://ui-avatars.com/api/?name=Marketing&background=7f5af0&color=fff",
            status: "disconnected",
            unreadCount: 0,
            lastChecked: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            signature: "<p>Bien à vous,<br>L'équipe Marketing</p>",
            isDefault: false,
            quota: {
              used: 3.2 * 1024 * 1024 * 1024, // 3.2 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            }
          }
        ];
        
        // Generate sample emails
        const mockEmails: IEmail[] = Array.from({ length: 25 }, (_, i) => {
          const folders = ["inbox", "sent", "drafts", "spam", "trash", "archived"];
          const folderDistribution = [15, 5, 2, 1, 1, 1]; // Weight for random distribution
          const randomFolder = () => {
            const total = folderDistribution.reduce((a, b) => a + b);
            const rand = Math.random() * total;
            let sum = 0;
            for (let j = 0; j < folderDistribution.length; j++) {
              sum += folderDistribution[j];
              if (rand < sum) return folders[j];
            }
            return folders[0];
          };
          
          // Determine if this email is related to a previous one (thread)
          const isThread = i > 0 && i % 5 !== 0;
          const threadId = isThread ? `thread_${Math.floor(i / 5)}` : `thread_${i}`;
          
          // Generate random labels
          const labelKeys = Object.keys(labelColors);
          const randomLabels = Array.from({ length: Math.floor(Math.random() * 3) }, () =>
            labelKeys[Math.floor(Math.random() * labelKeys.length)]
          ).filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
          
          // Decide which account this email belongs to
          const account = mockAccounts[Math.floor(Math.random() * mockAccounts.filter(a => a.status === "connected").length)];
          const folder = randomFolder() as "inbox" | "sent" | "drafts" | "trash" | "spam" | "archived";
          
          // Create email content
          return {
            _id: `email_${i}`,
            subject: getRandomSubject(i, isThread, threadId),
            sender: getRandomSender(i, folder, account),
            recipients: [{ 
              name: account.name, 
              email: account.email,
              avatar: account.avatar
            }],
            cc: Math.random() > 0.7 ? [getRandomContact()] : undefined,
            bcc: Math.random() > 0.8 ? [getRandomContact()] : undefined,
            body: getRandomEmailBody(i, isThread),
            snippet: getRandomEmailSnippet(i, isThread),
            timestamp: new Date(Date.now() - Math.random() * 604800000).toISOString(), // Within the last week
            isRead: Math.random() > 0.4 || folder !== "inbox",
            isStarred: Math.random() > 0.8,
            isImportant: Math.random() > 0.7,
            labels: randomLabels,
            folder: folder,
            attachments: Math.random() > 0.7 ? getRandomAttachments() : undefined,
            threadId: threadId,
            accountId: account._id
          };
        });
        
        // Mock templates
        const mockTemplates: IEmailTemplate[] = [
          {
            _id: "template_1",
            name: "Réponse au client",
            subject: "Re: {{sujet}}",
            body: "<p>Bonjour {{nom_client}},</p><p>Merci de nous avoir contacté. Votre demande a bien été prise en compte.</p><p>{{message_personnalisé}}</p><p>N'hésitez pas à me contacter pour toute information complémentaire.</p>",
            variables: ["sujet", "nom_client", "message_personnalisé"],
            category: "support",
            isSystem: true,
            lastUsed: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: "template_2",
            name: "Proposition commerciale",
            subject: "Proposition commerciale - {{entreprise}}",
            body: "<p>Bonjour {{prénom}},</p><p>Suite à notre échange, je vous prie de trouver ci-joint notre proposition commerciale pour {{service}}.</p><p>Cette offre est valable jusqu'au {{date_validité}}.</p><p>Je reste à votre disposition pour toute information complémentaire.</p>",
            variables: ["entreprise", "prénom", "service", "date_validité"],
            category: "sales",
            isSystem: true,
            lastUsed: new Date(Date.now() - 432000000).toISOString()
          },
          {
            _id: "template_3",
            name: "Newsletter mensuelle",
            subject: "{{mois}} - Les actualités de {{entreprise}}",
            body: "<p>Chers clients,</p><p>Voici les dernières actualités de {{entreprise}} pour ce mois de {{mois}}.</p><p>{{contenu}}</p><p>Pour vous désabonner, cliquez <a href='#'>ici</a>.</p>",
            variables: ["mois", "entreprise", "contenu"],
            category: "marketing",
            isSystem: true,
            lastUsed: new Date(Date.now() - 2592000000).toISOString()
          }
        ];
        
        // Calculate stats
        const inboxEmails = mockEmails.filter(e => e.folder === "inbox");
        const unreadEmails = inboxEmails.filter(e => !e.isRead).length;
        const sentToday = mockEmails.filter(e => {
          const emailDate = new Date(e.timestamp);
          const today = new Date();
          return e.folder === "sent" && 
            emailDate.getDate() === today.getDate() &&
            emailDate.getMonth() === today.getMonth() &&
            emailDate.getFullYear() === today.getFullYear();
        }).length;
        
        const mockStats = {
          totalEmails: mockEmails.length,
          unreadEmails: unreadEmails,
          sentToday: sentToday,
          avgResponseTime: 45 // minutes
        };
        
        // Sort emails by timestamp, newest first
        mockEmails.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setGmailAccounts(mockAccounts);
        setEmails(mockEmails);
        setTemplates(mockTemplates);
        setStats(mockStats);
        
        if (mockAccounts.length > 0) {
          setSelectedAccount(mockAccounts.find(a => a.isDefault)?._id || mockAccounts[0]._id);
        }
        
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

  // Helper function to get a random subject
  function getRandomSubject(index: number, isThread: boolean, threadId: string): string {
    const subjects = [
      "Proposition de partenariat",
      "Demande d'information sur vos services",
      "Confirmation de votre commande #12345",
      "Votre facture pour le mois de mars",
      "Invitation à notre webinaire sur la transformation digitale",
      "Problème avec mon compte client",
      "Demande de devis pour projet",
      "Mise à jour de nos conditions générales",
      "Nouvelle version de notre application disponible",
      "Confirmation de votre rendez-vous"
    ];
    
    if (isThread) {
      // For thread emails, use the base subject with Re: prefix
      const baseSubjectIndex = parseInt(threadId.split('_')[1]);
      const subject = subjects[baseSubjectIndex % subjects.length];
      return `Re: ${subject}`;
    }
    
    return subjects[index % subjects.length];
  }

  // Helper function to get a random sender
  function getRandomSender(index: number, folder: string, account: IGmailAccount): ISender {
    // If it's a sent email, the sender is the account owner
    if (folder === "sent" || folder === "drafts") {
      return {
        name: account.name,
        email: account.email,
        avatar: account.avatar
      };
    }
    
    // Otherwise, generate a random sender
    const senders = [
      { name: "Jean Dupont", email: "jean.dupont@example.com", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Marie Lefevre", email: "marie.lefevre@example.com", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Thomas Bernard", email: "t.bernard@example.com", avatar: "https://i.pravatar.cc/150?img=3" },
      { name: "Sophie Martin", email: "s.martin@example.com", avatar: "https://i.pravatar.cc/150?img=9" },
      { name: "Entreprise ABC", email: "contact@abc-company.com", avatar: "https://ui-avatars.com/api/?name=ABC&background=4f46e5&color=fff" },
      { name: "Service Client XYZ", email: "support@xyz.com", avatar: "https://ui-avatars.com/api/?name=XYZ&background=10b981&color=fff" }
    ];
    
    return senders[index % senders.length];
  }

  // Helper function to get a random contact
  function getRandomContact(): IRecipient {
    const contacts = [
      { name: "Pierre Moreau", email: "p.moreau@example.com", avatar: "https://i.pravatar.cc/150?img=7" },
      { name: "Léa Petit", email: "lea.petit@example.com", avatar: "https://i.pravatar.cc/150?img=20" },
      { name: "Marc Dubois", email: "m.dubois@example.com", avatar: "https://i.pravatar.cc/150?img=12" },
      { name: "Julie Lambert", email: "julie@example.com", avatar: "https://i.pravatar.cc/150?img=29" }
    ];
    
    return contacts[Math.floor(Math.random() * contacts.length)];
  }

  // Helper function to get random email body
  function getRandomEmailBody(index: number, isThread: boolean): string {
    const salutations = ["Bonjour", "Cher client", "Cher partenaire", "Madame, Monsieur", "Bonjour à tous"];
    const closings = ["Cordialement", "Bien à vous", "Sincères salutations", "Merci d'avance", "À bientôt"];
    
    const bodyParts = [
      "Nous vous confirmons la bonne réception de votre demande. Notre équipe l'examinera dans les plus brefs délais.",
      "Votre commande a bien été prise en compte et sera expédiée dans les 48 heures.",
      "Nous sommes ravis de vous inviter à notre prochain webinaire qui aura lieu le 15 juin à 14h.",
      "Suite à notre conversation téléphonique, je vous fais parvenir les informations demandées concernant nos services.",
      "Nous avons mis à jour notre politique de confidentialité. Veuillez en prendre connaissance.",
      "Nous avons le plaisir de vous annoncer le lancement de notre nouvelle gamme de produits.",
      "Nous vous remercions pour votre fidélité et vous offrons une remise de 10% sur votre prochaine commande.",
      "Nous sommes désolés de vous informer que votre demande ne peut être traitée en l'état. Merci de bien vouloir nous fournir plus d'informations."
    ];
    
    // For thread emails, create a reply context
    if (isThread) {
      const salutation = salutations[Math.floor(Math.random() * salutations.length)];
      const replyContent = "Merci pour votre message. " + 
        bodyParts[(index + 2) % bodyParts.length] + " " +
        "N'hésitez pas à me contacter pour toute information complémentaire.";
      const closing = closings[Math.floor(Math.random() * closings.length)];
      
      return `<p>${salutation},</p><p>${replyContent}</p><p>${closing},</p><p><strong>John Doe</strong><br>Responsable Commercial</p>`;
    }
    
    // For regular emails
    const salutation = salutations[index % salutations.length];
    const body = bodyParts[index % bodyParts.length];
    const closing = closings[index % closings.length];
    
    return `<p>${salutation},</p><p>${body}</p><p>${closing},</p><p><strong>John Doe</strong><br>Responsable Commercial</p>`;
  }

  // Helper function to get a random email snippet
  function getRandomEmailSnippet(index: number, isThread: boolean): string {
    const snippets = [
      "Nous vous confirmons la bonne réception de votre demande. Notre équipe l'examinera dans les plus brefs délais...",
      "Votre commande a bien été prise en compte et sera expédiée dans les 48 heures...",
      "Nous sommes ravis de vous inviter à notre prochain webinaire qui aura lieu le 15 juin à 14h...",
      "Suite à notre conversation téléphonique, je vous fais parvenir les informations demandées...",
      "Nous avons mis à jour notre politique de confidentialité. Veuillez en prendre connaissance..."
    ];
    
    if (isThread) {
      return "Merci pour votre message. " + snippets[(index + 2) % snippets.length];
    }
    
    return snippets[index % snippets.length];
  }

  // Helper function to generate random attachments
  function getRandomAttachments(): IAttachment[] {
    const types = ["pdf", "image", "document", "spreadsheet", "presentation", "other"];
    const attachmentCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 attachments
    
    return Array.from({ length: attachmentCount }, (_, i) => {
      const randomType = types[Math.floor(Math.random() * types.length)] as "pdf" | "image" | "document" | "spreadsheet" | "presentation" | "other";
      const fileNames = {
        "pdf": ["rapport.pdf", "facture.pdf", "contrat.pdf", "documentation.pdf"],
        "image": ["photo.jpg", "capture.png", "image.jpg", "logo.png"],
        "document": ["document.docx", "compte-rendu.doc", "proposition.docx"],
        "spreadsheet": ["données.xlsx", "statistiques.xlsx", "budget.xls"],
        "presentation": ["présentation.pptx", "slides.ppt", "conférence.pptx"],
        "other": ["fichier.zip", "archive.rar", "data.json", "config.xml"]
      };
      
      const randomFileName = fileNames[randomType][Math.floor(Math.random() * fileNames[randomType].length)];
      
      return {
        id: `attachment_${i}`,
        name: randomFileName,
        type: randomType,
        size: Math.floor(Math.random() * 5000000) + 100000, // Between 100KB and 5MB
        url: "#",
        thumbnail: randomType === "image" ? `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300` : undefined
      };
    });
  }

  // Get thread emails when an email is selected
  useEffect(() => {
    if (selectedEmail) {
      // In a real application, this would be an API call to get the thread
      const threadEmails = emails.filter(e => e.threadId === selectedEmail.threadId);
      
      // Sort by timestamp, oldest first to show conversation flow
      threadEmails.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setEmailThreads(threadEmails);
      
      // Mark selected email as read if it wasn't already
      if (!selectedEmail.isRead) {
        setEmails(prev => 
          prev.map(e => 
            e._id === selectedEmail._id ? {...e, isRead: true} : e
          )
        );
        
        // Update unread count in stats
        setStats(prev => ({
          ...prev,
          unreadEmails: prev.unreadEmails - 1
        }));
      }
      
      // Scroll to top of email content
      emailContentRef.current?.scrollTo(0, 0);
    } else {
      setEmailThreads([]);
    }
  }, [selectedEmail, emails]);

  // Send a reply email
  const sendReply = () => {
    if (!replyContent.trim() || !selectedEmail) return;
    
    const account = gmailAccounts.find(a => a._id === selectedAccount);
    if (!account) return;
    
    // Create a new reply email
    const newReply: IEmail = {
      _id: `email_reply_${Date.now()}`,
      subject: selectedEmail.subject.startsWith("Re:") ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
      sender: {
        name: account.name,
        email: account.email,
        avatar: account.avatar
      },
      recipients: [selectedEmail.sender],
      body: `<p>${replyContent}</p>${account.signature ? account.signature : ""}`,
      snippet: replyContent.substring(0, 100) + "...",
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      labels: [],
      folder: "sent",
      threadId: selectedEmail.threadId,
      accountId: account._id
    };
    
    // Add the new email to the emails array
    setEmails(prev => [newReply, ...prev]);
    
    // Add to the current thread
    setEmailThreads(prev => [...prev, newReply]);
    
    // Clear the reply input
    setReplyContent("");
    setIsReplyOpen(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      sentToday: prev.sentToday + 1
    }));
  };

  // Filter emails based on search, account, folder, and label selections
  const filteredEmails = emails.filter((email) => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        email.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        email.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        email.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccount = !selectedAccount || email.accountId === selectedAccount;
    
    const matchesFolder = currentFolder === email.folder || 
                         (currentFolder === "starred" && email.isStarred) ||
                         (currentFolder === "important" && email.isImportant);
    
    const matchesLabels = selectedLabels.length === 0 || 
                         selectedLabels.every(label => email.labels.includes(label));
    
    return matchesSearch && matchesAccount && matchesFolder && matchesLabels;
  });

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLabels([]);
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (dayDiff === 1) {
      return "Hier";
    } else if (dayDiff < 7) {
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'numeric' });
    }
  };

  // Helper function to get attachment icon
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <DocumentTextIcon className="h-5 w-5 text-red-500" />;
      case "image":
        return <PaperClipIcon className="h-5 w-5 text-blue-500" />;
      case "document":
        return <DocumentTextIcon className="h-5 w-5 text-blue-700" />;
      case "spreadsheet":
        return <DocumentDuplicateIcon className="h-5 w-5 text-green-600" />;
      case "presentation":
        return <PlayCircleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <PaperClipIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Toggle email star status
  const toggleStarred = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email._id === emailId 
          ? {...email, isStarred: !email.isStarred}
          : email
      )
    );
  };

  // Toggle email important status
  const toggleImportant = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email._id === emailId 
          ? {...email, isImportant: !email.isImportant}
          : email
      )
    );
  };

  // Archive email
  const archiveEmail = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email._id === emailId 
          ? {...email, folder: "archived"}
          : email
      )
    );
    
    // If the archived email is the selected one, deselect it
    if (selectedEmail && selectedEmail._id === emailId) {
      setSelectedEmail(null);
    }
  };

  // Delete email (move to trash)
  const deleteEmail = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email._id === emailId 
          ? {...email, folder: "trash"}
          : email
      )
    );
    
    // If the deleted email is the selected one, deselect it
    if (selectedEmail && selectedEmail._id === emailId) {
      setSelectedEmail(null);
    }
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
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-1 pl-2">Gmail</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gérez vos emails directement depuis votre CRM</p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="flex items-center gap-3 self-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateTemplateModalOpen(true)}
                    className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                    Créer un template
                  </Button>
                  <Button
                    onClick={() => setIsAddAccountModalOpen(true)}
                    className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un compte
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
                      <p className="text-sm text-[#213f5b] font-medium">Total emails</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalEmails.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">sur tous les comptes</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-200">
                      <EnvelopeIcon className="h-5 w-5 text-white" />
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
                      <p className="text-sm text-[#213f5b] font-medium">Non lus</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.unreadEmails}</p>
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">À traiter</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">emails en attente</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200">
                      <InboxIcon className="h-5 w-5 text-white" />
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
                      <p className="text-sm text-[#213f5b] font-medium">Envoyés aujourd&apos;hui</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.sentToday}</p>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+3</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">messages envoyés</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-200">
                      <PaperAirplaneIcon className="h-5 w-5 text-white" />
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
                      <p className="text-sm text-[#213f5b] font-medium">Temps de réponse</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.avgResponseTime} <span className="text-lg font-medium">min</span></p>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Bon</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">temps moyen</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg shadow-indigo-200">
                      <ClockIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Main Content - Gmail Interface */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Navigation and Folders */}
              <div className="w-64 border-r border-[#eaeaea] flex flex-col bg-white">
                {/* Compose Button */}
                <div className="p-4">
                  <Button
                    onClick={() => {
                      setEditingEmail(null);
                      setIsComposeModalOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Nouveau message
                  </Button>
                </div>
                
                {/* Account selector */}
                <div className="px-4 mb-4">
                  <select
                    value={selectedAccount || ""}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full bg-[#f8fafc] border-[#eaeaea] rounded-lg text-[#213f5b] text-sm focus:ring-[#bfddf9] focus:border-[#bfddf9]"
                  >
                    {gmailAccounts.map(account => (
                      <option key={account._id} value={account._id} disabled={account.status === "disconnected"}>
                        {account.email} 
                        {account.status === "disconnected" ? " - Déconnecté" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto px-2">
                  <div className="space-y-1">
                    {navigationOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = currentFolder === option.key;
                      const unreadCount = option.key === "inbox" 
                        ? emails.filter(e => e.folder === "inbox" && !e.isRead && e.accountId === selectedAccount).length 
                        : 0;
                        
                      return (
                        <button
                          key={option.key}
                          className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive 
                              ? 'bg-[#f0f7ff] text-[#213f5b]' 
                              : 'text-[#213f5b] hover:bg-[#f8fafc]'
                          }`}
                          onClick={() => {
                            setCurrentFolder(option.key);
                            setSelectedEmail(null);
                          }}
                        >
                          <Icon className={`h-5 w-5 mr-3`} style={{ color: option.color }} />
                          <span>{option.label}</span>
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-[#bfddf9] text-[#213f5b] text-xs font-bold rounded-full px-2 py-0.5">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Labels Section */}
                  <div className="mt-6">
                    <div className="px-3 mb-2 flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Étiquettes</h3>
                      <Button
                        variant="ghost"
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {labelOptions.map((label) => {
                        const isSelected = selectedLabels.includes(label.key);
                        
                        return (
                          <button
                            key={label.key}
                            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isSelected 
                                ? 'bg-[#f0f7ff] text-[#213f5b]' 
                                : 'text-[#213f5b] hover:bg-[#f8fafc]'
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedLabels(selectedLabels.filter(l => l !== label.key));
                              } else {
                                setSelectedLabels([...selectedLabels, label.key]);
                              }
                            }}
                          >
                            <span className="h-3 w-3 rounded-full mr-3" style={{ backgroundColor: label.color }}></span>
                            <span>{label.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Storage Usage */}
                  {selectedAccount && (
                    <div className="mt-6 px-3">
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-[#213f5b]">Stockage utilisé</h3>
                        <span className="text-xs text-[#213f5b]">
                          {formatFileSize(gmailAccounts.find(a => a._id === selectedAccount)?.quota.used || 0)}
                          {" / "}
                          {formatFileSize(gmailAccounts.find(a => a._id === selectedAccount)?.quota.total || 0)}
                        </span>
                      </div>
                      <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#bfddf9] to-[#3978b5] rounded-full"
                          style={{ 
                            width: `${(gmailAccounts.find(a => a._id === selectedAccount)?.quota.used || 0) / (gmailAccounts.find(a => a._id === selectedAccount)?.quota.total || 1) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Middle Panel - Email List */}
              <div className={`${selectedEmail ? 'hidden md:block' : 'block'} w-full md:w-[350px] xl:w-[400px] border-r border-[#eaeaea] flex flex-col bg-white`}>
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-[#eaeaea] bg-white">
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un email..."
                      className="pl-10 pr-10 py-2.5 w-full rounded-lg border-[#eaeaea] bg-[#f8fafc] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm"
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className="flex items-center gap-1 text-xs text-[#213f5b] border-[#eaeaea] hover:border-[#bfddf9] hover:bg-[#f8fafc] rounded-lg py-1.5 px-3 shadow-sm transition-all"
                      >
                        <FunnelIcon className="h-3 w-3" />
                        <span>Filtres</span>
                        {selectedLabels.length > 0 && (
                          <span className="flex items-center justify-center h-4 w-4 bg-[#d2fcb2] text-[#213f5b] text-xs font-medium rounded-full">
                            {selectedLabels.length}
                          </span>
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEmail(null)}
                        className="md:hidden flex items-center gap-1 text-xs text-[#213f5b] hover:bg-[#f8fafc] rounded-lg py-1.5 px-3"
                      >
                        <ArrowLeftIcon className="h-3 w-3" />
                        <span>Retour</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                        title="Actualiser"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                        title="Plus d'options"
                      >
                        <EllipsisHorizontalIcon className="h-4 w-4" />
                      </Button>
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
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#213f5b] mb-1">Étiquettes</label>
                              <div className="flex flex-wrap gap-1">
                                {labelOptions.map(label => (
                                  <Button
                                    key={label.key}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (selectedLabels.includes(label.key)) {
                                        setSelectedLabels(selectedLabels.filter(l => l !== label.key));
                                      } else {
                                        setSelectedLabels([...selectedLabels, label.key]);
                                      }
                                    }}
                                    className={`flex items-center gap-1 text-xs rounded-lg py-1 px-2 ${
                                      selectedLabels.includes(label.key)
                                        ? 'bg-[#f0f7ff] border-[#bfddf9] text-[#213f5b]'
                                        : 'border-[#eaeaea] text-[#213f5b] hover:border-[#bfddf9] hover:bg-[#f8fafc]'
                                    }`}
                                  >
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: label.color }}></span>
                                    <span>{label.label}</span>
                                    {selectedLabels.includes(label.key) && (
                                      <XMarkIcon className="h-3 w-3" />
                                    )}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {selectedLabels.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedLabels([])}
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
                
                {/* Email List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col justify-center items-center p-12">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full blur opacity-30 animate-pulse"></div>
                        <div className="relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#213f5b]"></div>
                      </div>
                      <p className="mt-4 text-[#213f5b] animate-pulse">Chargement des emails...</p>
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
                        onClick={() => window.location.reload()}
                      >
                        Rafraîchir
                      </Button>
                    </div>
                  ) : filteredEmails.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="relative mx-auto mb-6 w-20 h-20">
                        <div className="absolute inset-0 bg-[#bfddf9] opacity-20 rounded-full animate-pulse"></div>
                        <InboxIcon className="h-20 w-20 text-[#bfddf9] opacity-60" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#213f5b] mb-2">Aucun email</h3>
                      <p className="text-[#213f5b] opacity-75 mb-4">Aucun email ne correspond à vos critères de recherche.</p>
                      {(searchTerm || selectedLabels.length > 0) && (
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="border-[#bfddf9] bg-white text-[#213f5b] hover:bg-[#bfddf9] transition-all rounded-lg py-2 px-4"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f0f0f0]">
                      {filteredEmails.map((email, index) => (
                        <motion.div
                          key={email._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className={`cursor-pointer transition-colors p-3 hover:bg-[#f8fafc] ${
                            selectedEmail?._id === email._id ? 'bg-[#f0f7ff]' : email.isRead ? '' : 'bg-[#f0f7ff] bg-opacity-50'
                          }`}
                          onClick={() => setSelectedEmail(email)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Sender Avatar */}
                            <div className="relative mt-1">
                              <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
                                {email.sender.avatar ? (
                                  <img 
                                    src={email.sender.avatar} 
                                    alt={email.sender.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-[#213f5b] flex items-center justify-center text-white font-bold text-lg">
                                    {email.sender.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Email Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className={`${!email.isRead ? 'font-semibold' : 'font-medium'} text-[#213f5b] truncate pr-2`}>
                                  {email.folder === "sent" || email.folder === "drafts" 
                                    ? email.recipients.length > 1 
                                      ? `${email.recipients[0].name} +${email.recipients.length - 1}`
                                      : email.recipients[0].name 
                                    : email.sender.name}
                                </h3>
                                <span className="text-xs flex items-center whitespace-nowrap text-[#213f5b] opacity-75">
                                  {formatDate(email.timestamp)}
                                </span>
                              </div>
                              
                              <h4 className={`text-sm ${!email.isRead ? 'font-semibold text-[#213f5b]' : 'font-medium text-[#213f5b] opacity-90'} truncate mt-0.5`}>
                                {email.subject}
                              </h4>
                              
                              <div className="flex items-center gap-1 mt-0.5">
                                {email.folder === "drafts" && (
                                  <span className="text-xs text-red-500 font-medium mr-1">Brouillon:</span>
                                )}
                                <p className="text-xs text-[#213f5b] opacity-75 truncate line-clamp-1">
                                  {email.snippet}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-1.5">
                                <div className="flex gap-1 flex-wrap max-w-[190px]">
                                  {email.labels.length > 0 && email.labels.map(label => (
                                    <span 
                                      key={label} 
                                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium truncate max-w-[80px]"
                                      style={{ 
                                        backgroundColor: labelColors[label as keyof typeof labelColors]?.bg || '#eaeaea',
                                        color: labelColors[label as keyof typeof labelColors]?.text || '#213f5b'
                                      }}
                                    >
                                      {labelOptions.find(l => l.key === label)?.label || label}
                                    </span>
                                  ))}
                                  
                                  {email.attachments && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium truncate max-w-[80px] bg-[#f3f4f6] text-[#4b5563] flex items-center gap-0.5">
                                      <PaperClipIcon className="h-2.5 w-2.5" />
                                      <span>{email.attachments.length}</span>
                                    </span>
                                  )}
                                </div>
                                
                                {/* Quick Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100">
                                  <button 
                                    className="text-[#213f5b] hover:text-[#f59e0b] p-1 rounded-full hover:bg-[#f0f0f0]"
                                    onClick={(e) => toggleStarred(e, email._id)}
                                  >
                                    <StarIcon className={`h-4 w-4 ${email.isStarred ? 'text-[#f59e0b] fill-[#f59e0b]' : ''}`} />
                                  </button>
                                  
                                  <button 
                                    className="text-[#213f5b] hover:text-[#ef4444] p-1 rounded-full hover:bg-[#f0f0f0]"
                                    onClick={(e) => toggleImportant(e, email._id)}
                                  >
                                    <ExclamationCircleIcon className={`h-4 w-4 ${email.isImportant ? 'text-[#ef4444] fill-[#ef4444]' : ''}`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Panel - Email Content View */}
              <div className={`${selectedEmail ? 'block' : 'hidden md:block'} flex-1 flex flex-col bg-white`}>
                {selectedEmail ? (
                  <>
                    {/* Email Header */}
                    <div className="p-4 border-b border-[#eaeaea] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          className="md:hidden h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                          onClick={() => setSelectedEmail(null)}
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                        </Button>
                        <h3 className="font-semibold text-[#213f5b] truncate">{selectedEmail.subject}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                          onClick={(e) => toggleStarred(e, selectedEmail._id)}
                        >
                          <StarIcon className={`h-4 w-4 ${selectedEmail.isStarred ? 'text-[#f59e0b] fill-[#f59e0b]' : ''}`} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                          onClick={(e) => archiveEmail(e, selectedEmail._id)}
                        >
                          <ArchiveBoxIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                          onClick={(e) => deleteEmail(e, selectedEmail._id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                        >
                          <EllipsisHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Email Thread View */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc]" ref={emailContentRef}>
                      {emailThreads.map((threadEmail ) => (
                        <div key={threadEmail._id} className="mb-6 last:mb-0">
                          <div className="bg-white rounded-lg shadow-sm border border-[#eaeaea] overflow-hidden">
                            {/* Email Metadata */}
                            <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#eaeaea] flex items-center justify-between">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                                  {threadEmail.sender.avatar ? (
                                    <img 
                                      src={threadEmail.sender.avatar} 
                                      alt={threadEmail.sender.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-[#213f5b] flex items-center justify-center text-white font-bold text-lg">
                                      {threadEmail.sender.name.charAt(0).toUpperCase()}
                                    </div>
                                    )}
                                    </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-[#213f5b]">{threadEmail.sender.name}</h4>
                                                <span className="text-xs text-[#213f5b] opacity-60">
                                                {threadEmail.sender.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-0.5">
                                            <p className="text-xs text-[#213f5b] opacity-60">
                                            {new Date(threadEmail.timestamp).toLocaleString([], {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                            })}
                                            </p>
                                            {threadEmail.recipients.length > 0 && (
                                            <div className="flex items-center ml-3">
                                            <span className="text-xs text-[#213f5b] opacity-60 mr-1">à</span>
                                            <span className="text-xs text-[#213f5b] opacity-80">
                                            {threadEmail.recipients.map(r => r.name).join(', ')}
                                            </span>
                                            </div>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              className="h-7 w-7 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                              onClick={() => {
                                setEditingEmail(threadEmail);
                                setIsComposeModalOpen(true);
                              }}
                            >
                              <ArrowLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-7 w-7 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                            >
                              <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Email Content */}
                        <div className="p-4">
                          <div 
                            className="prose max-w-none text-[#213f5b]"
                            dangerouslySetInnerHTML={{ __html: threadEmail.body }}
                          />
                          
                          {/* Attachments */}
                          {threadEmail.attachments && threadEmail.attachments.length > 0 && (
                            <div className="mt-4 border-t border-[#eaeaea] pt-4">
                              <h5 className="text-sm font-medium text-[#213f5b] mb-2">
                                Pièces jointes ({threadEmail.attachments.length})
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {threadEmail.attachments.map((attachment, i) => (
                                  <div 
                                    key={i}
                                    className="flex items-center p-2 bg-[#f8fafc] rounded-lg border border-[#eaeaea] hover:bg-[#f0f7ff] hover:border-[#bfddf9] transition-colors cursor-pointer"
                                  >
                                    <div className="mr-3 flex-shrink-0">
                                      {getAttachmentIcon(attachment.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#213f5b] truncate">{attachment.name}</p>
                                      <p className="text-xs text-[#213f5b] opacity-60">{formatFileSize(attachment.size)}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-white"
                                    >
                                      <ArrowDownOnSquareIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Reply Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-[#eaeaea] overflow-hidden mt-4">
                    {!isReplyOpen ? (
                      <button
                        className="w-full px-4 py-3 text-left text-[#213f5b] hover:bg-[#f8fafc] transition-colors"
                        onClick={() => setIsReplyOpen(true)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                            {selectedAccount && gmailAccounts.find(a => a._id === selectedAccount)?.avatar ? (
                              <img 
                                src={gmailAccounts.find(a => a._id === selectedAccount)?.avatar} 
                                alt="You" 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-[#213f5b] flex items-center justify-center text-white font-bold text-lg">
                                {selectedAccount ? gmailAccounts.find(a => a._id === selectedAccount)?.name.charAt(0) : "?"}
                              </div>
                            )}
                          </div>
                          <span className="text-sm">Cliquez ici pour répondre...</span>
                        </div>
                      </button>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              {selectedAccount && gmailAccounts.find(a => a._id === selectedAccount)?.avatar ? (
                                <img 
                                  src={gmailAccounts.find(a => a._id === selectedAccount)?.avatar} 
                                  alt="You" 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-[#213f5b] flex items-center justify-center text-white font-bold text-sm">
                                  {selectedAccount ? gmailAccounts.find(a => a._id === selectedAccount)?.name.charAt(0) : "?"}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-[#213f5b]">
                              {selectedAccount ? gmailAccounts.find(a => a._id === selectedAccount)?.name : "Vous"}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 rounded-full"
                            onClick={() => setIsReplyOpen(false)}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mb-3">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Rédigez votre réponse ici..."
                            className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] min-h-[120px] resize-none text-sm p-3"
                            rows={5}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                              onClick={() => setIsTemplateVisible(!isTemplateVisible)}
                            >
                              <SquaresPlusIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                            >
                              <PaperClipIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                            >
                              <FaceSmileIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#213f5b] border-[#eaeaea] hover:bg-[#f8fafc] rounded-lg"
                              onClick={() => setIsReplyOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={sendReply}
                              disabled={!replyContent.trim()}
                              className={`text-white rounded-lg px-4 py-2 ${
                                replyContent.trim()
                                  ? 'bg-[#213f5b] hover:bg-[#152a3d]' 
                                  : 'bg-[#eaeaea] cursor-not-allowed'
                              }`}
                            >
                              Envoyer
                            </Button>
                          </div>
                        </div>
                        
                        {/* Template Suggestions */}
                        <AnimatePresence>
                          {isTemplateVisible && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-3 overflow-hidden border-t border-[#eaeaea] pt-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium text-[#213f5b]">Templates</h5>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
                                {templates.map(template => (
                                  <motion.div
                                    key={template._id}
                                    className="p-2 rounded-lg border border-[#eaeaea] hover:border-[#bfddf9] cursor-pointer transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => {
                                      // Replace variables with placeholders in the template body
                                      const plainTextContent = template.body
                                        .replace(/<[^>]*>/g, '')
                                        .replace(/{{([^}]+)}}/g, '___');
                                      setReplyContent(plainTextContent);
                                      setIsTemplateVisible(false);
                                    }}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="rounded-md p-1.5"
                                        style={{ 
                                          backgroundColor: templateCategories[template.category]?.color || '#eaeaea'
                                        }}
                                      >
                                        <DocumentDuplicateIcon className="h-3.5 w-3.5 text-[#213f5b]" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <h6 className="text-xs font-medium text-[#213f5b] truncate">{template.name}</h6>
                                          <span className="text-[10px] bg-[#f0f0f0] text-[#213f5b] rounded-full px-1.5 py-0.5">
                                            {template.category}
                                          </span>
                                        </div>
                                        <p className="text-xs text-[#213f5b] opacity-75 line-clamp-2 mt-0.5">
                                          {template.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Empty state when no email is selected
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 bg-[#bfddf9] opacity-20 rounded-full animate-pulse"></div>
                  <EnvelopeIcon className="w-32 h-32 text-[#bfddf9] opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-[#213f5b] mb-2">Aucun email sélectionné</h2>
                <p className="text-[#213f5b] opacity-75 max-w-md text-center mb-6">
                  Sélectionnez un email dans la liste pour voir son contenu ou créez un nouveau message.
                </p>
                <Button
                  onClick={() => {
                    setEditingEmail(null);
                    setIsComposeModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Nouveau message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  </div>
  
  {/* Modals */}
<AnimatePresence>
  {isAddAccountModalOpen && (
    <AddGmailAccountModal
      isOpen={isAddAccountModalOpen}
      onClose={() => setIsAddAccountModalOpen(false)}
      onAccountAdded={(newAccount) => {
        // Add type assertion to ensure newAccount is treated as IGmailAccount
        setGmailAccounts(prev => [...prev, newAccount as IGmailAccount]);
      }}
    />
  )}
  
  {isCreateTemplateModalOpen && (
    <CreateEmailTemplateModal
      isOpen={isCreateTemplateModalOpen}
      onClose={() => setIsCreateTemplateModalOpen(false)}
      onTemplateCreated={(newTemplate) => {
        // Add type assertion to ensure newTemplate is treated as IEmailTemplate
        setTemplates(prev => [...prev, newTemplate as IEmailTemplate]);
      }}
    />
  )}
  
  {isComposeModalOpen && (
    // Instead of using 'any', specify the exact type
    <EmailComposeModal
  isOpen={isComposeModalOpen}
  onClose={() => {
    setIsComposeModalOpen(false);
    setEditingEmail(null);
  }}
  editingEmail={convertToEmailType(editingEmail)}
  accounts={gmailAccounts.filter(a => a.status === 'connected')}
  selectedAccount={selectedAccount}
  templates={templates}
  onEmailSent={(emailFromCompose: EmailComposeType) => {
    // Convert properly from EmailComposeType to IEmail
    const convertedEmail = convertToIEmailType(emailFromCompose);
    setEmails(prev => [convertedEmail, ...prev]);
    setStats(prev => ({
      ...prev,
      totalEmails: prev.totalEmails + 1,
      sentToday: prev.sentToday + 1
    }));
  }}
/>
  )}
</AnimatePresence>
</div>
);
}
