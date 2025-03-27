"use client";

import { useState, useEffect, useRef, createContext, useContext  } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
// import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  ClockIcon,
  ArchiveBoxIcon,
  SquaresPlusIcon,
  FaceSmileIcon,
  PhotoIcon,
  DocumentIcon,
  MicrophoneIcon,
  XMarkIcon,
  CheckBadgeIcon,
  FunnelIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// Import modals for WhatsApp account management and template creation
import { AddWhatsAppAccountModal } from "./AddWhatsAppAccountModal";
import { CreateTemplateModal } from "./CreateTemplateModal";
import { AddContactToWhatsAppModal } from "./AddContactToWhatsAppModal";

const ThemeContext = createContext({ isDarkMode: false, toggleTheme: () => {} });

// Message type definitions
export interface IMessage {
  _id: string;
  content: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  sender: string;
  isIncoming: boolean;
  attachments?: IAttachment[];
}

export interface IAttachment {
  type: "image" | "document" | "audio" | "video";
  url: string;
  name?: string;
  size?: number;
  thumbnail?: string;
}

// Chat conversation type
export interface IConversation {
  _id: string;
  contact: IContact;
  lastMessage: IMessage;
  unreadCount: number;
  whatsappNumber: string;
  tags?: string[];
  status: "active" | "archived" | "pending";
  assignedTo?: string;
}

// Contact type
export interface IContact {
  _id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  email?: string;
  company?: string;
  isBusinessAccount?: boolean;
  lastActivity?: string;
}

// WhatsApp account type
export interface IWhatsAppAccount {
  _id: string;
  phoneNumber: string;
  name: string;
  status: "connected" | "disconnecting" | "disconnected";
  businessName?: string;
  profileImage?: string;
  messagesPerDay: number;
  messagesTotal: number;
}

// Template message type
export interface ITemplate {
  _id: string;
  name: string;
  content: string;
  variables: string[];
  category: "marketing" | "customer_service" | "utility";
  status: "approved" | "pending" | "rejected";
  language: string;
}

// Update tag colors
const tagColors = {
  "lead": { 
    light: { bg: "#DCF8C6", text: "#128C7E" },
    dark: { bg: "#2A3942", text: "#E9EDEF" }
  },
  "client": { 
    light: { bg: "#E7F3D4", text: "#128C7E" },
    dark: { bg: "#2A3942", text: "#E9EDEF" }
  },
  "urgent": { 
    light: { bg: "#FFD8D6", text: "#128C7E" },
    dark: { bg: "#422A2A", text: "#E9EDEF" }
  },
  "follow-up": { 
    light: { bg: "#FFF0D4", text: "#128C7E" },
    dark: { bg: "#423A2A", text: "#E9EDEF" }
  },
  "support": { 
    light: { bg: "#E7D4F3", text: "#128C7E" },
    dark: { bg: "#372A42", text: "#E9EDEF" }
  },
};

// Update template categories
const templateCategories = {
  "marketing": { 
    light: { color: "#DCF8C6", gradient: "from-[#128C7E] to-[#25D366]" },
    dark: { color: "#005C4B", gradient: "from-[#005C4B] to-[#00A884]" }
  },
  "customer_service": { 
    light: { color: "#E7F3D4", gradient: "from-[#128C7E] to-[#25D366]" },
    dark: { color: "#2A3942", gradient: "from-[#2A3942] to-[#00A884]" }
  },
  "utility": { 
    light: { color: "#BFDDF9", gradient: "from-[#128C7E] to-[#25D366]" },
    dark: { color: "#2A3942", gradient: "from-[#005C4B] to-[#00A884]" }
  },
};

// // WhatsApp color schemes
// const colors = {
//   light: {
//     primary: "#128C7E",     // WhatsApp primary green
//     secondary: "#25D366",   // WhatsApp lighter green
//     accent: "#DCF8C6",      // WhatsApp light green (message bubbles)
//     background: "#F0F2F5",  // WhatsApp light background
//     surface: "#FFFFFF",     // White surface
//     border: "#E2E8F0",      // Light borders
//     text: "#111B21",        // Dark text
//     textSecondary: "#54656F" // Secondary text
//   },
//   dark: {
//     primary: "#00A884",     // WhatsApp dark mode green
//     secondary: "#00A884",   // Same green for consistency
//     accent: "#2A3942",      // Dark mode chat bubble
//     background: "#111B21",  // WhatsApp dark background
//     surface: "#1F2C34",     // Dark surface
//     border: "#2A3942",      // Dark borders
//     text: "#E9EDEF",        // Light text
//     textSecondary: "#8696A0" // Secondary text
//   }
// };

