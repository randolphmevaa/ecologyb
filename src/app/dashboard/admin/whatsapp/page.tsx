"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";

import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  // UserCircleIcon,
  UserPlusIcon,
  // BellIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  // ArrowPathIcon,
  ClockIcon,
  ArchiveBoxIcon,
  SquaresPlusIcon,
  // CheckCircleIcon,
  FaceSmileIcon,
  PhotoIcon,
  DocumentIcon,
  MicrophoneIcon,
  XMarkIcon,
  // ChevronDownIcon,
  // PlusIcon,
  // ChevronRightIcon,
  // AdjustmentsHorizontalIcon,
  // CalendarIcon,
  // ChevronLeftIcon,
  CheckBadgeIcon,
  // TagIcon,
  // ArrowLeftIcon,
  // ArrowRightIcon,
  FunnelIcon,
  // Cog6ToothIcon,
  // StarIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// Import modals for WhatsApp account management and template creation
import { AddWhatsAppAccountModal } from "./AddWhatsAppAccountModal";
import { CreateTemplateModal } from "./CreateTemplateModal";
import { AddContactToWhatsAppModal } from "./AddContactToWhatsAppModal";

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

// Mock data for templates
const templateCategories = {
  "marketing": { color: "#bfddf9", gradient: "from-blue-500 to-blue-600" },
  "customer_service": { color: "#d2fcb2", gradient: "from-green-500 to-green-600" },
  "utility": { color: "#89c4f7", gradient: "from-cyan-500 to-cyan-600" },
};

