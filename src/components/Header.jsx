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
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  FolderIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  LifebuoyIcon,
  CreditCardIcon,
  ChartPieIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

export function Header({ user }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const searchInputRef = useRef(null);
  const router = useRouter();

  // Role-based navigation logic
  const role = user?.role || "Admin"; // default to Admin if no role provided
  let navigation = [];
  if (role === "Sales Representative / Account Executive") {
    navigation = [
      { name: "Accueil", href: "/dashboard/sales", icon: HomeIcon },
      { name: "Leads", href: "/dashboard/sales/leads", icon: SparklesIcon },
      { name: "Opportunités", href: "/dashboard/sales/opportunities", icon: BriefcaseIcon },
      { name: "Contacts & Organisations", href: "/dashboard/sales/contacts-organizations", icon: UserCircleIcon },
      { name: "Chat", href: "/dashboard/sales/emails", icon: EnvelopeIcon },
      { name: "Agenda", href: "/dashboard/sales/calendar", icon: CalendarIcon },
    ];
  } else if (role === "Project / Installation Manager") {
    navigation = [
      { name: "Accueil", href: "/dashboard/pm", icon: HomeIcon },
      { name: "Projets", href: "/dashboard/pm/projects", icon: FolderIcon },
      { name: "Tâches", href: "/dashboard/pm/tasks", icon: ClipboardDocumentCheckIcon },
      { name: "Contacts & Organisations", href: "/dashboard/pm/contacts-organizations", icon: UserCircleIcon },
      { name: "Agenda", href: "/dashboard/pm/calendar", icon: CalendarIcon },
      { name: "Chat", href: "/dashboard/pm/emails", icon: EnvelopeIcon },
      { name: "Documents / Bibliothèque", href: "/dashboard/pm/documents", icon: DocumentIcon },
    ];
  } else if (role === "Technician / Installer") {
    navigation = [
      { name: "Accueil", href: "/dashboard/technician", icon: HomeIcon },
      { name: "Tâches / Jobs", href: "/dashboard/technician/tasks", icon: ClipboardDocumentCheckIcon },
      { name: "Projets", href: "/dashboard/technician/projects", icon: FolderIcon },
      { name: "Agenda", href: "/dashboard/technician/calendar", icon: CalendarIcon },
      { name: "Documents / Bibliothèque", href: "/dashboard/technician/documents", icon: DocumentIcon },
    ];
  } else if (role === "Customer Support / Service Representative") {
    navigation = [
      { name: "Accueil", href: "/dashboard/support", icon: HomeIcon },
      { name: "Support & Tickets", href: "/dashboard/support/tickets", icon: LifebuoyIcon },
      { name: "Contacts & Organisations", href: "/dashboard/support/contacts-organizations", icon: UserCircleIcon },
      { name: "Chat", href: "/dashboard/support/emails", icon: EnvelopeIcon },
      { name: "Agenda", href: "/dashboard/support/calendar", icon: CalendarIcon },
      { name: "Documents / Bibliothèque", href: "/dashboard/support/documents", icon: DocumentIcon },
    ];
  } else if (role === "Client / Customer (Client Portal)") {
    navigation = [
      { name: "Accueil", href: "/client/dashboard", icon: HomeIcon },
      { name: "Mes Projets / Suivi des Projets", href: "/client/projects", icon: FolderIcon },
      { name: "Facturation / Paiements", href: "/client/billing", icon: CreditCardIcon },
      { name: "Support / Tickets", href: "/client/support", icon: LifebuoyIcon },
      { name: "Documents", href: "/client/documents", icon: DocumentIcon },
      { name: "Contacts / Mon Conseiller", href: "/client/contacts", icon: UserCircleIcon },
    ];
  } else {
    // Default admin navigation (including a "Gestion" dropdown)
    navigation = [
      { name: "Accueil", href: "/dashboard/admin", icon: HomeIcon },
      { name: "Tableaux de bord", href: "/dashboard/admin/dashboards", icon: ChartPieIcon },
      {
        name: "Gestion",
        icon: BriefcaseIcon,
        children: [
          { name: "Tâches", href: "/dashboard/admin/tasks", icon: ClipboardDocumentCheckIcon, badge: 3 },
          { name: "Contacts & Organisations", href: "/dashboard/admin/contacts-organizations", icon: UserCircleIcon },
          { name: "Leads", href: "/dashboard/admin/leads", icon: SparklesIcon, badge: 12 },
          { name: "Opportunités", href: "/dashboard/admin/opportunities", icon: BriefcaseIcon },
          { name: "Projets", href: "/dashboard/admin/projects", icon: FolderIcon },
        ],
      },
      { name: "Chat", href: "/dashboard/admin/emails", icon: EnvelopeIcon, badge: 24 },
      { name: "Agenda", href: "/dashboard/admin/calendar", icon: CalendarIcon },
      { name: "Produits & Services", href: "/dashboard/admin/products-services", icon: ShoppingBagIcon },
      { name: "Facturation / Paiements", href: "/dashboard/admin/billing", icon: CreditCardIcon },
      { name: "Rapports / Statistiques", href: "/dashboard/admin/reports", icon: ChartBarIcon },
      { name: "Support & Tickets", href: "/dashboard/admin/support", icon: LifebuoyIcon },
      { name: "Mes Utilisateurs", href: "/dashboard/admin/administration", icon: UserGroupIcon },
      { name: "Intégrations / API", href: "/dashboard/admin/integrations", icon: CodeBracketIcon },
    ];
  }

  // Helper: Flatten navigation (including children) for search results
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

  // Only search within the current role's navigation
  const flatNavigation = flattenNavigation(navigation);

  // Filter navigation items based on the search query
  const searchResults = searchQuery
    ? flatNavigation.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    // Reset active suggestion index whenever the search query changes.
    setActiveSuggestionIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (searchResults[activeSuggestionIndex]) {
        router.push(searchResults[activeSuggestionIndex].href);
        setSearchQuery("");
      }
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm z-10">
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

          {/* Premium Search Experience */}
          <motion.div
            className="relative flex-1"
            animate={{ width: isSearchFocused ? "100%" : "65%" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className={cn(
                "flex items-center rounded-xl bg-gray-50/50 border transition-all duration-300 group",
                isSearchFocused
                  ? "border-[#213f5b]/50 bg-white shadow-lg ring-1 ring-[#213f5b]/20"
                  : "border-gray-100 hover:border-gray-200"
              )}
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-4 shrink-0 transition-colors group-hover:text-[#213f5b]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher dans l'ensemble de la plateforme..."
                className="w-full bg-transparent px-4 py-2.5 text-sm focus:outline-none placeholder-gray-400 truncate peer"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() =>
                  // Delay blur to allow click events on the suggestions
                  setTimeout(() => setIsSearchFocused(false), 200)
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-autocomplete="list"
                aria-activedescendant={`suggestion-${activeSuggestionIndex}`}
              />

              {/* Animated Clear Button */}
              <div className="flex items-center pr-3">
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-[#213f5b] transition-colors"
                    >
                      ×
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {searchQuery && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg z-20"
                >
                  <ul className="max-h-60 overflow-y-auto">
                    {searchResults.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setSearchQuery("")}
                            className={cn(
                              "flex items-center px-4 py-2 text-sm hover:bg-gray-100",
                              index === activeSuggestionIndex && "bg-gray-100"
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated Progress Bar */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-[#213f5b]/30 origin-left"
              animate={{ scaleX: isSearchFocused ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>

        {/* Right Section – Actions */}
        <div className="flex items-center gap-3">
          {/* Solid Create Button */}
          <Menu as="div" className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#213f5b] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-[#213f5b]/90 transition-all"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden lg:inline">Créer</span>
            </motion.button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-1 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-1 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100 focus:outline-none p-2 space-y-1">
                {["Tableau", "Rapport", "Utilisateur", "Projet"].map((item) => (
                  <Menu.Item key={item}>
                    {({ active }) => (
                      <button
                        className={cn(
                          "w-full px-4 py-2.5 text-left rounded-lg text-sm flex items-center gap-3",
                          active ? "bg-primary/10 text-primary" : "text-gray-700"
                        )}
                      >
                        <PlusIcon className="h-4 w-4 opacity-70" />
                        {item}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Notification Bell */}
          <Menu as="div" className="relative">
            <Menu.Button
              as={motion.button}
              className="relative p-2 rounded-xl hover:bg-gray-50 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BellIcon className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white shadow-sm">
                3
              </div>
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
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100 focus:outline-none p-2">
                <Menu.Item>
                  {({ active }) => (
                    <div className={cn("px-4 py-2 text-sm", active ? "bg-gray-100" : "")}>
                      Pas de notification
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Profile Icon and Dropdown */}
          <Menu as="div" className="relative">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Menu.Button className="group relative">
                <svg
                  className="h-9 w-9 text-[#213f5b] hover:text-[#213f5b] transition-colors"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="18" r="16" fill="currentColor" className="opacity-10" />
                  <circle cx="18" cy="13.5" r="4.5" fill="currentColor" className="opacity-30" />
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
              <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100 focus:outline-none p-2 space-y-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">Administrateur</p>
                  <p className="text-xs text-gray-500 truncate">admin@entreprise.com</p>
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/dashboard/admin/integrations")}
                      className={cn(
                        "w-full px-4 py-2.5 text-left rounded-lg text-sm flex items-center gap-3",
                        active ? "bg-primary/10 text-primary" : "text-gray-700"
                      )}
                    >
                      <div className="h-6 w-6 bg-primary/10 rounded-lg flex items-center justify-center">
                        <PlusIcon className="h-4 w-4" />
                      </div>
                      Mon Profil
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/dashboard/admin/administration")}
                      className={cn(
                        "w-full px-4 py-2.5 text-left rounded-lg text-sm flex items-center gap-3",
                        active ? "bg-primary/10 text-primary" : "text-gray-700"
                      )}
                    >
                      <div className="h-6 w-6 bg-primary/10 rounded-lg flex items-center justify-center">
                        <PlusIcon className="h-4 w-4" />
                      </div>
                      Paramètres du compte
                    </button>
                  )}
                </Menu.Item>

                <div className="border-t border-gray-100 my-2" />

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/")}
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
  );
}