// Theme provider component
import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('whatsapp-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('whatsapp-theme', !isDarkMode ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
const useTheme = () => useContext(ThemeContext);

export default function WhatsAppPage() {
  // States for the WhatsApp integration
  const [whatsappAccounts, setWhatsAppAccounts] = useState<IWhatsAppAccount[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  // const theme = isDarkMode ? colors.dark : colors.light;

  // Modal states
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState<boolean>(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState<boolean>(false);

  // Stats
  const [stats, setStats] = useState({
    totalMessages: 0,
    todayMessages: 0,
    responseRate: 0,
    avgResponseTime: 0
  });

  // Fetch WhatsApp accounts and conversations
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Mock fetching WhatsApp accounts
        // In a real implementation, this would be an API call
        const mockAccounts: IWhatsAppAccount[] = [
          {
            _id: "1",
            phoneNumber: "+33123456789",
            name: "Support Principal",
            status: "connected",
            businessName: "Votre Entreprise",
            profileImage: "https://ui-avatars.com/api/?name=Support&background=213f5b&color=fff",
            messagesPerDay: 128,
            messagesTotal: 3240
          },
          {
            _id: "2",
            phoneNumber: "+33987654321",
            name: "Service Commercial",
            status: "connected",
            businessName: "Votre Entreprise",
            profileImage: "https://ui-avatars.com/api/?name=Commercial&background=2cb67d&color=fff",
            messagesPerDay: 85,
            messagesTotal: 1870
          },
          {
            _id: "3",
            phoneNumber: "+33678901234",
            name: "Service Technique",
            status: "disconnected",
            businessName: "Votre Entreprise",
            profileImage: "https://ui-avatars.com/api/?name=Technique&background=7f5af0&color=fff",
            messagesPerDay: 0,
            messagesTotal: 960
          }
        ];
        
        // Mock fetching conversations
        // Mock fetching conversations
        const mockConversations: IConversation[] = Array.from({ length: 25 }, (_, i) => {
          const tags = ["lead", "client", "urgent", "follow-up", "support"];
          // Remove unused variable
          const randomTags: string[] = [];
          const tagCount = Math.floor(Math.random() * 3);
          
          for (let j = 0; j < tagCount; j++) {
            const tag = tags[Math.floor(Math.random() * tags.length)];
            if (!randomTags.includes(tag)) {
              randomTags.push(tag);
            }
          }
          
          const account = mockAccounts[Math.floor(Math.random() * mockAccounts.length)];
          
          // Define valid conversation statuses
          const conversationStatuses: ("active" | "archived" | "pending")[] = ["active", "archived", "pending"];
          
          return {
            _id: `conv_${i}`,
            contact: {
              _id: `contact_${i}`,
              name: `Contact ${i + 1}`,
              phoneNumber: `+336789012${i.toString().padStart(2, '0')}`,
              profilePicture: `https://i.pravatar.cc/150?img=${i + 10}`,
              isBusinessAccount: Math.random() > 0.7,
              lastActivity: new Date(Date.now() - Math.random() * 10000000000).toISOString()
            },
            lastMessage: {
              _id: `msg_last_${i}`,
              content: `Dernier message de la conversation ${i + 1}. ${Math.random() > 0.5 ? "Bonjour, j'ai une question concernant votre service..." : "Merci pour votre réponse rapide !"}`,
              timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
              status: ["sent", "delivered", "read"][Math.floor(Math.random() * 3)] as "sending" | "sent" | "delivered" | "read" | "failed",
              sender: Math.random() > 0.5 ? `contact_${i}` : "me",
              isIncoming: Math.random() > 0.5,
            },
            unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
            whatsappNumber: account.phoneNumber,
            tags: randomTags,
            // Fix: Use appropriate conversation status instead of message status
            status: conversationStatuses[Math.floor(Math.random() * conversationStatuses.length)]
          };
        });
        
        // Mock templates
        const mockTemplates: ITemplate[] = [
          {
            _id: "template_1",
            name: "Accueil client",
            content: "Bonjour {{1}}, merci de nous avoir contacté ! Un conseiller vous répondra dans les plus brefs délais.",
            variables: ["nom_client"],
            category: "customer_service",
            status: "approved",
            language: "fr"
          },
          {
            _id: "template_2",
            name: "Confirmation commande",
            content: "Votre commande #{{1}} d'un montant de {{2}}€ a été confirmée. Livraison prévue le {{3}}.",
            variables: ["numero_commande", "montant", "date_livraison"],
            category: "utility",
            status: "approved",
            language: "fr"
          },
          {
            _id: "template_3",
            name: "Promotion mensuelle",
            content: "Offre exclusive pour vous, {{1}} ! Bénéficiez de {{2}}% de réduction sur notre gamme {{3}} jusqu'au {{4}}.",
            variables: ["nom_client", "pourcentage", "gamme_produit", "date_fin"],
            category: "marketing",
            status: "approved",
            language: "fr"
          }
        ];
        
        // Calculate stats
        const mockStats = {
          totalMessages: 5120,
          todayMessages: 423,
          responseRate: 92,
          avgResponseTime: 8
        };
        
        // Sort conversations by last message timestamp, newest first
        mockConversations.sort((a, b) => 
          new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        );
        
        setWhatsAppAccounts(mockAccounts);
        setConversations(mockConversations);
        setTemplates(mockTemplates);
        setStats(mockStats);
        
        if (mockAccounts.length > 0) {
          setSelectedAccount(mockAccounts[0]._id);
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

  // Generate mock messages when a conversation is selected
useEffect(() => {
  if (selectedConversation) {
    // In a real implementation, this would be an API call to get messages
    const mockMessages: IMessage[] = Array.from({ length: 15 }, (_, i) => {
      const isIncoming = Math.random() > 0.4;
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
      date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
      
      // Define a type for message status
      type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
      const possibleStatuses: MessageStatus[] = ["sent", "delivered", "read"];
      
      // More realistic conversation flow
      return {
        _id: `msg_${i}`,
        content: getMessageContent(i, isIncoming),
        timestamp: date.toISOString(),
        status: isIncoming ? "read" : possibleStatuses[Math.floor(Math.random() * 3)],
        sender: isIncoming ? selectedConversation.contact._id : "me",
        isIncoming: isIncoming,
        attachments: Math.random() > 0.8 ? getRandomAttachments() : undefined
      };
    });
    
    // Sort messages by timestamp
    mockMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    setMessages(mockMessages);
    
    // Mark conversation as read when selected
    setConversations(prev => 
      prev.map(c => 
        c._id === selectedConversation._id ? {...c, unreadCount: 0} : c
      )
    );
  }
}, [selectedConversation]);

  // Auto scroll to bottom of message list when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to generate random message content
  function getMessageContent(index: number, isIncoming: boolean) {
    const incomingMessages = [
      "Bonjour, je souhaiterais avoir des informations sur vos services.",
      "Est-ce que vous proposez des devis gratuits ?",
      "Quel est le délai de livraison pour une commande passée aujourd'hui ?",
      "Merci beaucoup pour ces précisions !",
      "Avez-vous un catalogue que je pourrais consulter ?",
      "Je voudrais prendre rendez-vous avec un de vos conseillers.",
      "Quelle est votre adresse exacte ?",
      "Vos prix sont-ils négociables pour les commandes en grande quantité ?",
      "Parfait, je vous remercie pour votre aide."
    ];
    
    const outgoingMessages = [
      "Bonjour ! Bien sûr, je serais ravi de vous renseigner. Que souhaitez-vous savoir exactement ?",
      "Absolument, nous proposons des devis personnalisés et gratuits sans engagement.",
      "Pour une commande passée aujourd'hui, le délai de livraison est de 3 à 5 jours ouvrés.",
      "Je vous en prie, n'hésitez pas si vous avez d'autres questions !",
      "Oui, je peux vous envoyer notre catalogue par email. Pouvez-vous me communiquer votre adresse email ?",
      "Bien sûr, quand seriez-vous disponible ? Nous avons des créneaux lundi et mardi prochain.",
      "Notre adresse est 123 Avenue de la République, 75011 Paris.",
      "Tout à fait, nous offrons des remises à partir de 10 unités. Je peux vous faire une simulation si vous le souhaitez.",
      "C'est avec plaisir ! Nous restons à votre disposition pour toute information complémentaire."
    ];
    
    // Make conversation flow more natural
    if (index < 2) {
      return isIncoming ? incomingMessages[0] : outgoingMessages[0];
    }
    
    return isIncoming 
      ? incomingMessages[index % incomingMessages.length] 
      : outgoingMessages[index % outgoingMessages.length];
  }

  // Helper function to generate random attachments
  function getRandomAttachments(): IAttachment[] {
    const types = ["image", "document", "audio", "video"];
    const randomType = types[Math.floor(Math.random() * types.length)] as "image" | "document" | "audio" | "video";
    
    const attachments: IAttachment[] = [{
      type: randomType,
      url: "#",
      name: randomType === "document" ? "document_" + Math.floor(Math.random() * 1000) + ".pdf" : undefined,
      size: Math.floor(Math.random() * 5000000),
      thumbnail: randomType === "image" ? `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300` : undefined
    }];
    
    return attachments;
  }

  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMsg: IMessage = {
      _id: `msg_new_${Date.now()}`,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: "sending",
      sender: "me",
      isIncoming: false
    };
    
    // Add message to the messages array
    setMessages(prev => [...prev, newMsg]);
    
    // Clear the input
    setNewMessage("");
    
    // Update conversation with new last message
    setConversations(prev => 
      prev.map(c => 
        c._id === selectedConversation._id 
          ? {
              ...c, 
              lastMessage: newMsg
            } 
          : c
      )
    );
    
    // Simulate message being sent (status changes)
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m._id === newMsg._id ? {...m, status: "sent"} : m
        )
      );
      
      setConversations(prev => 
        prev.map(c => 
          c._id === selectedConversation._id && c.lastMessage._id === newMsg._id
            ? {
                ...c, 
                lastMessage: {...c.lastMessage, status: "sent"}
              } 
            : c
        )
      );
      
      // Simulate delivered status after 2 seconds
      setTimeout(() => {
        setMessages(prev => 
          prev.map(m => 
            m._id === newMsg._id ? {...m, status: "delivered"} : m
          )
        );
        
        setConversations(prev => 
          prev.map(c => 
            c._id === selectedConversation._id && c.lastMessage._id === newMsg._id
              ? {
                  ...c, 
                  lastMessage: {...c.lastMessage, status: "delivered"}
                } 
              : c
          )
        );
        
        // Simulate read status after 4 seconds
        setTimeout(() => {
          setMessages(prev => 
            prev.map(m => 
              m._id === newMsg._id ? {...m, status: "read"} : m
            )
          );
          
          setConversations(prev => 
            prev.map(c => 
              c._id === selectedConversation._id && c.lastMessage._id === newMsg._id
                ? {
                    ...c, 
                    lastMessage: {...c.lastMessage, status: "read"}
                  } 
                : c
            )
          );
        }, 2000);
      }, 2000);
    }, 1000);
  };

  // Filter conversations based on search, account, and filter selections
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        conversation.contact.phoneNumber.includes(searchTerm) ||
                        conversation.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccount = !selectedAccount || conversation.whatsappNumber === whatsappAccounts.find(a => a._id === selectedAccount)?.phoneNumber;
    
    const matchesStatus = !statusFilter || conversation.status === statusFilter;
    
    const matchesTag = !tagFilter || (conversation.tags && conversation.tags.includes(tagFilter));
    
    return matchesSearch && matchesAccount && matchesStatus && matchesTag;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTagFilter("");
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
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

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <ClockIcon className="h-3 w-3 text-gray-400" />;
      case "sent":
        return <CheckIcon className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <div className="flex"><CheckIcon className="h-3 w-3 text-gray-400" /><CheckIcon className="h-3 w-3 text-gray-400 -ml-1" /></div>;
      case "read":
        return <div className="flex"><CheckIcon className="h-3 w-3 text-blue-500" /><CheckIcon className="h-3 w-3 text-blue-500 -ml-1" /></div>;
      case "failed":
        return <XMarkIcon className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className={`flex h-screen ${isDarkMode ? 'bg-gradient-to-b from-[#111B21] to-[#1F2C34]' : 'bg-gradient-to-b from-[#F0F2F5] to-[#E4F2E7]'}`}>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            <Header />

          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="max-w-full h-full flex flex-col">
              {/* Dashboard Header with Stats */}
              <div className={`${isDarkMode ? 'bg-[#1F2C34] border-[#2A3942]' : 'bg-white border-[#E2E8F0]'} border-b px-4 sm:px-6 lg:px-8 py-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                  <div className="relative">
                    <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#25D366] to-[#128C7E] rounded-full"></div>
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-[#00A884] to-[#25D366]' : 'from-[#128C7E] to-[#25D366]'} mb-1 pl-2`}>WhatsApp Business</h1>
                    <p className={`${isDarkMode ? 'text-[#E9EDEF] opacity-90' : 'text-[#128C7E] opacity-90'} pl-2`}>Gérez vos conversations WhatsApp depuis votre CRM</p>
                    <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#128C7E] opacity-10 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateTemplateModalOpen(true)}
                      className={`${isDarkMode ? 'border-[#00A884] text-[#E9EDEF] hover:bg-[#2A3942]' : 'border-[#25D366] text-[#128C7E] hover:bg-[#F0F7F6]'} transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow`}
                    >
                      <SquaresPlusIcon className="h-4 w-4 mr-2" />
                      Créer un template
                    </Button>
                    <Button
                      onClick={() => setIsAddAccountModalOpen(true)}
                      className={`${isDarkMode ? 'bg-gradient-to-r from-[#00A884] to-[#128C7E] hover:from-[#009670] hover:to-[#096C5B]' : 'bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:from-[#0E6C63] hover:to-[#1DB954]'} text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg`}
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
                    className={`${isDarkMode ? 'bg-[#1F2C34] border-[#2A3942]' : 'bg-white border-[#E2E8F0]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#25D366] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#128C7E] to-[#25D366] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#25D366] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} font-medium`}>Total messages</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} mt-1`}>{stats.totalMessages.toLocaleString()}</p>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-60'} mt-1`}>sur tous les comptes</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#128C7E] to-[#25D366] shadow-lg shadow-green-200">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#1F2C34] border-[#2A3942]' : 'bg-white border-[#E2E8F0]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#25D366] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#128C7E] to-[#25D366] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#25D366] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} font-medium`}>Messages aujourd&apos;hui</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} mt-1`}>{stats.todayMessages}</p>
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+12%</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-60'} mt-1`}>depuis hier</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#128C7E] to-[#25D366] shadow-lg shadow-green-200">
                        <ArchiveBoxIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#1F2C34] border-[#2A3942]' : 'bg-white border-[#E2E8F0]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#25D366] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#128C7E] to-[#25D366] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#25D366] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} font-medium`}>Taux de réponse</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} mt-1`}>{stats.responseRate}%</p>
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Excellent</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-60'} mt-1`}>messages clients traités</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#128C7E] to-[#25D366] shadow-lg shadow-green-200">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#1F2C34] border-[#2A3942]' : 'bg-white border-[#E2E8F0]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#25D366] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#128C7E] to-[#25D366] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#25D366] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} font-medium`}>Temps de réponse</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} mt-1`}>{stats.avgResponseTime} <span className="text-lg font-medium">min</span></p>
                          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Moyen</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-60'} mt-1`}>temps moyen</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#128C7E] to-[#25D366] shadow-lg shadow-green-200">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Main Content - WhatsApp Interface */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - WhatsApp Account Selection & Conversations List */}
                <div className={`w-full md:w-96 border-r ${isDarkMode ? 'border-[#2A3942] bg-[#1F2C34]' : 'border-[#E2E8F0] bg-white'} flex flex-col`}>
                  {/* Account selector and search */}
                  <div className={`p-4 border-b ${isDarkMode ? 'border-[#2A3942]' : 'border-[#E2E8F0]'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <select
                        value={selectedAccount || ""}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className={`flex-1 ${isDarkMode ? 'bg-[#2A3942] border-[#2A3942] text-[#E9EDEF] focus:ring-[#00A884] focus:border-[#00A884]' : 'bg-[#F0F2F5] border-[#E2E8F0] text-[#128C7E] focus:ring-[#25D366] focus:border-[#25D366]'} rounded-lg text-sm`}
                      >
                        {whatsappAccounts.map(account => (
                          <option key={account._id} value={account._id} disabled={account.status === "disconnected"}>
                            {account.name} ({account.phoneNumber}) 
                            {account.status === "disconnected" ? " - Déconnecté" : ""}
                          </option>
                        ))}
                      </select>
                      
                      <Button
                        variant="ghost"
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#E9EDEF] hover:bg-[#2A3942]' : 'text-[#128C7E] hover:bg-[#F0F2F5]'}`}
                        onClick={() => setIsAddContactModalOpen(true)}
                      >
                        <UserPlusIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-50'}`} />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher une conversation..."
                        className={`pl-10 pr-10 py-2.5 w-full rounded-lg ${
                          isDarkMode 
                            ? 'border-[#2A3942] bg-[#2A3942] text-[#E9EDEF] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]' 
                            : 'border-[#E2E8F0] bg-[#F0F2F5] text-[#128C7E] focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]'
                        } text-sm`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm("")}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-[#128C7E] hover:text-[#0E6C63]'}`}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className={`flex items-center gap-1 text-xs ${
                          isDarkMode 
                            ? 'text-[#E9EDEF] border-[#2A3942] hover:border-[#00A884] hover:bg-[#2A3942]' 
                            : 'text-[#128C7E] border-[#E2E8F0] hover:border-[#25D366] hover:bg-[#F0F2F5]'
                        } rounded-lg py-1.5 px-3 shadow-sm transition-all`}
                      >
                        <FunnelIcon className="h-3 w-3" />
                        <span>Filtres</span>
                        {(statusFilter || tagFilter) && (
                          <span className={`flex items-center justify-center h-4 w-4 ${
                            isDarkMode ? 'bg-[#00A884] text-[#1F2C34]' : 'bg-[#25D366] text-[#FFFFFF]'
                          } text-xs font-medium rounded-full`}>
                            {(statusFilter ? 1 : 0) + (tagFilter ? 1 : 0)}
                          </span>
                        )}
                      </Button>
                      
                      {/* Quick filters */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                        <Button
                          variant={statusFilter === "active" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setStatusFilter(statusFilter === "active" ? "" : "active")}
                          className={`text-xs rounded-lg py-1.5 px-3 whitespace-nowrap ${
                            statusFilter === "active" 
                              ? isDarkMode ? "bg-[#00A884] text-[#1F2C34]" : "bg-[#128C7E] text-white"
                              : isDarkMode 
                                ? "border-[#2A3942] text-[#E9EDEF] hover:border-[#00A884]" 
                                : "border-[#E2E8F0] text-[#128C7E] hover:border-[#25D366]"
                          }`}
                        >
                          Actives
                        </Button>
                        <Button
                          variant={statusFilter === "pending" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setStatusFilter(statusFilter === "pending" ? "" : "pending")}
                          className={`text-xs rounded-lg py-1.5 px-3 whitespace-nowrap ${
                            statusFilter === "pending" 
                              ? isDarkMode ? "bg-[#00A884] text-[#1F2C34]" : "bg-[#128C7E] text-white"
                              : isDarkMode 
                                ? "border-[#2A3942] text-[#E9EDEF] hover:border-[#00A884]" 
                                : "border-[#E2E8F0] text-[#128C7E] hover:border-[#25D366]"
                          }`}
                        >
                          Non lues
                        </Button>
                        <Button
                          variant={statusFilter === "archived" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setStatusFilter(statusFilter === "archived" ? "" : "archived")}
                          className={`text-xs rounded-lg py-1.5 px-3 whitespace-nowrap ${
                            statusFilter === "archived" 
                              ? isDarkMode ? "bg-[#00A884] text-[#1F2C34]" : "bg-[#128C7E] text-white"
                              : isDarkMode 
                                ? "border-[#2A3942] text-[#E9EDEF] hover:border-[#00A884]" 
                                : "border-[#E2E8F0] text-[#128C7E] hover:border-[#25D366]"
                          }`}
                        >
                          Archivées
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
                          <div className={`pt-3 border-t ${isDarkMode ? 'border-[#2A3942]' : 'border-[#E2E8F0]'}`}>
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <label className={`block text-xs font-medium ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} mb-1`}>Étiquettes</label>
                                <select
                                  value={tagFilter}
                                  onChange={(e) => setTagFilter(e.target.value)}
                                  className={`w-full rounded-lg ${
                                    isDarkMode 
                                      ? 'border-[#2A3942] bg-[#2A3942] text-[#E9EDEF] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]'
                                      : 'border-[#E2E8F0] bg-[#F0F2F5] text-[#128C7E] focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]'
                                  } text-sm`}
                                >
                                  <option value="">Toutes les étiquettes</option>
                                  {Object.keys(tagColors).map((tag) => (
                                    <option key={tag} value={tag}>
                                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            {(statusFilter || tagFilter) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={clearFilters}
                                className={`mt-2 ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-[#128C7E] hover:text-[#0E6C63]'} text-xs`}
                              >
                                Effacer les filtres
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Conversations List */}
                  <div className="flex-1 overflow-y-auto">
                    {loading ? (
                      <div className="flex flex-col justify-center items-center p-12">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-[#00A884] to-[#128C7E]' : 'from-[#128C7E] to-[#25D366]'} rounded-full blur opacity-30 animate-pulse`}></div>
                          <div className={`relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkMode ? 'border-[#00A884]' : 'border-[#128C7E]'}`}></div>
                        </div>
                        <p className={`mt-4 ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} animate-pulse`}>Chargement des conversations...</p>
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
                    ) : filteredConversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="relative mx-auto mb-6 w-20 h-20">
                          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#25D366]'} opacity-20 rounded-full animate-pulse`}></div>
                          <ChatBubbleLeftRightIcon className={`h-20 w-20 ${isDarkMode ? 'text-[#00A884]' : 'text-[#25D366]'} opacity-60`} />
                        </div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} mb-2`}>Aucune conversation</h3>
                        <p className={`${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-75'} mb-4`}>Aucune conversation ne correspond à vos critères de recherche.</p>
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className={`${
                            isDarkMode 
                              ? 'border-[#00A884] bg-[#1F2C34] text-[#E9EDEF] hover:bg-[#2A3942]' 
                              : 'border-[#25D366] bg-white text-[#128C7E] hover:bg-[#F0F7F6]'
                          } transition-all rounded-lg py-2 px-4`}
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      </div>
                    ) : (
                      <div className={`divide-y ${isDarkMode ? 'divide-[#2A3942]' : 'divide-[#F0F2F5]'}`}>
                        {filteredConversations.map((conversation, index) => (
                          <motion.div
                            key={conversation._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            className={`cursor-pointer transition-colors p-3 ${
                              selectedConversation?._id === conversation._id 
                                ? isDarkMode ? 'bg-[#2A3942]' : 'bg-[#F0F7F6]' 
                                : isDarkMode ? 'hover:bg-[#2A3942]' : 'hover:bg-[#F0F2F5]'
                            }`}
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="relative">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border-2 ${conversation.unreadCount > 0 ? isDarkMode ? 'border-[#00A884]' : 'border-[#25D366]' : 'border-transparent'}`}>
                                  {conversation.contact.profilePicture ? (
                                    <img 
                                      src={conversation.contact.profilePicture} 
                                      alt={conversation.contact.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className={`h-full w-full ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#128C7E]'} flex items-center justify-center text-white font-bold text-lg`}>
                                      {conversation.contact.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                {conversation.contact.isBusinessAccount && (
                                  <div className={`absolute -right-1 -bottom-1 ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#128C7E]'} text-white rounded-full p-1`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'} truncate pr-2`}>{conversation.contact.name}</h3>
                                  <span className={`text-xs flex items-center whitespace-nowrap font-medium ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F]'}`}>
                                    {formatTime(conversation.lastMessage.timestamp)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1 mt-0.5">
                                  {!conversation.lastMessage.isIncoming && getStatusIcon(conversation.lastMessage.status)}
                                  <p className={`text-sm ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F]'} truncate`}>
                                    {!conversation.lastMessage.isIncoming && "Vous: "}
                                    {conversation.lastMessage.content}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between mt-1.5">
                                  <div className="flex gap-1 flex-wrap max-w-[170px]">
                                    {conversation.tags && conversation.tags.map(tag => (
                                      <span 
                                        key={tag} 
                                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium truncate max-w-[80px]"
                                        style={{ 
                                          backgroundColor: isDarkMode 
                                            ? tagColors[tag as keyof typeof tagColors]?.dark?.bg || '#2A3942'
                                            : tagColors[tag as keyof typeof tagColors]?.light?.bg || '#E0F2E9',
                                          color: isDarkMode 
                                            ? tagColors[tag as keyof typeof tagColors]?.dark?.text || '#E9EDEF'
                                            : tagColors[tag as keyof typeof tagColors]?.light?.text || '#128C7E'
                                        }}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  {conversation.unreadCount > 0 && (
                                    <span className={`flex items-center justify-center h-5 w-5 ${
                                      isDarkMode ? 'bg-[#00A884] text-[#1F2C34]' : 'bg-[#25D366] text-white'
                                    } text-xs font-bold rounded-full`}>
                                      {conversation.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Panel - Chat View */}
                <div className={`hidden md:flex flex-1 flex-col ${isDarkMode ? 'bg-[#0B141A]' : 'bg-[#F0F2F5]'}`}>
                  {selectedConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className={`p-4 border-b ${isDarkMode ? 'border-[#2A3942] bg-[#1F2C34]' : 'border-[#E2E8F0] bg-white'} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            {selectedConversation.contact.profilePicture ? (
                              <img 
                                src={selectedConversation.contact.profilePicture} 
                                alt={selectedConversation.contact.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className={`h-full w-full ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#128C7E]'} flex items-center justify-center text-white font-bold`}>
                                {selectedConversation.contact.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'}`}>{selectedConversation.contact.name}</h3>
                              {selectedConversation.contact.isBusinessAccount && (
                                <span className={`${isDarkMode ? 'bg-[#2A3942] text-[#8696A0]' : 'bg-[#F0F2F5] text-[#128C7E]'} text-xs rounded-full px-2 py-0.5`}>
                                  Business
                                </span>
                              )}
                            </div>
                            <p className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-75'}`}>
                              {selectedConversation.contact.phoneNumber}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#E9EDEF] hover:bg-[#2A3942]' : 'text-[#128C7E] hover:bg-[#F0F2F5]'}`}
                          >
                            <PhoneIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#E9EDEF] hover:bg-[#2A3942]' : 'text-[#128C7E] hover:bg-[#F0F2F5]'}`}
                          >
                            <MagnifyingGlassIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#E9EDEF] hover:bg-[#2A3942]' : 'text-[#128C7E] hover:bg-[#F0F2F5]'}`}
                          >
                            <EllipsisHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div 
                        className="flex-1 overflow-y-auto p-4 md:p-6"
                        style={{ 
                          backgroundImage: isDarkMode 
                            ? 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%232A3942\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' 
                            : 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23128C7E\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                        }}
                      >
                        {messages.map((message) => (
                          <div 
                            key={message._id}
                            className={`mb-3 flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-2xl p-3 ${
                                message.isIncoming 
                                  ? isDarkMode 
                                    ? 'bg-[#2A3942] rounded-tl-none text-[#E9EDEF]' 
                                    : 'bg-white border border-[#E2E8F0] rounded-tl-none text-[#111B21]' 
                                  : isDarkMode
                                    ? 'bg-[#005C4B] rounded-tr-none text-[#E9EDEF]'
                                    : 'bg-[#DCF8C6] rounded-tr-none text-[#111B21]'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              
                              {/* Attachments */}
                              {message.attachments && message.attachments.map((attachment, i) => (
                                <div key={i} className="mt-2">
                                  {attachment.type === 'image' && (
                                    <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'border-[#2A3942]' : 'border border-[#E2E8F0]'}`}>
                                      <img 
                                        src={attachment.thumbnail || "#"} 
                                        alt="attachment" 
                                        className="w-full object-cover max-h-48"
                                      />
                                    </div>
                                  )}
                                  
                                  {attachment.type === 'document' && (
                                    <div className={`flex items-center gap-2 ${
                                      isDarkMode ? 'bg-[#2A3942] border-[#2A3942]' : 'bg-[#F0F2F5] border border-[#E2E8F0]'
                                    } p-2 rounded-lg`}>
                                      <DocumentIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'}`} />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-medium truncate ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'}`}>{attachment.name}</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'opacity-60'}`}>{Math.round(attachment.size! / 1024)} KB</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {attachment.type === 'audio' && (
                                    <div className={`flex items-center gap-2 ${
                                      isDarkMode ? 'bg-[#2A3942] border-[#2A3942]' : 'bg-[#F0F2F5] border border-[#E2E8F0]'
                                    } p-2 rounded-lg`}>
                                      <div className={`h-8 w-8 rounded-full ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#25D366]'} flex items-center justify-center`}>
                                        <MicrophoneIcon className="h-4 w-4 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <div className={`h-1 ${isDarkMode ? 'bg-[#1F2C34]' : 'bg-[#E2E8F0]'} rounded-full`}>
                                          <div className={`h-full w-1/3 ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#128C7E]'} rounded-full`}></div>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                          <span className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F]'}`}>0:12</span>
                                          <span className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F]'}`}>0:36</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className={`text-[10px] ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F] opacity-60'}`}>
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {!message.isIncoming && getStatusIcon(message.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      {/* Template Messages Panel */}
                      <AnimatePresence>
                        {isTemplateVisible && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`border-t ${isDarkMode ? 'border-[#2A3942] bg-[#1F2C34]' : 'border-[#E2E8F0] bg-white'} overflow-hidden`}
                          >
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'}`}>Messages rapides</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsTemplateVisible(false)}
                                  className="h-6 w-6 rounded-full"
                                >
                                  <XMarkIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F]'}`} />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
                                {templates.map(template => (
                                  <motion.div
                                    key={template._id}
                                    className={`p-2 rounded-lg ${
                                      isDarkMode 
                                        ? 'border-[#2A3942] hover:border-[#00A884]' 
                                        : 'border border-[#E2E8F0] hover:border-[#25D366]'
                                    } cursor-pointer transition-colors`}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => {
                                      setNewMessage(template.content.replace(/{{[^}]+}}/g, '___'));
                                      setIsTemplateVisible(false);
                                    }}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="rounded-md p-1.5"
                                        style={{ 
                                          backgroundColor: isDarkMode 
                                            ? templateCategories[template.category]?.dark?.color || '#2A3942' 
                                            : templateCategories[template.category]?.light?.color || '#DCF8C6'
                                        }}
                                      >
                                        <SquaresPlusIcon className={`h-3.5 w-3.5 ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'}`} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <h5 className={`text-xs font-medium ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} truncate`}>{template.name}</h5>
                                          <span className={`text-[10px] ${
                                            isDarkMode ? 'bg-[#2A3942] text-[#8696A0]' : 'bg-[#F0F2F5] text-[#128C7E]'
                                          } rounded-full px-1.5 py-0.5`}>
                                            {template.status}
                                          </span>
                                        </div>
                                        <p className={`text-xs ${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-75'} line-clamp-2 mt-0.5`}>
                                          {template.content}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Input Area */}
                      <div className={`border-t ${isDarkMode ? 'border-[#2A3942] bg-[#1F2C34]' : 'border-[#E2E8F0] bg-white'} p-3`}>
                        <div className="flex items-end gap-2">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              className={`h-9 w-9 rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#8696A0] hover:bg-[#2A3942]' : 'text-[#128C7E] hover:bg-[#F0F2F5]'}`}
                              onClick={() => setIsTemplateVisible(!isTemplateVisible)}
                            >
                              <SquaresPlusIcon className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              className={`h-9 w-9 rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#8696A0] hover:bg-[#2A3942]' : 'text-[#128C7E] hover:bg-[#F0F2F5]'}`}
                            >
                              <PhotoIcon className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              className={`h-9 w-9 rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#8696A0] hover:bg-[#2A3942]' : 'text-[#128C7E] hover:bg-[#F0F2F5]'}`}
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                              <FaceSmileIcon className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <div className="flex-1 relative">
                            <textarea
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Tapez un message..."
                              className={`w-full rounded-2xl ${
                                isDarkMode 
                                  ? 'border-[#2A3942] bg-[#2A3942] text-[#E9EDEF] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]' 
                                  : 'border-[#E2E8F0] bg-[#F0F2F5] text-[#111B21] focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]'
                              } min-h-[44px] max-h-[120px] py-2.5 px-4 resize-none text-sm`}
                              rows={1}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                            />
                          </div>
                          
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className={`h-9 w-9 rounded-full flex items-center justify-center text-white ${
                              newMessage.trim() 
                                ? 'bg-[#00A884] hover:bg-[#128C7E]' 
                                : isDarkMode ? 'bg-[#2A3942] cursor-not-allowed' : 'bg-[#E2E8F0] cursor-not-allowed'
                            }`}
                          >
                            <PaperAirplaneIcon className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        {/* Emoji Picker (simplified) */}
                        <AnimatePresence>
                          {showEmojiPicker && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className={`mt-2 ${
                                isDarkMode ? 'border-[#2A3942] bg-[#1F2C34]' : 'border border-[#E2E8F0] bg-white'
                              } rounded-lg shadow-lg overflow-hidden`}
                            >
                              <div className="p-2">
                                <div className="grid grid-cols-8 gap-1">
                                  {["😀", "😂", "😍", "😎", "🤔", "😊", "👍", "👌", "🎉", "❤️", "🔥", "👏", "💯", "🙏", "🤦‍♂️", "🤷‍♀️"].map((emoji, index) => (
                                    <button
                                      key={index}
                                      className={`h-8 w-8 ${isDarkMode ? 'hover:bg-[#2A3942]' : 'hover:bg-[#F0F2F5]'} rounded text-xl`}
                                      onClick={() => {
                                        setNewMessage(prev => prev + emoji);
                                        setShowEmojiPicker(false);
                                      }}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    // Empty state when no conversation is selected
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative w-32 h-32 mb-6">
                        <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#25D366]'} opacity-20 rounded-full animate-pulse`}></div>
                        <ChatBubbleLeftRightIcon className={`w-32 h-32 ${isDarkMode ? 'text-[#00A884]' : 'text-[#25D366]'} opacity-50`} />
                      </div>
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#128C7E]'} mb-2`}>WhatsApp Business</h2>
                      <p className={`${isDarkMode ? 'text-[#8696A0]' : 'text-[#128C7E] opacity-75'} max-w-md text-center mb-6`}>
                        Sélectionnez une conversation pour commencer à échanger des messages avec vos contacts directement depuis votre CRM.
                      </p>
                      <Button
                        onClick={() => setIsAddContactModalOpen(true)}
                        className={`${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-[#00A884] to-[#128C7E] hover:from-[#009670] hover:to-[#096C5B]' 
                            : 'bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:from-[#0E6C63] hover:to-[#1DB954]'
                        } text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg`}
                      >
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Nouvelle conversation
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
            <AddWhatsAppAccountModal
              isOpen={isAddAccountModalOpen}
              onClose={() => setIsAddAccountModalOpen(false)}
              onAccountAdded={(newAccount) => {
                setWhatsAppAccounts(prev => [...prev, newAccount]);
              }}
            />
          )}
          
          {isCreateTemplateModalOpen && (
            <CreateTemplateModal
              isOpen={isCreateTemplateModalOpen}
              onClose={() => setIsCreateTemplateModalOpen(false)}
              onTemplateCreated={(newTemplate) => {
                setTemplates(prev => [...prev, newTemplate]);
              }}
            />
          )}
          
          {isAddContactModalOpen && (
            <AddContactToWhatsAppModal
              isOpen={isAddContactModalOpen}
              accounts={whatsappAccounts.filter(a => a.status === 'connected')}
              onClose={() => setIsAddContactModalOpen(false)}
              onContactAdded={(newContact, accountId) => {
                const account = whatsappAccounts.find(a => a._id === accountId);
                if (account) {
                  const newConversation: IConversation = {
                    _id: `conv_new_${Date.now()}`,
                    contact: newContact,
                    lastMessage: {
                      _id: `msg_welcome_${Date.now()}`,
                      content: "Bienvenue ! Comment puis-je vous aider ?",
                      timestamp: new Date().toISOString(),
                      status: "sent",
                      sender: "me",
                      isIncoming: false,
                    },
                    unreadCount: 0,
                    whatsappNumber: account.phoneNumber,
                    tags: ["lead"],
                    status: "active",
                  };
                  
                  setConversations(prev => [newConversation, ...prev]);
                  setSelectedConversation(newConversation);
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
