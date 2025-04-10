"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { zammadPbxService } from '@/services/zammadPbxService';
import { ZammadDataMapper } from '@/utils/zammadDataMapper';
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
// import { Button } from "@/components/ui/Button";

import {
  PhoneIcon,
  PhoneArrowUpRightIcon,
  PhoneXMarkIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PauseIcon,
//   ArrowPathIcon,
//   UserPlusIcon,
  UserIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
//   ChatBubbleLeftRightIcon,
  ArchiveBoxIcon,
  PlusIcon,
  MagnifyingGlassIcon,
//   Bars3Icon,
  XMarkIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
  EllipsisHorizontalIcon,
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

// Define types
interface IContact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  company?: string;
  avatar?: string;
  favorite: boolean;
  tags?: string[];
  lastCallDate?: string;
}

interface ICallHistory {
  id: string;
  contactId?: string;
  contactName?: string;
  phoneNumber: string;
  direction: "incoming" | "outgoing";
  status: "answered" | "missed" | "voicemail" | "rejected";
  startTime: string;
  duration?: number; // in seconds
  notes?: string;
  recorded: boolean;
}

interface IActiveCall {
  id: string;
  contactId?: string;
  contactName?: string;
  phoneNumber: string;
  direction: "incoming" | "outgoing";
  status: "ringing" | "connecting" | "active" | "on-hold" | "transferring";
  startTime: string;
  duration: number; // in seconds
  muted: boolean;
  onHold: boolean;
}

interface IVoicemail {
  id: string;
  contactId?: string;
  contactName?: string;
  phoneNumber: string;
  date: string;
  duration: number; // in seconds
  listened: boolean;
  transcription?: string;
}


// Theme context
const ThemeContext = createContext({ isDarkMode: false, toggleTheme: () => {} });

// Theme provider component
import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('pbx-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('pbx-theme', !isDarkMode ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
const useTheme = () => useContext(ThemeContext);

// Format call duration (seconds to MM:SS)
const formatCallDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format date to relative time (today, yesterday, or date)
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return "Aujourd'hui " + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Hier " + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' ' + 
      date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
};

