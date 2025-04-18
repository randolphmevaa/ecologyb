"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  BellIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  SparklesIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  BookOpenIcon,
  EnvelopeIcon,
  CalendarIcon,
  FolderIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  TruckIcon,
  // SettingsIcon,
  CurrencyEuroIcon,
  LifebuoyIcon,
  CreditCardIcon,
  ChatBubbleBottomCenterIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  // CodeBracketIcon,
  XMarkIcon,
  ArrowPathIcon,
  FunnelIcon,
  TicketIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { SearchIcon } from "lucide-react";
import { SettingsIcon } from "lucide-react";

import AddTicketForm from "./AddTicketForm";
import AddDossierForm from "./AddDossierForm";
import AddCommentForm from "./AddCommentForm";

/**
 * Common HeaderLayout component
 *
 * Props:
 * - createDropdownItems: Array of items for the "Créer" dropdown.
 * - navigation: Array of navigation items (used for the search suggestions).
 * - searchPlaceholder: Placeholder text for the search input.
 * - user: The current user object.
 * - contactId: An optional contact ID (passed to modals).
 * - createBaseUrl: Base URL for create actions (varies by role).
 */
function HeaderLayout({ createDropdownItems, navigation, searchPlaceholder, user, contactId, createBaseUrl }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [searchType, setSearchType] = useState("all");
  const [projectResults, setProjectResults] = useState([]);
  const [contactResults, setContactResults] = useState([]);
  const [contactsMap, setContactsMap] = useState({});
  const [contactToProjectMap, setContactToProjectMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();

  // Helper to flatten navigation (including children) for search suggestions
  const flattenNavigation = (items) => {
    let result = [];
    items.forEach((item) => {
      if (item.children) {
        result = result.concat(item.children);
      } else {
        result.push(item);
      }
    });
    return result;
  };

  const flatNavigation = flattenNavigation(navigation);
  const navSearchResults = searchQuery
    ? flatNavigation.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Fetch projects and contacts from API when search query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsLoading(true);
      
      // Debounce the API calls
      const timer = setTimeout(() => {
        // Array to hold all fetch promises
        const fetchPromises = [];
        
        // Fetch projects if searching all, projects or solutions
        if (searchType === "all" || searchType === "project" || searchType === "solution") {
          const projectsPromise = fetch("/api/dossiers")
            .then(res => res.json())
            .then(data => {
              // Filter projects based on search query
              const filteredResults = data.filter(project => 
                (project.numero && project.numero.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.projet && Array.isArray(project.projet) && project.projet.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                (project.solution && project.solution.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.typeDeLogement && project.typeDeLogement.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.codePostal && project.codePostal.includes(searchQuery))
              );
              
              setProjectResults(filteredResults);
              
              // Create a mapping from contactId to projectId
              const contactProjectMapping = {};
              data.forEach(project => {
                if (project.contactId) {
                  contactProjectMapping[project.contactId] = project._id;
                }
              });
              setContactToProjectMap(contactProjectMapping);
              
              // Extract contact IDs to fetch contact details
              const contactIds = filteredResults
                .filter(project => project.contactId)
                .map(project => project.contactId);
                
              return contactIds;
            });
          
          fetchPromises.push(projectsPromise);
        }
        
        // Fetch contacts if searching all or clients
        if (searchType === "all" || searchType === "client") {
          // We'll implement a general contact search endpoint - for now, fetching all contacts
          const contactsPromise = fetch("/api/contacts")
            .then(res => res.json())
            .then(data => {
              // Filter contacts based on search query
              const filteredResults = data.filter(contact => 
                (contact.firstName && contact.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.lastName && contact.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.phone && contact.phone.includes(searchQuery)) ||
                (contact.mailingAddress && contact.mailingAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.numeroDossier && contact.numeroDossier.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.department && contact.department.includes(searchQuery))
              );
              
              setContactResults(filteredResults);
              return filteredResults;
            });
            
          fetchPromises.push(contactsPromise);
        }
        
        // Execute all fetches and then update the contacts map
        Promise.all(fetchPromises)
          .then(results => {
            // Now fetch individual contacts for projects if needed
            const contactIds = results[0] || [];
            if (contactIds.length > 0) {
              const contactFetches = contactIds.map(id => 
                fetch(`/api/contacts/${id}`)
                  .then(res => res.json())
                  .then(contact => ({ [id]: contact }))
                  .catch(() => ({ [id]: null }))
              );
              
              Promise.all(contactFetches)
                .then(contactsData => {
                  const newContactsMap = contactsData.reduce((acc, curr) => ({...acc, ...curr}), {});
                  setContactsMap(prev => ({...prev, ...newContactsMap}));
                  setIsLoading(false);
                });
            } else {
              setIsLoading(false);
            }
          })
          .catch(err => {
            console.error("Error fetching data:", err);
            setIsLoading(false);
          });
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setProjectResults([]);
      setContactResults([]);
    }
  }, [searchQuery, searchType]);

  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    // Add keyboard shortcut to focus search bar when "/" is pressed
    const handleKeyDown = (e) => {
      if (e.key === "/" && 
          !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Handle keyboard navigation through search results
  const handleKeyDown = (e) => {
    const totalResults = navSearchResults.length + projectResults.length + contactResults.length;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < totalResults - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (totalResults === 0) return;
      
      let currentIndex = activeSuggestionIndex;
      
      if (currentIndex < navSearchResults.length) {
        // Navigation item selected
        router.push(navSearchResults[currentIndex].href);
      } else {
        currentIndex -= navSearchResults.length;
        
        if (currentIndex < projectResults.length) {
          // Project selected
          router.push(`/dashboard/admin/projects/${projectResults[currentIndex]._id}`);
        } else {
          currentIndex -= projectResults.length;
          
          if (currentIndex < contactResults.length) {
            // Contact selected - route to project instead of contact page
            const contact = contactResults[currentIndex];
            const contactId = contact.contactId || contact._id;
            
            if (contactToProjectMap[contactId]) {
              router.push(`/dashboard/admin/projects/${contactToProjectMap[contactId]}`);
            } else {
              // Fallback to contact page if no project mapping exists
              router.push(`/dashboard/admin/contacts-organizations/${contactId}`);
            }
          }
        }
      }
      
      setSearchQuery("");
      setIsSearchFocused(false);
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  // Modal state for creation forms
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleCreate = (type) => {
    // For types that require a modal:
    if (type === "ticket" || type === "document" || type === "commentaire") {
      setModalType(type);
      setShowModal(true);
    } else {
      // For simple routing actions using the provided base URL (with a fallback if not provided)
      const baseUrl = createBaseUrl || "/dashboard/admin/contacts-organizations";
      router.push(`${baseUrl}/add-${type}`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  // Refreshing search
  const refreshSearch = () => {
    if (searchQuery.length >= 2) {
      setContactResults([]);
      setProjectResults([]);
      setIsLoading(true);
      
      const promises = [];
      
      if (searchType === "all" || searchType === "project" || searchType === "solution") {
        promises.push(
          fetch("/api/dossiers")
            .then(res => res.json())
            .then(data => {
              const filteredResults = data.filter(project => 
                (project.numero && project.numero.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.projet && Array.isArray(project.projet) && project.projet.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                (project.solution && project.solution.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.typeDeLogement && project.typeDeLogement.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.codePostal && project.codePostal.includes(searchQuery))
              );
              
              setProjectResults(filteredResults);
              
              // Update contact to project mapping
              const contactProjectMapping = {};
              data.forEach(project => {
                if (project.contactId) {
                  contactProjectMapping[project.contactId] = project._id;
                }
              });
              setContactToProjectMap(contactProjectMapping);
            })
        );
      }
      
      if (searchType === "all" || searchType === "client") {
        promises.push(
          fetch("/api/contacts")
            .then(res => res.json())
            .then(data => {
              const filteredResults = data.filter(contact => 
                (contact.firstName && contact.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.lastName && contact.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.phone && contact.phone.includes(searchQuery)) ||
                (contact.mailingAddress && contact.mailingAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.numeroDossier && contact.numeroDossier.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (contact.department && contact.department.includes(searchQuery))
              );
              
              setContactResults(filteredResults);
            })
        );
      }
      
      Promise.all(promises)
        .then(() => setIsLoading(false))
        .catch(err => {
          console.error("Error refreshing search:", err);
          setIsLoading(false);
        });
    }
    searchInputRef.current?.focus();
  };

  // Get status color based on etape
  const getStatusColor = (etape) => {
    if (!etape) return "#ccc";
    
    const step = parseInt(etape.charAt(0));
    switch (step) {
      case 1: return "#bfddf9";
      case 2: return "#d2fcb2";
      case 3: return "#f7b91b";
      case 4: return "#a6e4d0";
      case 5: return "#92d1e0";
      case 6: return "#7aafc2";
      case 7: return "#5d8ba3";
      default: return "#ccc";
    }
  };

  // Get initials from name
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Format address to display only city
  const getCity = (address) => {
    if (!address) return "N/A";
    
    // Try to extract postal code and city
    const match = address.match(/(\d{5})\s+([^\d,]+)/);
    if (match && match[2]) {
      return match[2].trim();
    }
    
    // Otherwise return a substring
    const parts = address.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : address.substring(0, 15) + "...";
  };

  // Determine the profile dropdown items based on the user's role.
  const role = user.role;
  let profileItems = [];

  switch (role) {
    case "Sales Representative / Account Executive":
      profileItems = [
        {
          label: "Mon Profil",
          route: "/dashboard/sales/profile",
          icon: UserCircleIcon,
        },
        {
          label: "Paramètres du compte",
          route: "/dashboard/sales/account-settings",
          icon: Cog6ToothIcon,
        },
      ];
      break;
    case "Project / Installation Manager":
      profileItems = [
        {
          label: "Mon Profil",
          route: "/dashboard/pm/profile",
          icon: UserCircleIcon,
        },
        {
          label: "Paramètres du compte",
          route: "/dashboard/pm/account-settings",
          icon: Cog6ToothIcon,
        },
      ];
      break;
    case "Technician / Installer":
      profileItems = [
        {
          label: "Mon Profil",
          route: "/dashboard/technician/profile",
          icon: UserCircleIcon,
        },
        {
          label: "Paramètres du compte",
          route: "/dashboard/technician/account-settings",
          icon: Cog6ToothIcon,
        },
      ];
      break;
    case "Customer Support / Service Representative":
      profileItems = [
        {
          label: "Mon Profil",
          route: "/dashboard/support/profile",
          icon: UserCircleIcon,
        },
        {
          label: "Paramètres du compte",
          route: "/dashboard/support/account-settings",
          icon: Cog6ToothIcon,
        },
      ];
      break;
    case "Client / Customer (Client Portal)":
      profileItems = [
        {
          label: "Mon Profil",
          route: "/client/profile",
          icon: UserCircleIcon,
        },
        {
          label: "Paramètres du compte",
          route: "/client/account-settings",
          icon: Cog6ToothIcon,
        },
      ];
      break;
    default:
      profileItems = [
        {
          label: "Mon Profil",
          route: "/dashboard/admin/reglages",
          icon: UserCircleIcon,
        },
        {
          label: "Paramètres du compte",
          route: "/dashboard/admin/account-settings",
          icon: Cog6ToothIcon,
        },
      ];
      break;
  }

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm z-30">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section – Logo & Search */}
          <div className="flex items-center gap-6 w-full max-w-4xl">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png"
                alt="Company Logo"
                width={160}
                height={40}
                className="h-10 w-auto transition-opacity hover:opacity-80"
                priority
              />
            </motion.div>

            {/* Improved Search Bar - Fixed visibility issue */}
            <div 
              ref={searchContainerRef}
              className="relative flex-1"
            >
              <motion.div
                className={cn(
                  "flex flex-col rounded-xl transition-all duration-300 overflow-visible",
                  isSearchFocused
                    ? "border border-[#213f5b]/50 bg-white shadow-lg ring-1 ring-[#213f5b]/20"
                    : "border border-gray-100 bg-gray-50/50 hover:border-gray-200"
                )}
              >
                {/* Search header with label - Only visible when focused */}
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div 
                      className="px-4 py-2 bg-gradient-to-r from-[#213f5b]/5 to-[#bfddf9]/10 border-b border-[#bfddf9]/20"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <h3 className="text-xs font-medium text-[#213f5b] flex items-center">
                        <SearchIcon className="h-3.5 w-3.5 mr-2 text-[#4facfe]" />
                        Rechercher dans Admin
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main search input with enhanced UI */}
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-4 shrink-0 transition-colors group-hover:text-[#213f5b]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent px-4 py-2.5 text-sm focus:outline-none placeholder-gray-400 truncate peer"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() =>
                      // Delay blur to allow click events on suggestions
                      setTimeout(() => setIsSearchFocused(false), 200)
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-autocomplete="list"
                    aria-activedescendant={activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined}
                  />

                  {/* Search type selector - only visible when focused */}
                  <AnimatePresence>
                    {isSearchFocused && (
                      <motion.div 
                        className="mr-1"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                      >
                        <select 
                          className="text-xs bg-[#f5f9fe] border border-[#bfddf9]/40 rounded-md py-1 px-2 text-[#213f5b] focus:outline-none focus:ring-1 focus:ring-[#4facfe]"
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}
                        >
                          <option value="all">Tous</option>
                          <option value="client">Clients</option>
                          <option value="project">Projets</option>
                          <option value="solution">Solutions</option>
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  <div className="flex items-center pr-3 space-x-1">
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={clearSearch}
                          className="p-1 text-gray-400 hover:text-[#213f5b] hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                    
                    <AnimatePresence>
                      {isSearchFocused && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={refreshSearch}
                          className={`p-1 rounded-md transition-colors ${isLoading ? 'text-gray-400' : 'text-[#4facfe] hover:bg-[#4facfe]/10'}`}
                        >
                          <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Quick filters - only visible when focused */}
                <AnimatePresence>
                  {isSearchFocused && searchQuery && (
                    <motion.div 
                      className="px-4 py-2 bg-gray-50 border-t border-[#bfddf9]/20 flex items-center flex-wrap gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <span className="text-xs text-gray-500 flex items-center">
                        <FunnelIcon className="h-3 w-3 mr-1" />
                        Filtres:
                      </span>
                      {["Clients", "Projets", "Solutions", "Numéros"].map((filterType) => (
                        <button 
                          key={filterType}
                          className={`px-2 py-0.5 text-xs rounded-md transition-all ${
                            (filterType === "Clients" && searchType === "client") ||
                            (filterType === "Projets" && searchType === "project") || 
                            (filterType === "Solutions" && searchType === "solution")
                              ? "bg-[#4facfe] text-white"
                              : "bg-white border border-[#bfddf9]/40 text-[#213f5b] hover:bg-[#4facfe]/5 hover:border-[#4facfe]/40"
                          }`}
                          onClick={() => {
                            // Set search type based on filter button
                            setSearchType(filterType.toLowerCase() === "clients" ? "client" : 
                                         filterType.toLowerCase() === "projets" ? "project" : 
                                         filterType.toLowerCase() === "solutions" ? "solution" : "all");
                          }}
                        >
                          {filterType}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Combined Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery && (navSearchResults.length > 0 || projectResults.length > 0 || contactResults.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg z-50 border border-[#bfddf9]/30 max-h-[80vh] overflow-hidden"
                    style={{ minWidth: searchContainerRef.current?.offsetWidth || 'auto' }}
                  >
                    <div className="max-h-[80vh] overflow-y-auto">
                      {/* Nav Results Section */}
                      {navSearchResults.length > 0 && (
                        <div>
                          <div className="px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                            Pages
                          </div>
                          <ul>
                            {navSearchResults.map((item, index) => {
                              const IconComponent = item.icon;
                              return (
                                <li key={`nav-${item.href}`}>
                                  <Link
                                    href={item.href}
                                    onClick={() => {
                                      setSearchQuery("");
                                      setIsSearchFocused(false);
                                    }}
                                    className={cn(
                                      "flex items-center px-4 py-2 text-sm hover:bg-[#4facfe]/5",
                                      index === activeSuggestionIndex && "bg-[#4facfe]/10 text-[#213f5b]"
                                    )}
                                    id={`suggestion-${index}`}
                                  >
                                    {IconComponent && (
                                      <IconComponent className="w-5 h-5 mr-2 text-gray-400" />
                                    )}
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Contact Results Section */}
                      {contactResults.length > 0 && (
                        <div>
                          <div className="px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                            {`Clients (${contactResults.length})`}
                          </div>
                          <ul>
                            {contactResults.map((contact, index) => {
                              const realIndex = navSearchResults.length + index;
                              const initials = getInitials(contact.firstName, contact.lastName);
                              const contactId = contact.contactId || contact._id;
                              const hasProject = contactToProjectMap[contactId];
                              
                              return (
                                <li key={`contact-${contactId}`}>
                                  <Link
                                    href={hasProject 
                                      ? `/dashboard/admin/projects/${contactToProjectMap[contactId]}` 
                                      : `/dashboard/admin/contacts-organizations/${contactId}`}
                                    onClick={() => {
                                      setSearchQuery("");
                                      setIsSearchFocused(false);
                                    }}
                                    className={cn(
                                      "flex items-center px-4 py-3 text-sm hover:bg-[#4facfe]/5 border-b border-gray-50",
                                      realIndex === activeSuggestionIndex && "bg-[#4facfe]/10 text-[#213f5b]"
                                    )}
                                    id={`suggestion-${realIndex}`}
                                  >
                                    <div className="flex items-start w-full">
                                      {/* Contact Avatar */}
                                      <div 
                                        className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white text-sm font-medium bg-gradient-to-br from-[#4facfe] to-[#1d6fa5] shrink-0"
                                      >
                                        {initials}
                                      </div>
                                      
                                      {/* Contact Info */}
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-[#213f5b]">
                                          {contact.firstName} {contact.lastName}
                                        </div>
                                        
                                        <div className="flex flex-col gap-1 mt-1">
                                          {contact.email && (
                                            <div className="flex items-center text-xs text-gray-500">
                                              <EnvelopeIcon className="w-3 h-3 mr-1 text-gray-400" />
                                              <span className="truncate max-w-[220px]">{contact.email}</span>
                                            </div>
                                          )}
                                          
                                          {contact.phone && (
                                            <div className="flex items-center text-xs text-gray-500">
                                              <PhoneIcon className="w-3 h-3 mr-1 text-gray-400" />
                                              <span>{contact.phone}</span>
                                            </div>
                                          )}
                                          
                                          {contact.mailingAddress && (
                                            <div className="flex items-center text-xs text-gray-500">
                                              <MapPinIcon className="w-3 h-3 mr-1 text-gray-400" />
                                              <span className="truncate max-w-[220px]">{getCity(contact.mailingAddress)}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Project Reference */}
                                      {contact.numeroDossier && (
                                        <div className="ml-2 flex flex-col items-end">
                                          <span className="text-xs text-gray-500">Dossier</span>
                                          <span className="text-xs font-medium text-[#213f5b] bg-gray-100 px-2 py-0.5 rounded-md">
                                            {contact.numeroDossier}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Project Results Section */}
                      {projectResults.length > 0 && (
                        <div>
                          <div className="px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                            {`Projets (${projectResults.length})`}
                          </div>
                          <ul>
                            {projectResults.map((project, index) => {
                              const realIndex = navSearchResults.length + contactResults.length + index;
                              const statusColor = getStatusColor(project.etape);
                              const contact = project.contactId ? contactsMap[project.contactId] : null;
                              
                              return (
                                <li key={`project-${project._id}`}>
                                  <Link
                                    href={`/dashboard/admin/projects/${project._id}`}
                                    onClick={() => {
                                      setSearchQuery("");
                                      setIsSearchFocused(false);
                                    }}
                                    className={cn(
                                      "flex items-center px-4 py-3 text-sm hover:bg-[#4facfe]/5 border-b border-gray-50",
                                      realIndex === activeSuggestionIndex && "bg-[#4facfe]/10 text-[#213f5b]"
                                    )}
                                    id={`suggestion-${realIndex}`}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center min-w-0">
                                        <div 
                                          className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-[#213f5b] text-xs font-medium shrink-0"
                                          style={{ backgroundColor: statusColor }}
                                        >
                                          {project.etape ? project.etape.charAt(0) : "?"}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-medium text-[#213f5b] truncate max-w-[220px]">{project.numero || "Sans numéro"}</div>
                                          
                                          {/* Contact information if available */}
                                          {contact && (
                                            <div className="text-xs text-gray-500 flex items-center">
                                              <UserCircleIcon className="w-3 h-3 mr-1" />
                                              <span className="truncate max-w-[180px]">{contact.firstName} {contact.lastName}</span>
                                            </div>
                                          )}
                                          
                                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                            <span className="flex items-center truncate max-w-[120px]">
                                              <HomeIcon className="w-3 h-3 mr-1" />
                                              {project.typeDeLogement || "N/A"}
                                            </span>
                                            {project.codePostal && (
                                              <span>{project.codePostal}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-xs ml-2">
                                        <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] text-right">
                                          {project.solution || "Aucune solution"}
                                        </div>
                                        <div className="text-xs rounded-full px-2 py-0.5 inline-flex items-center mt-1 justify-end" 
                                             style={{ backgroundColor: `${statusColor}40`, color: "#213f5b" }}>
                                          {project.etape || "Étape inconnue"}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Loading indicator */}
                      {isLoading && (
                        <div className="flex items-center justify-center py-3 bg-gray-50/50">
                          <ArrowPathIcon className="w-4 h-4 text-[#4facfe] animate-spin mr-2" />
                          <span className="text-sm text-gray-500">Recherche en cours...</span>
                        </div>
                      )}
                      
                      {/* No results */}
                      {!isLoading && searchQuery.length >= 2 && 
                        navSearchResults.length === 0 && 
                        projectResults.length === 0 && 
                        contactResults.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                          <SearchIcon className="w-8 h-8 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">Aucun résultat trouvé pour "{searchQuery}"</p>
                          <p className="text-xs text-gray-400 mt-1">Essayez avec d'autres termes ou filtres</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated Progress Bar */}
              <motion.div
                className="absolute bottom-0 h-0.5 bg-[#213f5b]/30 origin-left"
                animate={{ scaleX: isSearchFocused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Keyboard shortcut hint */}
              {!isSearchFocused && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">/</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section – Actions */}
          <div className="flex items-center gap-3">
            {/* "Créer" Dropdown (if items provided) */}
            {createDropdownItems && createDropdownItems.length > 0 && (
              <Menu as="div" className="relative">
                <Menu.Button
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-[#213f5b] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-[#213f5b]/90 transition-all"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="hidden lg:inline">Créer</span>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-1 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-1 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100 focus:outline-none p-2 space-y-1 z-50">
                    {createDropdownItems.map((item) => (
                      <Menu.Item key={item.type}>
                        {({ active }) => (
                          <button
                            onClick={() => handleCreate(item.type)}
                            className={cn(
                              "w-full px-4 py-2.5 text-left rounded-lg text-sm flex items-center gap-3",
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-gray-700"
                            )}
                          >
                            {item.icon && (
                              <item.icon className="h-4 w-4 opacity-70" />
                            )}
                            {item.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {/* Notification Bell with Animation */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button
                    as={motion.button}
                    className="relative p-2 rounded-xl hover:bg-gray-50 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={open ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <BellIcon className="h-6 w-6 text-gray-600 group-hover:text-[#213f5b] transition-colors" />
                      <motion.div 
                        className="absolute -top-1 -right-1 flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white justify-center items-center font-medium shadow-sm">
                            8
                          </span>
                        </span>
                      </motion.div>
                    </motion.div>
                  </Menu.Button>
                  
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95 translate-y-2"
                    enterTo="transform opacity-1 scale-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-1 scale-100 translate-y-0"
                    leaveTo="transform opacity-0 scale-95 translate-y-2"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-[420px] max-h-[85vh] origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100/40 focus:outline-none overflow-hidden z-50 backdrop-blur-sm">
                      {/* Elegant Header */}
                      <div className="px-4 py-3 border-b border-gray-100 flex flex-col bg-gradient-to-r from-[#213f5b]/5 to-[#bfddf9]/10">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-[#213f5b] flex items-center">
                            <BellIcon className="h-4 w-4 mr-2 text-[#4facfe]" />
                            Centre de Notifications
                          </h3>
                          <div className="flex items-center gap-2">
                            <button className="text-xs text-[#4facfe] hover:text-[#213f5b] transition-colors flex items-center">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1"
                              >
                                <span>Tout marquer comme lu</span>
                              </motion.div>
                            </button>
                            <button className="text-gray-400 hover:text-[#213f5b] transition-colors p-1 rounded-full hover:bg-gray-100">
                              <Cog6ToothIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex gap-1 pb-1">
                          <button className="px-3 py-1.5 text-xs font-medium bg-[#4facfe] text-white rounded-md hover:bg-[#1d6fa5] transition-colors">
                            Toutes (8)
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium text-[#213f5b] hover:bg-[#4facfe]/10 rounded-md transition-colors">
                            Non lues (5)
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium text-[#213f5b] hover:bg-[#4facfe]/10 rounded-md transition-colors flex items-center">
                            <SparklesIcon className="h-3 w-3 mr-1" />
                            Importantes (2)
                          </button>
                        </div>
                      </div>
                      
                      {/* Search Filter */}
                      <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100">
                        <div className="relative flex items-center">
                          <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Rechercher dans les notifications..." 
                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4facfe] focus:border-[#4facfe]"
                          />
                        </div>
                      </div>
                      
                      {/* Notification List with Time Grouping */}
                      <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
                        {/* Today Group */}
                        <div>
                          <div className="sticky top-0 z-10 px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100/80 flex items-center justify-between">
                            <span>Aujourd'hui</span>
                            <span className="bg-[#4facfe]/10 text-[#213f5b] px-1.5 py-0.5 rounded-full text-xs">4 nouvelles</span>
                          </div>
                          
                          {/* High Priority Notification */}
                          <Menu.Item>
                            {({ active }) => (
                              <motion.div 
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                                className={`px-4 py-3 ${active ? "bg-[#4facfe]/5" : ""} relative group transition-all duration-200`}
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex">
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="relative">
                                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shadow-sm border border-red-200">
                                        <SparklesIcon className="h-6 w-6 text-red-600" />
                                      </div>
                                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium border border-white">!</span>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-[#213f5b]">Impayé signalé</p>
                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full uppercase tracking-wide font-bold">
                                          Urgent
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">Il y a 15 min</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 mb-3 leading-relaxed">
                                      La facture <span className="font-medium text-[#213f5b]">FACT-2025-143</span> (3,850.00€) pour le projet <span className="font-medium text-[#213f5b]">ENER-2025-059</span> est en retard de paiement depuis 14 jours.
                                    </p>
                                    <div className="flex gap-2">
                                      <button className="px-2.5 py-1.5 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm">
                                        Contacter le client
                                      </button>
                                      <button className="px-2.5 py-1.5 text-xs text-[#213f5b] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                        Voir la facture
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </Menu.Item>
                          
                          {/* Projet notification with user avatar */}
                          <Menu.Item>
                            {({ active }) => (
                              <motion.div 
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                                className={`px-4 py-3 ${active ? "bg-[#4facfe]/5" : ""} relative group transition-all duration-200`}
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4facfe]"></div>
                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex">
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="relative">
                                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4facfe] to-[#1d6fa5] flex items-center justify-center shadow-sm">
                                        <FolderIcon className="h-6 w-6 text-white" />
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white p-0.5 shadow">
                                        <div className="h-full w-full rounded-full bg-[#213f5b] flex items-center justify-center text-[10px] text-white font-bold">
                                          CS
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-[#213f5b]">Nouveau projet assigné</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4facfe] opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4facfe]"></span>
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">Il y a 28 min</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 mb-2 leading-relaxed">
                                      <span className="font-medium text-[#213f5b]">Caroline Sanchez</span> vous a assigné le projet <span className="font-medium text-[#213f5b]">ENER-2025-086</span> pour l'installation de panneaux photovoltaïques (33,6m²) au 24 Rue du Moulin, 75012 Paris.
                                    </p>
                                    <div className="p-2 bg-[#f8fafc] rounded-md border border-gray-100 mb-3 text-xs text-gray-500 flex items-center">
                                      <CalendarIcon className="h-3 w-3 mr-1.5 text-[#4facfe]" />
                                      Date d'installation prévue: <span className="font-medium text-[#213f5b] ml-1">15 Mai 2025</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <button className="px-2.5 py-1.5 text-xs font-medium bg-[#4facfe] text-white rounded-md hover:bg-[#1d6fa5] transition-colors shadow-sm">
                                        Voir le projet
                                      </button>
                                      <button className="px-2.5 py-1.5 text-xs text-[#213f5b] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                        Confirmer réception
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </Menu.Item>
                          
                          {/* Document notification with preview */}
                          <Menu.Item>
                            {({ active }) => (
                              <motion.div 
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                                className={`px-4 py-3 ${active ? "bg-[#4facfe]/5" : ""} relative group transition-all duration-200`}
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex">
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="relative">
                                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm border border-green-200">
                                        <DocumentIcon className="h-6 w-6 text-green-600" />
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white p-0.5 shadow">
                                        <div className="h-full w-full rounded-full bg-green-500 flex items-center justify-center">
                                          <TicketIcon className="h-3 w-3 text-white" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-[#213f5b]">Document signé</p>
                                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full uppercase tracking-wide font-bold">
                                          Nouveau
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">Aujourd'hui à 9:15</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 mb-2 leading-relaxed">
                                      <span className="font-medium text-[#213f5b]">Sophie Leroux</span> a signé le contrat pour le projet <span className="font-medium text-[#213f5b]">ENER-2025-067</span>.
                                    </p>
                                    
                                    {/* Document Preview */}
                                    <div className="flex items-center gap-2 p-2 bg-[#f8fafc] rounded-md border border-gray-100 mb-3 group-hover:border-green-200 transition-all">
                                      <div className="w-8 h-10 bg-white shadow-sm border border-gray-200 flex flex-col">
                                        <div className="h-2 bg-green-500 w-full"></div>
                                        <div className="flex-1 p-1">
                                          <div className="w-full h-1 bg-gray-200 mb-1"></div>
                                          <div className="w-3/4 h-1 bg-gray-200 mb-1"></div>
                                          <div className="w-1/2 h-1 bg-gray-200"></div>
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-medium text-[#213f5b] truncate">Contrat_Installation_ENER-2025-067.pdf</div>
                                        <div className="text-[10px] text-gray-500 flex items-center">
                                          <span>Signé électroniquement le 17/04/2025</span>
                                          <span className="mx-1">•</span>
                                          <span>2.4 MB</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <button className="px-2.5 py-1.5 text-xs font-medium bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm">
                                        Voir le document
                                      </button>
                                      <button className="px-2.5 py-1.5 text-xs text-[#213f5b] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                        Marquer comme lu
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </Menu.Item>
                          
                          {/* Chat notification */}
                          <Menu.Item>
                            {({ active }) => (
                              <motion.div 
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                                className={`px-4 py-3 ${active ? "bg-[#4facfe]/5" : ""} relative group transition-all duration-200`}
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex">
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="relative">
                                      <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-gray-200 p-0.5">
                                        <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                                          <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-indigo-800">
                                            JD
                                          </div>
                                        </div>
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white p-0.5 shadow">
                                        <div className="h-full w-full rounded-full bg-indigo-500 flex items-center justify-center">
                                          <ChatBubbleBottomCenterIcon className="h-3 w-3 text-white" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-[#213f5b]">Nouveau message</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">Aujourd'hui à 11:39</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 mb-2 font-medium">
                                      Jean Dupont: <span className="font-normal">Bonjour, est-ce que vous pourriez me confirmer la date d'installation pour les panneaux photovoltaïques ?</span>
                                    </p>
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 mb-3">
                                      <div className="flex items-start gap-2">
                                        <div className="w-1 h-full bg-indigo-200 rounded-full"></div>
                                        <div className="flex-1">
                                          <p className="text-xs text-indigo-700">Projet associé:</p>
                                          <p className="text-xs font-medium text-indigo-900">ENER-2025-034: Installation 18 panneaux (Résidentiel)</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button className="px-2.5 py-1.5 text-xs font-medium bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors shadow-sm">
                                        Répondre
                                      </button>
                                      <button className="px-2.5 py-1.5 text-xs text-[#213f5b] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                        Voir la conversation
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </Menu.Item>
                        </div>
                        
                        {/* Yesterday Group */}
                        <div>
                          <div className="sticky top-0 z-10 px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100/80 flex items-center justify-between">
                            <span>Hier</span>
                            <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">3 notifications</span>
                          </div>
                          
                          {/* Warning notification */}
                          <Menu.Item>
                            {({ active }) => (
                              <motion.div 
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                                className={`px-4 py-3 ${active ? "bg-[#4facfe]/5" : ""} relative group transition-all duration-200`}
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex">
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="relative">
                                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shadow-sm border border-amber-200">
                                        <CalendarIcon className="h-6 w-6 text-amber-600" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-[#213f5b]">Rappel important</p>
                                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full uppercase tracking-wide">
                                          Rappel
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-400 whitespace-nowrap">Hier à 15:42</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 mb-2 leading-relaxed">
                                      Réunion client avec <span className="font-medium text-[#213f5b]">Martin Dubois</span> concernant le projet <span className="font-medium text-[#213f5b]">ENER-2025-042</span> demain à 14h00.
                                    </p>
                                    <div className="p-2 bg-amber-50 rounded-md border border-amber-100 mb-3 text-xs">
                                      <div className="flex items-center text-amber-800">
                                        <MapPinIcon className="h-3 w-3 mr-1.5 text-amber-600" />
                                        <span className="font-medium">42 Avenue des Lilas, 75020 Paris</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button className="px-2.5 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm">
                                        Ajouter à l'agenda
                                      </button>
                                      <button className="px-2.5 py-1.5 text-xs text-[#213f5b] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                        Ignorer
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </Menu.Item>
                          
                          {/* Two more notification stubs */}
                          <Menu.Item>
                            {({ active }) => (
                              <div className={`px-4 py-3 ${active ? "bg-[#4facfe]/5" : ""} relative group transition-all duration-200 opacity-90`}>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                                <div className="flex">
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shadow-sm border border-purple-200">
                                      <TruckIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-[#213f5b]">Livraison programmée</p>
                                      <span className="text-xs text-gray-400 whitespace-nowrap">Hier à 10:26</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 mb-2">
                                      Les composants pour le projet <span className="font-medium text-[#213f5b]">ENER-2025-053</span> seront livrés demain entre 9h et 12h.
                                    </p>
                                    <div className="flex gap-2">
                                      <button className="px-2.5 py-1.5 text-xs font-medium bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors shadow-sm">
                                        Détails de livraison
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                        </div>
                        
                        {/* Cette Semaine Group */}
                        <div>
                          <div className="sticky top-0 z-10 px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100/80">
                            Cette Semaine
                          </div>
                          
                          <Menu.Item>
                            {({ active }) => (
                              <div className={`px-4 py-3 ${active ? "bg-[#4facfe]/5" : ""} relative group transition-all duration-200 opacity-85`}>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
                                <div className="flex">
                                  <div className="mr-3 flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center shadow-sm border border-teal-200">
                                      <ShoppingBagIcon className="h-6 w-6 text-teal-600" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-[#213f5b]">Nouvelle commande</p>
                                      <span className="text-xs text-gray-400 whitespace-nowrap">Lundi à 14:15</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 mb-2">
                                      Commande <span className="font-medium text-[#213f5b]">CMD-4502</span> confirmée: 12 panneaux photovoltaïques et 2 onduleurs.
                                    </p>
                                    <div className="flex gap-2">
                                      <button className="px-2.5 py-1.5 text-xs font-medium bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors shadow-sm">
                                        Détails de la commande
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                        </div>
                      </div>
                      
                      {/* Empty state (hidden when there are notifications) */}
                      <div className="hidden py-8 px-4 text-center">
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 mb-4 border border-gray-200">
                          <BellIcon className="h-10 w-10 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-[#213f5b]">Aucune notification</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Les notifications concernant vos projets, clients et tâches apparaîtront ici.</p>
                        <button className="mt-4 px-4 py-2 text-xs font-medium text-[#4facfe] border border-[#4facfe]/30 rounded-lg hover:bg-[#4facfe]/5 transition-colors">
                          Configurer mes notifications
                        </button>
                      </div>
                      
                      {/* Loading state (hidden by default) */}
                      <div className="hidden py-8 px-4 text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 mb-4">
                          <svg className="animate-spin h-10 w-10 text-[#4facfe]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-[#213f5b]">Chargement des notifications</p>
                        <p className="text-xs text-gray-500 mt-1">Veuillez patienter un instant...</p>
                      </div>
                      
                      {/* Footer with Enhancement */}
                      <div className="border-t border-gray-100 p-3 bg-gradient-to-r from-[#f8fafc] to-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <ArrowPathIcon className="h-3 w-3 mr-1" />
                            <span>Dernière mise à jour: il y a 2 minutes</span>
                          </div>
                          <button className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#213f5b] transition-colors">
                            <ArrowPathIcon className="h-3 w-3" />
                          </button>
                        </div>
                        <Link
                          href="/dashboard/admin/notifications"
                          className="flex items-center justify-center w-full py-2 text-xs font-medium text-white bg-[#213f5b] hover:bg-[#1a324a] rounded-lg transition-colors shadow-sm"
                        >
                          <span>Voir toutes les notifications</span>
                          <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Menu.Button className="group relative">
                  <svg
                    className="h-9 w-9 text-[#213f5b] hover:text-[#213f5b] transition-colors"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="currentColor"
                      className="opacity-10"
                    />
                    <circle
                      cx="18"
                      cy="13.5"
                      r="4.5"
                      fill="currentColor"
                      className="opacity-30"
                    />
                    <path
                      d="M30 28.5C30 31.5376 27.5376 34 24.5 34H11.5C8.46243 34 6 31.5376 6 28.5C6 25.4624 8.46243 23 11.5 23H24.5C27.5376 23 30 25.4624 30 28.5Z"
                      fill="currentColor"
                      className="opacity-30"
                    />
                  </svg>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                </Menu.Button>
              </motion.div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-1 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-1 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100 focus:outline-none p-2 space-y-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name || user.email || "Utilisateur"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email || "user@example.com"}
                    </p>
                  </div>
                  {profileItems.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => router.push(item.route)}
                          className={cn(
                            "w-full px-4 py-2.5 text-left rounded-lg text-sm flex items-center gap-3",
                            active ? "bg-primary/10 text-primary" : "text-gray-700"
                          )}
                        >
                          <div className="h-6 w-6 bg-primary/10 rounded-lg flex items-center justify-center">
                            <item.icon className="h-4 w-4" />
                          </div>
                          {item.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          localStorage.clear();
                          router.push("/");
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left rounded-lg text-sm",
                          active ? "bg-red-100 text-red-600" : "text-gray-700"
                        )}
                      >
                        Déconnexion
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </header>

      {/* Modals for creation forms */}
      {showModal && modalType === "ticket" && (
        <AddTicketForm contactId={contactId} onClose={closeModal} />
      )}
      {showModal && modalType === "document" && (
        <AddDossierForm contactId={contactId} onClose={closeModal} />
      )}
      {showModal && modalType === "commentaire" && (
        <AddCommentForm contactId={contactId} onClose={closeModal} />
      )}
    </>
  );
}

/**
 * Specialized header for Sales Representative / Account Executive
 */
function SalesHeader({ user, contactId }) {
  const navigation = [
    { name: "Accueil", href: "/dashboard/sales", icon: HomeIcon },
    { name: "Leads", href: "/dashboard/sales/leads", icon: SparklesIcon },
    { name: "Opportunités", href: "/dashboard/sales/opportunities", icon: BriefcaseIcon },
    { name: "Clients & Organisations", href: "/dashboard/sales/contacts-organizations", icon: UserCircleIcon },
    { name: "Chat", href: "/dashboard/sales/emails", icon: EnvelopeIcon },
    { name: "Agenda", href: "/dashboard/sales/calendar", icon: CalendarIcon },
  ];

  const createDropdownItems = [
    { type: "contact", label: "Créer un prospect", icon: UserCircleIcon },
    // { type: "lead", label: "Créer un lead", icon: SparklesIcon },
    { type: "ticket", label: "Créer un ticket S.A.V", icon: TicketIcon },
  ];

  const searchPlaceholder = "Rechercher dans Sales...";

  // Specify the base URL for create actions in sales role
  const createBaseUrl = "/dashboard/sales/add";

  return (
    <HeaderLayout
      createDropdownItems={createDropdownItems}
      navigation={navigation}
      searchPlaceholder={searchPlaceholder}
      user={user}
      contactId={contactId}
      createBaseUrl={createBaseUrl}
    />
  );
}

/**
 * Specialized header for Project / Installation Manager
 */
function PMHeader({ user, contactId }) {
  const navigation = [
    { name: "Accueil", href: "/dashboard/pm", icon: HomeIcon },
    { name: "Projets", href: "/dashboard/pm/projects", icon: FolderIcon },
    { name: "Tâches", href: "/dashboard/pm/tasks", icon: ClipboardDocumentCheckIcon },
    { name: "Clients & Organisations", href: "/dashboard/pm/contacts-organizations", icon: UserCircleIcon },
    { name: "Agenda", href: "/dashboard/pm/calendar", icon: CalendarIcon },
    { name: "Chat", href: "/dashboard/pm/emails", icon: EnvelopeIcon },
    { name: "Documents / Bibliothèque", href: "/dashboard/pm/documents", icon: DocumentIcon },
  ];

  const createDropdownItems = [
    { type: "contact", label: "Créer un client", icon: UserCircleIcon },
    { type: "projet", label: "Créer un projet", icon: FolderIcon },
    { type: "tache", label: "Créer une tâche", icon: ClipboardDocumentCheckIcon },
    { type: "document", label: "Ajouter un document", icon: DocumentIcon },
    { type: "commentaire", label: "Ajouter un commentaire", icon: ClipboardDocumentCheckIcon },
  ];

  const searchPlaceholder = "Rechercher dans PM...";
  
  // Specify the base URL for create actions in PM role
  const createBaseUrl = "/dashboard/pm/add";

  return (
    <HeaderLayout
      createDropdownItems={createDropdownItems}
      navigation={navigation}
      searchPlaceholder={searchPlaceholder}
      user={user}
      contactId={contactId}
      createBaseUrl={createBaseUrl}
    />
  );
}

/**
 * Specialized header for Technician / Installer
 */
function TechnicianHeader({ user, contactId }) {
  const navigation = [
    { name: "Accueil", href: "/dashboard/technician", icon: HomeIcon },
    { name: "Tâches / Jobs", href: "/dashboard/technician/tasks", icon: ClipboardDocumentCheckIcon },
    { name: "Projets", href: "/dashboard/technician/projects", icon: FolderIcon },
    { name: "Agenda", href: "/dashboard/technician/calendar", icon: CalendarIcon },
    { name: "Documents / Bibliothèque", href: "/dashboard/technician/documents", icon: DocumentIcon },
  ];

  const createDropdownItems = [
    { type: "ticket", label: "Créer un ticket S.A.V", icon: TicketIcon },
    { type: "document", label: "Ajouter un document", icon: DocumentIcon },
    { type: "commentaire", label: "Ajouter un commentaire", icon: ClipboardDocumentCheckIcon },
  ];

  const searchPlaceholder = "Rechercher dans Technician...";
  
  // Specify the base URL for create actions in Technician role
  const createBaseUrl = "/dashboard/technician/add";

  return (
    <HeaderLayout
      createDropdownItems={createDropdownItems}
      navigation={navigation}
      searchPlaceholder={searchPlaceholder}
      user={user}
      contactId={contactId}
      createBaseUrl={createBaseUrl}
    />
  );
}

/**
 * Specialized header for Customer Support / Service Representative
 */
function SupportHeader({ user, contactId }) {
  const navigation = [
    { name: "Accueil", href: "/dashboard/support", icon: HomeIcon },
    { name: "Support & Tickets", href: "/dashboard/support/tickets", icon: LifebuoyIcon },
    { name: "Clients & Organisations", href: "/dashboard/support/contacts-organizations", icon: UserCircleIcon },
    { name: "Chat", href: "/dashboard/support/emails", icon: EnvelopeIcon },
    { name: "Agenda", href: "/dashboard/support/calendar", icon: CalendarIcon },
    { name: "Documents / Bibliothèque", href: "/dashboard/support/documents", icon: DocumentIcon },
  ];

  const createDropdownItems = [
    { type: "ticket", label: "Créer un ticket S.A.V", icon: LifebuoyIcon },
    { type: "commentaire", label: "Ajouter un commentaire", icon: ClipboardDocumentCheckIcon },
  ];

  const searchPlaceholder = "Rechercher dans Support...";
  
  // Specify the base URL for create actions in Support role
  const createBaseUrl = "/dashboard/support/add";

  return (
    <HeaderLayout
      createDropdownItems={createDropdownItems}
      navigation={navigation}
      searchPlaceholder={searchPlaceholder}
      user={user}
      contactId={contactId}
      createBaseUrl={createBaseUrl}
    />
  );
}

/**
 * Specialized header for Client / Customer (Client Portal)
 */
function ClientHeader({ user, contactId }) {
  const navigation = [
    { name: "Accueil", href: "/client/dashboard", icon: HomeIcon },
    { name: "Mes Projets / Suivi des Projets", href: "/client/projects", icon: FolderIcon },
    // { name: "Facturation / Paiements", href: "/client/billing", icon: CreditCardIcon },
    { name: "Support / Tickets", href: "/client/support", icon: LifebuoyIcon },
    { name: "Documents", href: "/client/documents", icon: DocumentIcon },
    { name: "Chat / Mon Conseiller", href: "/client/contacts", icon: UserCircleIcon },
  ];

  // Clients might not need a "Créer" dropdown.
  const createDropdownItems = [];
  const searchPlaceholder = "Rechercher dans Client Portal...";
  
  // Specify the base URL for create actions in Client role
  const createBaseUrl = "/client/add";

  return (
    <HeaderLayout
      createDropdownItems={createDropdownItems}
      navigation={navigation}
      searchPlaceholder={searchPlaceholder}
      user={user}
      contactId={contactId}
      createBaseUrl={createBaseUrl}
    />
  );
}

/**
 * Fallback header for Admin (or other roles)
 */
function AdminHeader({ user, contactId }) {
  const navigation = [
    { name: "Accueil", href: "/dashboard/admin", icon: HomeIcon },
      { name: "Tâches", href: "/dashboard/admin/tasks", icon: ClipboardDocumentCheckIcon },
      {
        name: "Gestion",
        icon: BriefcaseIcon,
        children: [
          { name: "Prospects", href: "/dashboard/admin/leads", icon: UserCircleIcon},
          { name: "Clients", href: "/dashboard/admin/projects", icon: UserCircleIcon },
        ],
      },
      { name: "Chat", href: "/dashboard/admin/emails", icon: EnvelopeIcon, badge: 24 },
      { name: "Agenda", href: "/dashboard/admin/calendar", icon: CalendarIcon },
      { name: "Catalogue", href: "/dashboard/admin/products-services", icon: BookOpenIcon },
      { 
        name: "Installateur", 
        href: "/dashboard/admin/sous-traitants", 
        icon: BuildingStorefrontIcon 
      },
      { 
        name: "Mandataires MPR", 
        href: "/dashboard/admin/mandataire-mpr", 
        icon: UserIcon 
      },
      { 
        name: "Gestion des Stocks", 
        href: "/dashboard/admin/stock", 
        icon: TruckIcon 
      },
      { 
        name: "Deals", 
        href: "/dashboard/admin/deals", 
        icon: CurrencyEuroIcon 
      },
      { name: "Facturation / Paiements", href: "/dashboard/admin/billing", icon: CreditCardIcon },
      { name: "Rapports / Statistiques", href: "/dashboard/admin/reports", icon: ChartBarIcon },
      { name: "Support & Tickets", href: "/dashboard/admin/support", icon: LifebuoyIcon },
      {
        name: "Modèles",
        icon: DocumentIcon,
        children: [
          // { name: "Tâches", href: "/dashboard/admin/tasks", icon: ClipboardDocumentCheckIcon, badge: 3 },
          // { name: "Clients & Organisations", href: "/dashboard/admin/contacts-organizations", icon: UserCircleIcon },
          { name: "E-mail", href: "/dashboard/admin/email-model", icon: EnvelopeIcon},
          { name: "SMS", href: "/dashboard/admin/sms-model", icon: ChatBubbleBottomCenterIcon },
          // { name: "Opportunités", href: "/dashboard/admin/opportunities", icon: BriefcaseIcon },
          // { name: "Projets", href: "/dashboard/admin/projects", icon: FolderIcon },
        ],
      },
      { name: "Tout les rôles", href: "/dashboard/admin/administration", icon: UserGroupIcon },
      { name: "Paramètres de l'Administrateur", href: "/dashboard/admin/reglages", icon: SettingsIcon }
  ];

  const createDropdownItems = [
    { type: "contact", label: "Créer un prospect", icon: UserCircleIcon },
    // { type: "lead", label: "Créer un lead", icon: SparklesIcon },
    { type: "dossier", label: "Créer un dossier", icon: FolderIcon },
    { type: "ticket", label: "Créer un ticket S.A.V", icon: TicketIcon },
    { type: "document", label: "Ajouter un document", icon: DocumentIcon },
    { type: "commentaire", label: "Ajouter un commentaire", icon: ClipboardDocumentCheckIcon },
  ];

  const searchPlaceholder = "Rechercher dans Admin...";
  
  // Specify the base URL for create actions in Admin role
  const createBaseUrl = "/dashboard/admin/contacts-organizations";

  return (
    <HeaderLayout
      createDropdownItems={createDropdownItems}
      navigation={navigation}
      searchPlaceholder={searchPlaceholder}
      user={user}
      contactId={contactId}
      createBaseUrl={createBaseUrl}
    />
  );
}

/**
 * Main exported Header component
 *
 * This version reads user info from localStorage.
 */
export function Header({ contactId = "123" }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to retrieve the user info from localStorage using "proInfo" or "clientInfo".
    const storedInfo =
      localStorage.getItem("proInfo") || localStorage.getItem("clientInfo");
    if (storedInfo) {
      try {
        const parsed = JSON.parse(storedInfo);
        setUser(parsed);
      } catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    } else {
      console.warn("No user info found in localStorage.");
    }
  }, []);

  if (!user) {
    // If no user is found, you might want to render a login prompt or redirect.
    return <div>Loading...</div>;
  }

  const role = user.role || "Admin";

  switch (role) {
    case "Sales Representative / Account Executive":
      return <SalesHeader user={user} contactId={contactId} />;
    case "Project / Installation Manager":
      return <PMHeader user={user} contactId={contactId} />;
    case "Technician / Installer":
      return <TechnicianHeader user={user} contactId={contactId} />;
    case "Customer Support / Service Representative":
      return <SupportHeader user={user} contactId={contactId} />;
    case "Client / Customer (Client Portal)":
      return <ClientHeader user={user} contactId={contactId} />;
    default:
      return <AdminHeader user={user} contactId={contactId} />;
  }
}