// Tag colors for styling
const tagColors = {
  "lead": { bg: "#bfddf9", text: "#213f5b" },
  "client": { bg: "#d2fcb2", text: "#213f5b" },
  "urgent": { bg: "#ff9f9f", text: "#213f5b" },
  "follow-up": { bg: "#ffd89f", text: "#213f5b" },
  "support": { bg: "#e9c8ff", text: "#213f5b" },
};

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
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-1 pl-2">WhatsApp Business</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gérez vos conversations WhatsApp depuis votre CRM</p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="flex items-center gap-3 self-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateTemplateModalOpen(true)}
                    className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow"
                  >
                    <SquaresPlusIcon className="h-4 w-4 mr-2" />
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
                      <p className="text-sm text-[#213f5b] font-medium">Total messages</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.totalMessages.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">sur tous les comptes</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-200">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
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
                      <p className="text-sm text-[#213f5b] font-medium">Messages aujourd&apos;hui</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.todayMessages}</p>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+12%</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">depuis hier</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-200">
                      <ArchiveBoxIcon className="h-5 w-5 text-white" />
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
                      <p className="text-sm text-[#213f5b] font-medium">Taux de réponse</p>
                      <div className="flex items-center">
                        <p className="text-2xl sm:text-3xl font-bold text-[#213f5b] mt-1">{stats.responseRate}%</p>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Excellent</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">messages clients traités</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg shadow-indigo-200">
                      <CheckBadgeIcon className="h-5 w-5 text-white" />
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
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Moyen</span>
                      </div>
                      <p className="text-xs text-[#213f5b] opacity-60 mt-1">temps moyen</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200">
                      <ClockIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Main Content - WhatsApp Interface */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - WhatsApp Account Selection & Conversations List */}
              <div className="w-full md:w-96 border-r border-[#eaeaea] flex flex-col bg-white">
                {/* Account selector and search */}
                <div className="p-4 border-b border-[#eaeaea] bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <select
                      value={selectedAccount || ""}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="flex-1 bg-[#f8fafc] border-[#eaeaea] rounded-lg text-[#213f5b] text-sm focus:ring-[#bfddf9] focus:border-[#bfddf9]"
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
                      className="h-10 w-10 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                      onClick={() => setIsAddContactModalOpen(true)}
                    >
                      <UserPlusIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher une conversation..."
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
                  
                  <div className="flex items-center mt-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                      className="flex items-center gap-1 text-xs text-[#213f5b] border-[#eaeaea] hover:border-[#bfddf9] hover:bg-[#f8fafc] rounded-lg py-1.5 px-3 shadow-sm transition-all"
                    >
                      <FunnelIcon className="h-3 w-3" />
                      <span>Filtres</span>
                      {(statusFilter || tagFilter) && (
                        <span className="flex items-center justify-center h-4 w-4 bg-[#d2fcb2] text-[#213f5b] text-xs font-medium rounded-full">
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
                            ? "bg-[#213f5b] text-white" 
                            : "border-[#eaeaea] text-[#213f5b] hover:border-[#bfddf9]"
                        }`}
                      >
                        Actives
                      </Button>
                      <Button
                        variant={statusFilter === "active" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(statusFilter === "pending" ? "" : "pending")}
                        className={`text-xs rounded-lg py-1.5 px-3 whitespace-nowrap ${
                          statusFilter === "pending" 
                            ? "bg-[#213f5b] text-white" 
                            : "border-[#eaeaea] text-[#213f5b] hover:border-[#bfddf9]"
                        }`}
                      >
                        Non lues
                      </Button>
                      <Button
                        variant={statusFilter === "active" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(statusFilter === "archived" ? "" : "archived")}
                        className={`text-xs rounded-lg py-1.5 px-3 whitespace-nowrap ${
                          statusFilter === "archived" 
                            ? "bg-[#213f5b] text-white" 
                            : "border-[#eaeaea] text-[#213f5b] hover:border-[#bfddf9]"
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
                        <div className="pt-3 border-t border-[#eaeaea]">
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#213f5b] mb-1">Étiquettes</label>
                              <select
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm bg-[#f8fafc]"
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
                
                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col justify-center items-center p-12">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full blur opacity-30 animate-pulse"></div>
                        <div className="relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#213f5b]"></div>
                      </div>
                      <p className="mt-4 text-[#213f5b] animate-pulse">Chargement des conversations...</p>
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
                        <div className="absolute inset-0 bg-[#bfddf9] opacity-20 rounded-full animate-pulse"></div>
                        <ChatBubbleLeftRightIcon className="h-20 w-20 text-[#bfddf9] opacity-60" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#213f5b] mb-2">Aucune conversation</h3>
                      <p className="text-[#213f5b] opacity-75 mb-4">Aucune conversation ne correspond à vos critères de recherche.</p>
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="border-[#bfddf9] bg-white text-[#213f5b] hover:bg-[#bfddf9] transition-all rounded-lg py-2 px-4"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Effacer les filtres
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f0f0f0]">
                      {filteredConversations.map((conversation, index) => (
                        <motion.div
                          key={conversation._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className={`cursor-pointer transition-colors p-3 hover:bg-[#f8fafc] ${selectedConversation?._id === conversation._id ? 'bg-[#f0f7ff]' : ''}`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="relative">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border-2 ${conversation.unreadCount > 0 ? 'border-[#bfddf9]' : 'border-transparent'}`}>
                                {conversation.contact.profilePicture ? (
                                  <img 
                                    src={conversation.contact.profilePicture} 
                                    alt={conversation.contact.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-[#213f5b] flex items-center justify-center text-white font-bold text-lg">
                                    {conversation.contact.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              {conversation.contact.isBusinessAccount && (
                                <div className="absolute -right-1 -bottom-1 bg-[#213f5b] text-white rounded-full p-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-[#213f5b] truncate pr-2">{conversation.contact.name}</h3>
                                <span className="text-xs flex items-center whitespace-nowrap font-medium">
                                  {formatTime(conversation.lastMessage.timestamp)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1 mt-0.5">
                                {!conversation.lastMessage.isIncoming && getStatusIcon(conversation.lastMessage.status)}
                                <p className="text-sm text-[#213f5b] opacity-75 truncate">
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
                                        backgroundColor: tagColors[tag as keyof typeof tagColors]?.bg || '#eaeaea',
                                        color: tagColors[tag as keyof typeof tagColors]?.text || '#213f5b'
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                
                                {conversation.unreadCount > 0 && (
                                  <span className="flex items-center justify-center h-5 w-5 bg-[#bfddf9] text-[#213f5b] text-xs font-bold rounded-full">
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
              <div className="hidden md:flex flex-1 flex-col bg-[#f8fafc]">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-[#eaeaea] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          {selectedConversation.contact.profilePicture ? (
                            <img 
                              src={selectedConversation.contact.profilePicture} 
                              alt={selectedConversation.contact.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-[#213f5b] flex items-center justify-center text-white font-bold">
                              {selectedConversation.contact.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#213f5b]">{selectedConversation.contact.name}</h3>
                            {selectedConversation.contact.isBusinessAccount && (
                              <span className="bg-[#f0f0f0] text-[#213f5b] text-xs rounded-full px-2 py-0.5">
                                Business
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#213f5b] opacity-75">
                            {selectedConversation.contact.phoneNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                        >
                          <MagnifyingGlassIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                        >
                          <EllipsisHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div 
                      className="flex-1 overflow-y-auto p-4 md:p-6"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23213f5b\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}
                    >
                      {messages.map((message) => (
                        <div 
                          key={message._id}
                          className={`mb-3 flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-2xl p-3 ${
                              message.isIncoming 
                                ? 'bg-white border border-[#eaeaea] rounded-tl-none text-[#213f5b]' 
                                : 'bg-[#ddf4ff] rounded-tr-none text-[#213f5b]'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            
                            {/* Attachments */}
                            {message.attachments && message.attachments.map((attachment, i) => (
                              <div key={i} className="mt-2">
                                {attachment.type === 'image' && (
                                  <div className="rounded-lg overflow-hidden border border-[#eaeaea]">
                                    <img 
                                      src={attachment.thumbnail || "#"} 
                                      alt="attachment" 
                                      className="w-full object-cover max-h-48"
                                    />
                                  </div>
                                )}
                                
                                {attachment.type === 'document' && (
                                  <div className="flex items-center gap-2 bg-[#f8fafc] p-2 rounded-lg border border-[#eaeaea]">
                                    <DocumentIcon className="h-5 w-5 text-[#213f5b]" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{attachment.name}</p>
                                      <p className="text-xs opacity-60">{Math.round(attachment.size! / 1024)} KB</p>
                                    </div>
                                  </div>
                                )}
                                
                                {attachment.type === 'audio' && (
                                  <div className="flex items-center gap-2 bg-[#f8fafc] p-2 rounded-lg border border-[#eaeaea]">
                                    <div className="h-8 w-8 rounded-full bg-[#bfddf9] flex items-center justify-center">
                                      <MicrophoneIcon className="h-4 w-4 text-[#213f5b]" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="h-1 bg-[#eaeaea] rounded-full">
                                        <div className="h-full w-1/3 bg-[#213f5b] rounded-full"></div>
                                      </div>
                                      <div className="flex justify-between mt-1">
                                        <span className="text-xs">0:12</span>
                                        <span className="text-xs">0:36</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-[10px] text-[#213f5b] opacity-60">
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
                          className="border-t border-[#eaeaea] bg-white overflow-hidden"
                        >
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-[#213f5b]">Messages rapides</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsTemplateVisible(false)}
                                className="h-6 w-6 rounded-full"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
                              {templates.map(template => (
                                <motion.div
                                  key={template._id}
                                  className="p-2 rounded-lg border border-[#eaeaea] hover:border-[#bfddf9] cursor-pointer transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => {
                                    setNewMessage(template.content.replace(/{{[^}]+}}/g, '___'));
                                    setIsTemplateVisible(false);
                                  }}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="rounded-md p-1.5"
                                      style={{ 
                                        backgroundColor: templateCategories[template.category]?.color || '#eaeaea'
                                      }}
                                    >
                                      <SquaresPlusIcon className="h-3.5 w-3.5 text-[#213f5b]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-medium text-[#213f5b] truncate">{template.name}</h5>
                                        <span className="text-[10px] bg-[#f0f0f0] text-[#213f5b] rounded-full px-1.5 py-0.5">
                                          {template.status}
                                        </span>
                                      </div>
                                      <p className="text-xs text-[#213f5b] opacity-75 line-clamp-2 mt-0.5">
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
                    <div className="border-t border-[#eaeaea] bg-white p-3">
                      <div className="flex items-end gap-2">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            className="h-9 w-9 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                            onClick={() => setIsTemplateVisible(!isTemplateVisible)}
                          >
                            <SquaresPlusIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-9 w-9 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                          >
                            <PhotoIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-9 w-9 rounded-full flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
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
                            className="w-full rounded-2xl border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] min-h-[44px] max-h-[120px] py-2.5 px-4 resize-none text-sm"
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
                              ? 'bg-[#213f5b] hover:bg-[#152a3d]' 
                              : 'bg-[#eaeaea] cursor-not-allowed'
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
                            className="mt-2 border border-[#eaeaea] rounded-lg bg-white shadow-lg overflow-hidden"
                          >
                            <div className="p-2">
                              <div className="grid grid-cols-8 gap-1">
                                {["😀", "😂", "😍", "😎", "🤔", "😊", "👍", "👌", "🎉", "❤️", "🔥", "👏", "💯", "🙏", "🤦‍♂️", "🤷‍♀️"].map((emoji, index) => (
                                  <button
                                    key={index}
                                    className="h-8 w-8 hover:bg-[#f0f0f0] rounded text-xl"
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
                      <div className="absolute inset-0 bg-[#bfddf9] opacity-20 rounded-full animate-pulse"></div>
                      <ChatBubbleLeftRightIcon className="w-32 h-32 text-[#bfddf9] opacity-50" />
                    </div>
                    <h2 className="text-xl font-bold text-[#213f5b] mb-2">WhatsApp Business</h2>
                    <p className="text-[#213f5b] opacity-75 max-w-md text-center mb-6">
                      Sélectionnez une conversation pour commencer à échanger des messages avec vos contacts directement depuis votre CRM.
                    </p>
                    <Button
                      onClick={() => setIsAddContactModalOpen(true)}
                      className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
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
  );
}