export default function PBXPage() {
  // Theme
  const { isDarkMode } = useTheme();
//   const theme = isDarkMode ? colors.dark : colors.light;
  
  // State for the PBX interface
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [callHistory, setCallHistory] = useState<ICallHistory[]>([]);
  const [voicemails, setVoicemails] = useState<IVoicemail[]>([]);
  const [activeCall, setActiveCall] = useState<IActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<{id: string, phoneNumber: string, contactName?: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialPad, setDialPad] = useState("");
  const [view, setView] = useState<"dialer" | "contacts" | "history" | "voicemail">("dialer");
//   const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [audioSettings, setAudioSettings] = useState({
    micMuted: false,
    speakerMuted: false,
    speakerVolume: 80,
    micVolume: 70,
  });
  
  // Timer for active call
  const [, setCallTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // For audio effects
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Effect to fetch initial data
  useEffect(() => {
    // Simulate API fetching
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Test connection to Zammad
        const isConnected = await zammadPbxService.testConnection();
        if (!isConnected) {
          console.warn("Not connected to Zammad API, using mock data instead");
          // Fall back to your existing mock data generation
          // (Keep your current mock data generation code here)
          
          // Simulate delay for loading effect
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          return;
        }
        
        // Real data from Zammad API
        const calls = await zammadPbxService.getCallHistory();
        const extensions = await zammadPbxService.getExtensions();
        
        // Create contact list from extensions
        const extensionContacts = ZammadDataMapper.mapExtensionsToContacts(extensions);
        
        // For any callers in call history, try to find customer info
        const uniquePhoneNumbers = new Set<string>();
        calls.forEach(call => {
          uniquePhoneNumbers.add(call.caller);
          uniquePhoneNumbers.add(call.recipient);
        });
        
        // Real customers data
        const customers: IContact[] = [];
        
        // Only process a reasonable number of lookups to avoid rate limits
        const phoneNumbersToProcess = Array.from(uniquePhoneNumbers).slice(0, 10);
        for (const phone of phoneNumbersToProcess) {
          const customer = await zammadPbxService.findCustomerByPhone(phone);
          if (customer) {
            customers.push({
              id: customer.id.toString(),
              name: `${customer.firstname} ${customer.lastname}`,
              phoneNumber: phone,
              email: customer.email,
              avatar: customer.avatar,
              favorite: false,
              lastCallDate: calls.find(c => c.caller === phone || c.recipient === phone)?.timestamp
            });
          }
        }
        
        // Combined contact list (with mock data if needed for UI fullness)
        const combinedContacts = [...customers, ...extensionContacts];
        
        // If we have too few contacts, add some mock ones for UI fullness
        if (combinedContacts.length < 5) {
          // Add your mock contacts generation here
        }
        
        // Map call history
        const mappedCallHistory = ZammadDataMapper.mapToCallHistory(calls);
        
        // Extract potential voicemails
        const extractedVoicemails = ZammadDataMapper.extractVoicemails(calls);
        
        // Update state with real data
        setContacts(combinedContacts);
        setCallHistory(mappedCallHistory);
        setVoicemails(extractedVoicemails);
        
        // Finish loading
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        
        // Fallback to mock data
      }
    };
    
    fetchData();
    
    // Simulate an incoming call after 5 seconds (for demo)
    const incomingCallTimeout = setTimeout(() => {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      if (randomContact && !activeCall) {
        playSound("ringtone");
        setIncomingCall({
          id: `call_${Date.now()}`,
          phoneNumber: randomContact.phoneNumber,
          contactName: randomContact.name
        });
      }
    }, 5000);
    
    return () => {
      clearTimeout(incomingCallTimeout);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Effect to update call timer
  useEffect(() => {
    if (activeCall && activeCall.status === "active") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setCallTimer(prevTimer => prevTimer + 1);
        setActiveCall(prevCall => {
          if (prevCall) {
            return { ...prevCall, duration: prevCall.duration + 1 };
          }
          return null;
        });
      }, 1000);
    } else if (!activeCall && timerRef.current) {
      clearInterval(timerRef.current);
      setCallTimer(0);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeCall]);
  
  // Play sound effect
  const playSound = (sound: "dial" | "ringtone" | "call-end" | "call-connect") => {
    if (audioRef.current) {
      switch (sound) {
        case "dial":
          audioRef.current.src = "/sounds/dial.mp3"; // This would be a path to your sound files
          break;
        case "ringtone":
          audioRef.current.src = "/sounds/ringtone.mp3";
          audioRef.current.loop = true;
          break;
        case "call-end":
          audioRef.current.src = "/sounds/call-end.mp3";
          break;
        case "call-connect":
          audioRef.current.src = "/sounds/call-connect.mp3";
          break;
      }
      
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };
  
  // Stop sound
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
  };
  
  // Handle dial pad input
  const handleDialPadInput = (value: string) => {
    setDialPad(prev => prev + value);
    playSound("dial");
  };
  
  // Clear dial pad
  const clearDialPad = () => {
    setDialPad("");
  };
  
  // Handle outgoing call
  const makeCall = async (number: string) => {
    if (activeCall) return; // Already in a call
    
    const contact = contacts.find(c => c.phoneNumber === number);
    stopSound();
    
    try {
      // Try to make real call via Zammad API
      const extensionToUse = contacts.find(c => c.phoneNumber.length <= 5)?.phoneNumber || "101"; // Try to use an extension
      const callResult = await zammadPbxService.makeCall(extensionToUse, number);
      
      if (callResult) {
        // Real call was initiated successfully
        const newCall: IActiveCall = ZammadDataMapper.mapToActiveCall(callResult);
        
        setActiveCall(newCall);
        playSound("call-connect");
      } else {
        // Fallback to simulated call
        const newCall: IActiveCall = {
          id: `call_${Date.now()}`,
          phoneNumber: number,
          contactId: contact?.id,
          contactName: contact?.name,
          direction: "outgoing",
          status: "connecting",
          startTime: new Date().toISOString(),
          duration: 0,
          muted: false,
          onHold: false
        };
        
        setActiveCall(newCall);
        
        // Simulate call connection after 2 seconds
        setTimeout(() => {
          setActiveCall(prev => {
            if (prev) {
              playSound("call-connect");
              return { ...prev, status: "active" };
            }
            return null;
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error making call:", error);
      
      // Fallback to simulated call
      const newCall: IActiveCall = {
        id: `call_${Date.now()}`,
        phoneNumber: number,
        contactId: contact?.id,
        contactName: contact?.name,
        direction: "outgoing",
        status: "connecting",
        startTime: new Date().toISOString(),
        duration: 0,
        muted: false,
        onHold: false
      };
      
      setActiveCall(newCall);
      
      // Simulate call connection after 2 seconds
      setTimeout(() => {
        setActiveCall(prev => {
          if (prev) {
            playSound("call-connect");
            return { ...prev, status: "active" };
          }
          return null;
        });
      }, 2000);
    }
  };
  
  
  // Handle incoming call
  const answerCall = () => {
    if (!incomingCall) return;
    stopSound();
    
    const contact = contacts.find(c => c.phoneNumber === incomingCall.phoneNumber);
    
    // Create a new active call
    const newCall: IActiveCall = {
      id: incomingCall.id,
      phoneNumber: incomingCall.phoneNumber,
      contactId: contact?.id,
      contactName: contact?.name || incomingCall.contactName,
      direction: "incoming",
      status: "active",
      startTime: new Date().toISOString(),
      duration: 0,
      muted: false,
      onHold: false
    };
    
    setActiveCall(newCall);
    setIncomingCall(null);
    playSound("call-connect");
  };
  
  // Reject incoming call
  const rejectCall = () => {
    if (!incomingCall) return;
    stopSound();
    
    // Add to call history
    const contact = contacts.find(c => c.phoneNumber === incomingCall.phoneNumber);
    
    const newHistoryEntry: ICallHistory = {
      id: `h_${Date.now()}`,
      contactId: contact?.id,
      contactName: contact?.name || incomingCall.contactName,
      phoneNumber: incomingCall.phoneNumber,
      direction: "incoming",
      status: "rejected",
      startTime: new Date().toISOString(),
      recorded: false
    };
    
    setCallHistory(prev => [newHistoryEntry, ...prev]);
    setIncomingCall(null);
  };
  
  // End active call
  const endCall = async () => {
    if (!activeCall) return;
    stopSound();
    playSound("call-end");
    
    try {
      // For now, just handle the local UI part
      // In a real integration, you would update the call status in Zammad here
      
      // Add to call history
      const newHistoryEntry: ICallHistory = {
        id: `h_${Date.now()}`,
        contactId: activeCall.contactId,
        contactName: activeCall.contactName,
        phoneNumber: activeCall.phoneNumber,
        direction: activeCall.direction,
        status: "answered",
        startTime: activeCall.startTime,
        duration: activeCall.duration,
        recorded: false
      };
      
      setCallHistory(prev => [newHistoryEntry, ...prev]);
      setActiveCall(null);
      setCallTimer(0);
      
      // Refresh call history to get the latest data
      setTimeout(() => {
        zammadPbxService.getCallHistory().then(calls => {
          setCallHistory(ZammadDataMapper.mapToCallHistory(calls));
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error ending call:", error);
      
      // Fallback handling
      const newHistoryEntry: ICallHistory = {
        id: `h_${Date.now()}`,
        contactId: activeCall.contactId,
        contactName: activeCall.contactName,
        phoneNumber: activeCall.phoneNumber,
        direction: activeCall.direction,
        status: "answered",
        startTime: activeCall.startTime,
        duration: activeCall.duration,
        recorded: false
      };
      
      setCallHistory(prev => [newHistoryEntry, ...prev]);
      setActiveCall(null);
      setCallTimer(0);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setAudioSettings(prev => ({ ...prev, micMuted: !prev.micMuted }));
    
    if (activeCall) {
      setActiveCall(prev => {
        if (prev) {
          return { ...prev, muted: !prev.muted };
        }
        return null;
      });
    }
  };
  
  // Toggle hold
  const toggleHold = () => {
    if (!activeCall) return;
    
    setActiveCall(prev => {
      if (prev) {
        return { 
          ...prev, 
          onHold: !prev.onHold,
          status: prev.onHold ? "active" : "on-hold"
        };
      }
      return null;
    });
  };
  
  // Start call transfer
  const startTransfer = () => {
    if (!activeCall) return;
    
    setActiveCall(prev => {
      if (prev) {
        return { ...prev, status: "transferring" };
      }
      return null;
    });
    
    // Switch to contacts view
    setView("contacts");
  };
  
  // Complete transfer to a contact
  const completeTransfer = (contactId: string) => {
    if (!activeCall || activeCall.status !== "transferring") return;
    
    const targetContact = contacts.find(c => c.id === contactId);
    if (!targetContact) return;
    
    // Simulate successful transfer
    setTimeout(() => {
      // Add to call history
      const newHistoryEntry: ICallHistory = {
        id: `h_${Date.now()}`,
        contactId: activeCall.contactId,
        contactName: activeCall.contactName,
        phoneNumber: activeCall.phoneNumber,
        direction: activeCall.direction,
        status: "answered",
        startTime: activeCall.startTime,
        duration: activeCall.duration,
        notes: `Transféré à ${targetContact.name}`,
        recorded: false
      };
      
      setCallHistory(prev => [newHistoryEntry, ...prev]);
      setActiveCall(null);
      setCallTimer(0);
      
      // Show notification (in a real app)
      alert(`Appel transféré avec succès à ${targetContact.name}`);
    }, 1500);
  };
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(term) ||
      contact.phoneNumber.includes(term) ||
      (contact.email && contact.email.toLowerCase().includes(term)) ||
      (contact.company && contact.company.toLowerCase().includes(term))
    );
  });
  
  // Get contact by phone number
  const getContactByPhone = (phoneNumber: string) => {
    return contacts.find(c => c.phoneNumber === phoneNumber);
  };
  
  // Toggle favorite status for a contact
  const toggleFavorite = (contactId: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, favorite: !contact.favorite } 
          : contact
      )
    );
  };
  
  // Play voicemail
  const playVoicemail = (voicemailId: string) => {
    // In a real app, this would play the audio file
    alert("Lecture de la messagerie vocale en cours...");
    
    // Mark as listened
    setVoicemails(prev => 
      prev.map(vm => 
        vm.id === voicemailId 
          ? { ...vm, listened: true } 
          : vm
      )
    );
  };
  
  return (
    <ThemeProvider>
      <div className={`flex h-screen ${isDarkMode ? 'bg-[#1F2937]' : 'bg-[#F9FAFB]'}`}>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="max-w-full h-full flex flex-col">
              {/* Dashboard Header */}
              <div className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} border-b px-4 sm:px-6 lg:px-8 py-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#6366F1] to-[#4F46E5] rounded-full"></div>
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-[#6366F1] to-[#4F46E5]' : 'from-[#4F46E5] to-[#6366F1]'} mb-1 pl-2`}>Poste de travail</h1>
                    <p className={`${isDarkMode ? 'text-[#9CA3AF] opacity-90' : 'text-[#4F46E5] opacity-90'} pl-2`}>Gérez vos appels, consultez l&apos;historique et accédez à vos contacts</p>
                    <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#4F46E5] opacity-10 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-[#F3F4F6] border-[#E5E7EB]'} border rounded-lg px-4 py-3 max-w-xl`}>
                    <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>Information</h2>
                    <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Cette interface vous permet de gérer vos appels directement depuis votre navigateur. Utilisez les boutons pour transférer, mettre en attente ou terminer les appels. Vous pouvez également consulter votre historique d&apos;appels récents.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Appels aujourd&apos;hui</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {callHistory.filter(call => {
                            const callDate = new Date(call.startTime);
                            const today = new Date();
                            return callDate.toDateString() === today.toDateString();
                          }).length}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <PhoneIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Appels manqués</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {callHistory.filter(call => call.status === "missed").length}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] shadow-lg">
                        <PhoneXMarkIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Messages vocaux</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {voicemails.length}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#4F46E5] opacity-60'} mt-1`}>
                          {voicemails.filter(vm => !vm.listened).length} non écoutés
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <EnvelopeIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Contacts</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {contacts.length}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#4F46E5] opacity-60'} mt-1`}>
                          {contacts.filter(c => c.favorite).length} favoris
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Main Content - Phone Interface */}
              <div className="flex-1 flex overflow-hidden">
                {/* Phone Left Panel */}
                <div className={`w-full md:w-80 border-r ${isDarkMode ? 'border-[#374151] bg-[#1F2937]' : 'border-[#E5E7EB] bg-white'} flex flex-col`}>
                  {/* Navigation */}
                  <div className={`border-b ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                    <div className="flex">
                      <button
                        className={`flex-1 py-3 px-2 ${
                          view === "dialer"
                            ? isDarkMode 
                              ? 'text-[#F9FAFB] border-b-2 border-[#4F46E5]' 
                              : 'text-[#4F46E5] border-b-2 border-[#4F46E5]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:text-[#4F46E5]'
                        } flex items-center justify-center gap-1 text-sm font-medium transition-colors`}
                        onClick={() => setView("dialer")}
                      >
                        <PhoneIcon className="h-4 w-4" />
                        <span>Clavier</span>
                      </button>
                      
                      <button
                        className={`flex-1 py-3 px-2 ${
                          view === "contacts"
                            ? isDarkMode 
                              ? 'text-[#F9FAFB] border-b-2 border-[#4F46E5]' 
                              : 'text-[#4F46E5] border-b-2 border-[#4F46E5]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:text-[#4F46E5]'
                        } flex items-center justify-center gap-1 text-sm font-medium transition-colors`}
                        onClick={() => setView("contacts")}
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Contacts</span>
                      </button>
                      
                      <button
                        className={`flex-1 py-3 px-2 ${
                          view === "history"
                            ? isDarkMode 
                              ? 'text-[#F9FAFB] border-b-2 border-[#4F46E5]' 
                              : 'text-[#4F46E5] border-b-2 border-[#4F46E5]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:text-[#4F46E5]'
                        } flex items-center justify-center gap-1 text-sm font-medium transition-colors relative`}
                        onClick={() => setView("history")}
                      >
                        <ClockIcon className="h-4 w-4" />
                        <span>Historique</span>
                        {callHistory.filter(call => call.status === "missed" && !call.duration).length > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {callHistory.filter(call => call.status === "missed" && !call.duration).length}
                          </span>
                        )}
                      </button>
                      
                      <button
                        className={`flex-1 py-3 px-2 ${
                          view === "voicemail"
                            ? isDarkMode 
                              ? 'text-[#F9FAFB] border-b-2 border-[#4F46E5]' 
                              : 'text-[#4F46E5] border-b-2 border-[#4F46E5]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:text-[#4F46E5]'
                        } flex items-center justify-center gap-1 text-sm font-medium transition-colors relative`}
                        onClick={() => setView("voicemail")}
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>Messagerie</span>
                        {voicemails.filter(vm => !vm.listened).length > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {voicemails.filter(vm => !vm.listened).length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Content based on selected view */}
                  <div className="flex-1 overflow-y-auto">
                    {loading ? (
                      <div className="flex flex-col justify-center items-center p-12">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-[#4F46E5] to-[#6366F1]' : 'from-[#4F46E5] to-[#6366F1]'} rounded-full blur opacity-30 animate-pulse`}></div>
                          <div className={`relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkMode ? 'border-[#4F46E5]' : 'border-[#4F46E5]'}`}></div>
                        </div>
                        <p className={`mt-4 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} animate-pulse`}>Chargement...</p>
                      </div>
                    ) : (
                      <>
                        {/* Dialer View */}
                        {view === "dialer" && (
                          <div className="p-4">
                            {/* Number input display */}
                            <div className={`mb-4 ${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-[#F3F4F6] border-[#E5E7EB]'} border rounded-lg p-3 relative`}>
                              <input
                                type="text"
                                value={dialPad}
                                onChange={(e) => setDialPad(e.target.value.replace(/[^0-9+*#]/g, ''))}
                                placeholder="Saisissez un numéro..."
                                className={`w-full ${isDarkMode ? 'bg-[#111827] text-[#F9FAFB]' : 'bg-[#F3F4F6] text-[#111827]'} text-lg sm:text-2xl font-mono text-center py-2 outline-none`}
                              />
                              
                              {dialPad && (
                                <button
                                  onClick={clearDialPad}
                                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' : 'text-[#6B7280] hover:text-[#111827]'} rounded-full p-1`}
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                            
                            {/* Dial pad */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                                <button
                                  key={digit}
                                  onClick={() => handleDialPadInput(digit)}
                                  className={`${isDarkMode ? 'bg-[#111827] hover:bg-[#374151] text-[#F9FAFB]' : 'bg-white hover:bg-[#F3F4F6] text-[#111827]'} border ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'} rounded-lg h-14 flex items-center justify-center text-xl font-medium`}
                                >
                                  {digit}
                                </button>
                              ))}
                            </div>
                            
                            {/* Call button */}
                            <button
                              onClick={() => dialPad && makeCall(dialPad)}
                              disabled={!dialPad || activeCall !== null}
                              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                !dialPad || activeCall !== null
                                  ? isDarkMode 
                                    ? 'bg-[#374151] text-[#9CA3AF] cursor-not-allowed' 
                                    : 'bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed'
                                  : 'bg-[#22C55E] hover:bg-[#16A34A] text-white'
                              }`}
                            >
                              <PhoneIcon className="h-5 w-5" />
                              <span>Appeler</span>
                            </button>
                          </div>
                        )}
                        
                        {/* Contacts View */}
                        {view === "contacts" && (
                          <div className="p-4">
                            {/* Search */}
                            <div className="mb-4 relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                              </div>
                              <input
                                type="text"
                                placeholder="Rechercher un contact..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-10 py-2 ${
                                  isDarkMode 
                                    ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                    : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                } border rounded-lg`}
                              />
                              {searchTerm && (
                                <button
                                  onClick={() => setSearchTerm("")}
                                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' : 'text-[#6B7280] hover:text-[#111827]'} rounded-full p-1`}
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            
                            {/* Favorites section */}
                            {contacts.filter(c => c.favorite).length > 0 && searchTerm === "" && (
                              <div className="mb-4">
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>Favoris</h3>
                                <div className="grid grid-cols-4 gap-2">
                                  {contacts
                                    .filter(c => c.favorite)
                                    .slice(0, 8)
                                    .map((contact) => (
                                      <button
                                        key={contact.id}
                                        onClick={() => activeCall?.status === "transferring" ? completeTransfer(contact.id) : makeCall(contact.phoneNumber)}
                                        className="flex flex-col items-center gap-1"
                                      >
                                        <div className={`relative h-12 w-12 rounded-full flex items-center justify-center ${
                                          contact.avatar 
                                            ? "" 
                                            : isDarkMode 
                                              ? "bg-[#4F46E5]" 
                                              : "bg-[#E0E7FF]"
                                        } overflow-hidden`}>
                                          {contact.avatar ? (
                                            <img 
                                              src={contact.avatar} 
                                              alt={contact.name} 
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            <span className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-[#4F46E5]"}`}>
                                              {contact.name.charAt(0)}
                                            </span>
                                          )}
                                        </div>
                                        <span className={`text-xs text-center truncate ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} max-w-full`}>
                                          {contact.name.split(" ")[0]}
                                        </span>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Contacts list */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                  {searchTerm ? `Résultats (${filteredContacts.length})` : "Tous les contacts"}
                                </h3>
                                <button
                                  className={`text-xs ${isDarkMode ? 'text-[#4F46E5]' : 'text-[#4F46E5]'} flex items-center gap-1`}
                                >
                                  <PlusIcon className="h-3 w-3" />
                                  <span>Nouveau</span>
                                </button>
                              </div>
                              
                              {filteredContacts.length === 0 ? (
                                <div className={`text-center py-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'} rounded-lg`}>
                                  <UserIcon className={`h-10 w-10 mx-auto ${isDarkMode ? 'text-[#4F46E5]' : 'text-[#4F46E5]'} opacity-50 mb-2`} />
                                  <p className={`${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} text-sm`}>
                                    Aucun contact trouvé
                                  </p>
                                </div>
                              ) : (
                                <div className={`divide-y ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'}`}>
                                  {filteredContacts.map((contact) => (
                                    <div 
                                      key={contact.id}
                                      className={`py-3 flex items-center justify-between ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'} rounded-lg px-2 -mx-2 cursor-pointer`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                          contact.avatar 
                                            ? "" 
                                            : isDarkMode 
                                              ? "bg-[#4F46E5]" 
                                              : "bg-[#E0E7FF]"
                                        } overflow-hidden`}>
                                          {contact.avatar ? (
                                            <img 
                                              src={contact.avatar} 
                                              alt={contact.name} 
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-[#4F46E5]"}`}>
                                              {contact.name.charAt(0)}
                                            </span>
                                          )}
                                        </div>
                                        <div>
                                          <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                            {contact.name}
                                          </p>
                                          <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            {contact.phoneNumber}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => toggleFavorite(contact.id)}
                                          className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#E5E7EB]'} rounded-full`}
                                        >
                                          <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill={contact.favorite ? "#F59E0B" : "none"}
                                            stroke={contact.favorite ? "none" : isDarkMode ? "#9CA3AF" : "#6B7280"}
                                            className="h-5 w-5"
                                            strokeWidth="1.5"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                          </svg>
                                        </button>
                                        
                                        <button
                                          onClick={() => activeCall?.status === "transferring" ? completeTransfer(contact.id) : makeCall(contact.phoneNumber)}
                                          className={`p-1.5 ${
                                            activeCall?.status === "transferring"
                                              ? "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                                              : isDarkMode 
                                                ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                                                : 'text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827]'
                                          } rounded-full`}
                                        >
                                          {activeCall?.status === "transferring" ? (
                                            <ArrowsRightLeftIcon className="h-5 w-5" />
                                          ) : (
                                            <PhoneIcon className="h-5 w-5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* History View */}
                        {view === "history" && (
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                Historique des appels
                              </h3>
                              <div className="flex gap-2">
                                <button
                                  className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'} rounded-full`}
                                >
                                  <AdjustmentsHorizontalIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                </button>
                                <button
                                  className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'} rounded-full`}
                                >
                                  <ArchiveBoxIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                </button>
                              </div>
                            </div>
                            
                            {callHistory.length === 0 ? (
                              <div className={`text-center py-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'} rounded-lg`}>
                                <ClockIcon className={`h-10 w-10 mx-auto ${isDarkMode ? 'text-[#4F46E5]' : 'text-[#4F46E5]'} opacity-50 mb-2`} />
                                <p className={`${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} text-sm`}>
                                  Aucun appel récent
                                </p>
                              </div>
                            ) : (
                              <div className={`divide-y ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'}`}>
                                {callHistory.map((call) => {
                                  // const contact = contacts.find(c => c.id === call.contactId);
                                  return (
                                    <div 
                                      key={call.id}
                                      className={`py-3 flex items-center justify-between ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'} rounded-lg px-2 -mx-2`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                          call.direction === "incoming"
                                            ? call.status === "missed" || call.status === "rejected"
                                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                              : call.status === "voicemail"
                                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                                                : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                            : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                                        }`}>
                                          {call.direction === "incoming" ? (
                                            call.status === "missed" || call.status === "rejected" ? (
                                              <PhoneXMarkIcon className="h-5 w-5" />
                                            ) : call.status === "voicemail" ? (
                                              <EnvelopeIcon className="h-5 w-5" />
                                            ) : (
                                              <PhoneArrowUpRightIcon className="h-5 w-5 rotate-90" />
                                            )
                                          ) : (
                                            <PhoneArrowUpRightIcon className="h-5 w-5" />
                                          )}
                                        </div>
                                        <div>
                                          <p className={`font-medium ${
                                            call.status === "missed" 
                                              ? "text-red-500 dark:text-red-400" 
                                              : isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'
                                          }`}>
                                            {call.contactName || call.phoneNumber}
                                          </p>
                                          <div className="flex items-center gap-1">
                                            {call.direction === "incoming" ? (
                                              <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor" 
                                                className={`h-3 w-3 ${
                                                  call.status === "missed" 
                                                    ? "text-red-500" 
                                                    : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                                                }`}
                                              >
                                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                              </svg>
                                            ) : (
                                              <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor" 
                                                className={`h-3 w-3 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                                              >
                                                <path fillRule="evenodd" d="M5.22 5.22a.75.75 0 011.06 0L14.5 13.94v-5.69a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75h-7.5a.75.75 0 010-1.5h5.69L5.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                                              </svg>
                                            )}
                                            <span className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                              {formatRelativeDate(call.startTime)}
                                              {call.duration ? ` (${formatCallDuration(call.duration)})` : ""}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => makeCall(call.phoneNumber)}
                                          className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#E5E7EB]'} rounded-full`}
                                        >
                                          <PhoneIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                        </button>
                                        <button
                                          className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#E5E7EB]'} rounded-full`}
                                        >
                                          <EllipsisHorizontalIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Voicemail View */}
                        {view === "voicemail" && (
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                Messages vocaux
                              </h3>
                              <button
                                className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'} rounded-full`}
                              >
                                <AdjustmentsHorizontalIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                              </button>
                            </div>
                            
                            {voicemails.length === 0 ? (
                              <div className={`text-center py-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'} rounded-lg`}>
                                <EnvelopeIcon className={`h-10 w-10 mx-auto ${isDarkMode ? 'text-[#4F46E5]' : 'text-[#4F46E5]'} opacity-50 mb-2`} />
                                <p className={`${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} text-sm`}>
                                  Aucun message vocal
                                </p>
                              </div>
                            ) : (
                              <div className={`divide-y ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'}`}>
                                {voicemails.map((voicemail) => {
                                  const contact = contacts.find(c => c.id === voicemail.contactId);
                                  return (
                                    <div 
                                      key={voicemail.id}
                                      className={`py-3 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'} rounded-lg px-2 -mx-2`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                            contact?.avatar 
                                              ? "" 
                                              : isDarkMode 
                                                ? "bg-[#4F46E5]" 
                                                : "bg-[#E0E7FF]"
                                          } overflow-hidden relative`}>
                                            {contact?.avatar ? (
                                              <img 
                                                src={contact.avatar} 
                                                alt={contact.name} 
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-[#4F46E5]"}`}>
                                                {voicemail.contactName?.charAt(0) || voicemail.phoneNumber.charAt(0)}
                                              </span>
                                            )}
                                            {!voicemail.listened && (
                                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-red-500 rounded-full"></div>
                                            )}
                                          </div>
                                          <div>
                                            <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                              {voicemail.contactName || voicemail.phoneNumber}
                                            </p>
                                            <div className="flex items-center gap-1">
                                              <span className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                {formatRelativeDate(voicemail.date)} ({formatCallDuration(voicemail.duration)})
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex gap-1">
                                          <button
                                            onClick={() => playVoicemail(voicemail.id)}
                                            className={`p-1.5 ${isDarkMode ? 'bg-[#111827] hover:bg-[#374151]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB]'} rounded-full`}
                                          >
                                            <svg 
                                              xmlns="http://www.w3.org/2000/svg" 
                                              viewBox="0 0 24 24" 
                                              fill="currentColor" 
                                              className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                                            >
                                              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => makeCall(voicemail.phoneNumber)}
                                            className={`p-1.5 ${isDarkMode ? 'bg-[#111827] hover:bg-[#374151]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB]'} rounded-full`}
                                          >
                                            <PhoneIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                          </button>
                                          <button
                                            className={`p-1.5 ${isDarkMode ? 'bg-[#111827] hover:bg-[#374151]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB]'} rounded-full`}
                                          >
                                            <EllipsisHorizontalIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                          </button>
                                        </div>
                                      </div>
                                      
                                      {voicemail.transcription && (
                                        <div className={`ml-12 mt-1 p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'} text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                          <p className="italic">{voicemail.transcription}</p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Phone Right Panel - Call Information and Status */}
                <div className={`hidden md:flex flex-1 flex-col overflow-hidden ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                  {activeCall ? (
                    <div className="flex-1 flex flex-col p-6">
                      <div className="flex-1 flex flex-col items-center justify-center">
                        {/* Contact Info */}
                        <div className="text-center mb-6">
                          <div className="relative mb-4">
                            {activeCall.contactId && getContactByPhone(activeCall.phoneNumber)?.avatar ? (
                              <div className="h-24 w-24 rounded-full overflow-hidden mx-auto border-4 border-[#4F46E5]">
                                <img 
                                  src={getContactByPhone(activeCall.phoneNumber)?.avatar} 
                                  alt={activeCall.contactName || activeCall.phoneNumber} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`h-24 w-24 rounded-full flex items-center justify-center bg-[#4F46E5] mx-auto`}>
                                <span className="text-3xl font-semibold text-white">
                                  {(activeCall.contactName || activeCall.phoneNumber).charAt(0)}
                                </span>
                              </div>
                            )}
                            
                            {/* Pulsing animation for active call */}
                            {activeCall.status === "active" && !activeCall.onHold && (
                              <div className="absolute inset-0 rounded-full border-4 border-[#4F46E5] animate-ping opacity-50"></div>
                            )}
                          </div>
                          
                          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                            {activeCall.contactName || activeCall.phoneNumber}
                          </h2>
                          
                          {activeCall.contactName && (
                            <p className={`text-base ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-2`}>
                              {activeCall.phoneNumber}
                            </p>
                          )}
                          
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            activeCall.status === "active" && !activeCall.onHold
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : activeCall.status === "on-hold"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                : activeCall.status === "connecting"
                                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                  : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          } mb-6`}>
                            {activeCall.status === "active" && !activeCall.onHold
                              ? "Appel en cours"
                              : activeCall.status === "on-hold"
                                ? "En attente"
                                : activeCall.status === "connecting"
                                  ? "Connexion..."
                                  : activeCall.status === "transferring"
                                    ? "Transfert en cours"
                                    : "Appel"}
                          </div>
                          
                          {/* Call Timer */}
                          <div className={`text-2xl font-mono ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-8`}>
                            {formatCallDuration(activeCall.duration)}
                          </div>
                        </div>
                        
                        {/* Call Controls */}
                        <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto">
                          {/* Mute button */}
                          <button
                            onClick={toggleMute}
                            className={`flex flex-col items-center ${
                              activeCall.muted
                                ? "text-[#EF4444]"
                                : isDarkMode ? "text-[#9CA3AF] hover:text-[#F9FAFB]" : "text-[#6B7280] hover:text-[#111827]"
                            }`}
                          >
                            <div className={`p-4 rounded-full ${
                              activeCall.muted
                                ? "bg-red-100 dark:bg-red-900"
                                : isDarkMode ? "bg-[#1F2937] hover:bg-[#374151]" : "bg-white hover:bg-[#E5E7EB]"
                            } mb-2`}>
                              {activeCall.muted ? (
                                <MicrophoneIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                              ) : (
                                <MicrophoneIcon className="h-6 w-6" />
                              )}
                            </div>
                            <span className="text-sm">Muet</span>
                          </button>
                          
                          {/* Hold button */}
                          <button
                            onClick={toggleHold}
                            className={`flex flex-col items-center ${
                              activeCall.onHold
                                ? "text-[#F59E0B]"
                                : isDarkMode ? "text-[#9CA3AF] hover:text-[#F9FAFB]" : "text-[#6B7280] hover:text-[#111827]"
                            }`}
                          >
                            <div className={`p-4 rounded-full ${
                              activeCall.onHold
                                ? "bg-amber-100 dark:bg-amber-900"
                                : isDarkMode ? "bg-[#1F2937] hover:bg-[#374151]" : "bg-white hover:bg-[#E5E7EB]"
                            } mb-2`}>
                              {activeCall.onHold ? (
                                <PauseIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                              ) : (
                                <PauseIcon className="h-6 w-6" />
                              )}
                            </div>
                            <span className="text-sm">Attente</span>
                          </button>
                          
                          {/* Transfer button */}
                          <button
                            onClick={startTransfer}
                            className={`flex flex-col items-center ${
                              activeCall.status === "transferring"
                                ? "text-[#4F46E5]"
                                : isDarkMode ? "text-[#9CA3AF] hover:text-[#F9FAFB]" : "text-[#6B7280] hover:text-[#111827]"
                            }`}
                          >
                            <div className={`p-4 rounded-full ${
                              activeCall.status === "transferring"
                                ? "bg-indigo-100 dark:bg-indigo-900"
                                : isDarkMode ? "bg-[#1F2937] hover:bg-[#374151]" : "bg-white hover:bg-[#E5E7EB]"
                            } mb-2`}>
                              {activeCall.status === "transferring" ? (
                                <ArrowsRightLeftIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <ArrowsRightLeftIcon className="h-6 w-6" />
                              )}
                            </div>
                            <span className="text-sm">Transférer</span>
                          </button>
                        </div>
                        
                        {/* End Call button */}
                        <button
                          onClick={endCall}
                          className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
                        >
                          <PhoneXMarkIcon className="h-8 w-8" />
                        </button>
                      </div>
                      
                      {/* Audio settings bar */}
                      <div className={`mt-auto py-3 px-4 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setAudioSettings(prev => ({ ...prev, speakerMuted: !prev.speakerMuted }))}
                            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'}`}
                          >
                            {audioSettings.speakerMuted ? (
                              <SpeakerXMarkIcon className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                            ) : (
                              <SpeakerWaveIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                            )}
                          </button>
                          
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={audioSettings.speakerVolume}
                            onChange={(e) => setAudioSettings(prev => ({ ...prev, speakerVolume: parseInt(e.target.value) }))}
                            className="w-24"
                          />
                        </div>
                        
                        <button
                          className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'}`}
                        >
                          <Cog6ToothIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                      {incomingCall ? (
                        <div className="text-center p-6 max-w-md">
                          <div className="relative mb-6">
                            <div className="h-24 w-24 rounded-full overflow-hidden mx-auto border-4 border-[#4F46E5] animate-pulse">
                              {getContactByPhone(incomingCall.phoneNumber)?.avatar ? (
                                <img 
                                  src={getContactByPhone(incomingCall.phoneNumber)?.avatar} 
                                  alt={incomingCall.contactName || incomingCall.phoneNumber} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-[#4F46E5]">
                                  <span className="text-3xl font-semibold text-white">
                                    {(incomingCall.contactName || incomingCall.phoneNumber).charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-[#4F46E5] animate-ping opacity-50"></div>
                          </div>
                          
                          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                            {incomingCall.contactName || incomingCall.phoneNumber}
                          </h2>
                          
                          {incomingCall.contactName && (
                            <p className={`text-base ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-4`}>
                              {incomingCall.phoneNumber}
                            </p>
                          )}
                          
                          <div className={`mb-8 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 inline-flex items-center gap-2`}>
                            <span className="animate-pulse h-2 w-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                            <span>Appel entrant</span>
                          </div>
                          
                          <div className="flex justify-center gap-8">
                            <button
                              onClick={rejectCall}
                              className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
                            >
                              <PhoneXMarkIcon className="h-8 w-8" />
                            </button>
                            
                            <button
                              onClick={answerCall}
                              className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors shadow-lg"
                            >
                              <PhoneIcon className="h-8 w-8" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`${isDarkMode ? 'text-[#4F46E5]' : 'text-[#4F46E5]'} mb-6`}>
                            <svg className="h-32 w-32 mx-auto opacity-20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.5 6.5a4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4zm-4 6C6.22 12.5 3 13.28 3 16.5v1a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-1c0-3.22-3.22-4-6.5-4z" />
                            </svg>
                          </div>
                          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>
                            Aucun appel en cours
                          </h2>
                          <p className={`text-center ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} max-w-md`}>
                            Utilisez le clavier téléphonique ou sélectionnez un contact pour passer un appel. Tous les appels entrants apparaîtront ici.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Audio element for sound effects */}
        <audio ref={audioRef} />
      </div>
    </ThemeProvider>
  );
}
