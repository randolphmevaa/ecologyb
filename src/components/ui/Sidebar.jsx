"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  SparklesIcon,
  BriefcaseIcon,
  FolderIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChartPieIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ChartBarIcon,
  LifebuoyIcon,
  DocumentIcon,
  // Cog6ToothIcon,
  UserGroupIcon,
  CodeBracketIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const springTransition = { type: 'spring', stiffness: 300, damping: 30 };

export function Sidebar({ role }) {
  // Initialize activeItem from localStorage (or default to "Accueil")
  const [activeItem, setActiveItem] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeItem') || 'Accueil';
    }
    return 'Accueil';
  });

  // Initialize isCollapsed from localStorage (or default to false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isCollapsed') === 'true';
    }
    return false;
  });

  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeout = useRef(null);
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Used for items with dropdown children (only in the default/admin case)
  const [openDropdowns, setOpenDropdowns] = useState({});

  // New state for profile info from localStorage
  const [profileInfo, setProfileInfo] = useState({ email: '', role: '' });

  // Load profile info from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProInfo = localStorage.getItem('proInfo');
      if (storedProInfo) {
        try {
          const parsedProInfo = JSON.parse(storedProInfo);
          setProfileInfo(parsedProInfo);
        } catch (error) {
          console.error('Error parsing proInfo from localStorage', error);
        }
      }
    }
  }, []);

  // Define role-based navigation arrays
  let navigation = [];
  if (role === "Sales Representative / Account Executive") {
    navigation = [
      { name: "Accueil", href: "/dashboard/sales", icon: HomeIcon },
      { name: "Leads", href: "/dashboard/sales/leads", icon: SparklesIcon },
      { name: "Opportunités", href: "/dashboard/sales/opportunities", icon: BriefcaseIcon },
      { name: "Clients & Organisations", href: "/dashboard/sales/contacts-organizations", icon: UserCircleIcon },
      { name: "Chat", href: "/dashboard/sales/emails", icon: EnvelopeIcon },
      { name: "Agenda", href: "/dashboard/sales/calendar", icon: CalendarIcon }
    ];
  } else if (role === "Project / Installation Manager") {
    navigation = [
      { name: "Accueil", href: "/dashboard/pm", icon: HomeIcon },
      { name: "Projets", href: "/dashboard/pm/projects", icon: FolderIcon },
      { name: "Tâches", href: "/dashboard/pm/tasks", icon: ClipboardDocumentCheckIcon },
      { name: "Clients & Organisations", href: "/dashboard/pm/contacts-organizations", icon: UserCircleIcon },
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
      { name: "Clients & Organisations", href: "/dashboard/support/contacts-organizations", icon: UserCircleIcon },
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
      { name: "Chat / Mon Conseiller", href: "/client/contacts", icon: UserCircleIcon },
    ];
  } else {
    // Default admin navigation (with dropdown "Gestion")
    navigation = [
      { name: "Accueil", href: "/dashboard/admin", icon: HomeIcon },
      { name: "Tableaux de bord", href: "/dashboard/admin/dashboards", icon: ChartPieIcon },
      { 
        name: "Gestion", 
        icon: BriefcaseIcon,
        children: [
          { name: "Tâches", href: "/dashboard/admin/tasks", icon: ClipboardDocumentCheckIcon, badge: 3 },
          { name: "Clients & Organisations", href: "/dashboard/admin/contacts-organizations", icon: UserCircleIcon },
          { name: "Leads", href: "/dashboard/admin/leads", icon: SparklesIcon, badge: 12 },
          { name: "Opportunités", href: "/dashboard/admin/opportunities", icon: BriefcaseIcon },
          { name: "Projets", href: "/dashboard/admin/projects", icon: FolderIcon },
        ]
      },
      { name: "Chat", href: "/dashboard/admin/emails", icon: EnvelopeIcon, badge: 24 },
      { name: "Agenda", href: "/dashboard/admin/calendar", icon: CalendarIcon },
      { name: "Produits & Services", href: "/dashboard/admin/products-services", icon: ShoppingBagIcon },
      { name: "Facturation / Paiements", href: "/dashboard/admin/billing", icon: CreditCardIcon },
      { name: "Rapports / Statistiques", href: "/dashboard/admin/reports", icon: ChartBarIcon },
      { name: "Support & Tickets", href: "/dashboard/admin/support", icon: LifebuoyIcon },
      // { name: "Documents / Bibliothèque", href: "/dashboard/admin/documents", icon: DocumentIcon },
      { name: "Mes Utilisateurs", href: "/dashboard/admin/administration", icon: UserGroupIcon },
      { name: "Intégrations / API", href: "/dashboard/admin/integrations", icon: CodeBracketIcon }
    ];
  }

  // Helper to recursively locate the active navigation item
  const findActiveItem = (items, path) => {
    for (const item of items) {
      if (item.href && item.href === path) return item;
      if (item.children) {
        const found = findActiveItem(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  // Sync active item with current route and open dropdown if needed
  useEffect(() => {
    const currentItem = findActiveItem(navigation, router.pathname);
    if (currentItem && currentItem.name !== activeItem) {
      setActiveItem(currentItem.name);
      localStorage.setItem('activeItem', currentItem.name);
      // Open parent dropdown if the active item is within one
      navigation.forEach(item => {
        if (item.children && item.children.some(child => child.name === currentItem.name)) {
          setOpenDropdowns(prev => ({ ...prev, [item.name]: true }));
        }
      });
    }
  }, [pathname, router.pathname]);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  const handleHover = (itemName) => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredItem(itemName);
    }, 50);
  };

  // Toggle dropdown open/close (if the item has children)
  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Render a navigation item (or a dropdown parent if children exist)
  const renderNavItem = (item, isChild = false) => {
    // For a parent with children, consider active if one of its children is active.
    const isActive = item.href
      ? activeItem === item.name
      : (item.children && item.children.some(child => child.name === activeItem));

    return (
      <div
        key={item.name}
        className={cn("relative", isChild && "pl-6")}
        onMouseEnter={() => handleHover(item.name)}
        onMouseLeave={() => {
          clearTimeout(hoverTimeout.current);
          setHoveredItem(null);
        }}
      >
        {/* Hover background effect */}
        <AnimatePresence>
          {hoveredItem === item.name && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/5 rounded-xl"
              layoutId="hoverBg"
            />
          )}
        </AnimatePresence>

        {item.children ? (
          // Dropdown parent item
          <div
            onClick={() => toggleDropdown(item.name)}
            className={cn(
              "flex items-center gap-x-3 rounded-xl p-3 cursor-pointer",
              "relative z-10 transition-colors duration-200",
              isActive 
                ? "bg-gray-800 shadow-inner"
                : "hover:bg-primary/5"
            )}
          >
            <motion.div
              animate={{
                rotate: isActive ? [0, -10, 10, 0] : 0,
                scale: isActive ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <item.icon className={cn(
                "h-6 w-6 transition-colors",
                isActive ? "text-primary" : "text-gray-600"
              )} />
            </motion.div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={cn(
                    "font-body text-sm font-medium truncate",
                    isActive ? "text-primary font-semibold" : "text-gray-700"
                  )}
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: openDropdowns[item.name] ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-auto"
              >
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              </motion.div>
            )}
          </div>
        ) : (
          // Standalone link
          <Link
            href={item.href}
            onClick={() => {
              setActiveItem(item.name);
              localStorage.setItem('activeItem', item.name);
            }}
            className={cn(
              "flex items-center gap-x-3 rounded-xl p-3",
              "relative z-10 transition-colors duration-200",
              isActive 
                ? "bg-gray-800 shadow-inner"
                : "hover:bg-primary/5"
            )}
          >
            <motion.div
              animate={{
                rotate: isActive ? [0, -10, 10, 0] : 0,
                scale: isActive ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <item.icon className={cn(
                "h-6 w-6 transition-colors",
                isActive ? "text-primary" : "text-gray-600"
              )} />
              {item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "absolute -top-2 -right-2 flex items-center justify-center",
                    "h-5 w-5 rounded-full text-xs font-bold shadow-sm",
                    isActive 
                      ? "bg-primary text-white" 
                      : "bg-secondary text-white"
                  )}
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={cn(
                    "font-body text-sm font-medium truncate",
                    isActive ? "text-primary font-semibold" : "text-gray-700"
                  )}
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
            {!isCollapsed && isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-2 h-2 bg-primary rounded-full"
              />
            )}
          </Link>
        )}

        {/* Render dropdown children if available */}
        {item.children && openDropdowns[item.name] && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
              collapsed: { opacity: 0, height: 0, transition: { duration: 0.2 } }
            }}
          >
            {item.children.map(child => renderNavItem(child, true))}
          </motion.div>
        )}

        {/* Hover line indicator */}
        <AnimatePresence>
          {hoveredItem === item.name && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 4 }}
              exit={{ width: 0 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 bg-primary rounded-r-full"
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      ref={sidebarRef}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={springTransition}
      className={cn(
        "relative h-screen flex flex-col border-r border-gray-100 bg-white",
        "shadow-xl z-30 overflow-hidden"
      )}
    >
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const newState = !isCollapsed;
          setIsCollapsed(newState);
          localStorage.setItem('isCollapsed', newState);
        }}
        className={cn(
          "absolute -right-3.5 top-6 z-20 rounded-full p-2 bg-white",
          "border border-gray-200 hover:border-primary",
          "shadow-2xl hover:shadow-3xl focus:outline-none",
          "backdrop-blur-sm bg-white/90"
        )}
      >
        {isCollapsed ? (
          <ChevronDoubleRightIcon className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-600" />
        )}
      </motion.button>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="flex flex-col gap-y-1 px-2">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </div>

      {/* Profile Section */}
      <motion.div 
        className="border-t border-gray-100 p-4"
        animate={{ padding: isCollapsed ? '1rem 0.5rem' : '1rem' }}
        transition={springTransition}
      >
        <div className="flex items-center gap-x-3 overflow-hidden">
          <motion.div
            whileHover={{ rotate: 15 }}
            className={cn(
              "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center",
              "cursor-pointer relative overflow-hidden group"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-lg font-semibold text-primary">
              {profileInfo.role === "Super Admin"
                ? "SA"
                : profileInfo.email
                  ? profileInfo.email.charAt(0).toUpperCase()
                  : "U"}
            </span>
          </motion.div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 truncate"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profileInfo.role === "Super Admin"
                    ? "Administrateur Principal"
                    : profileInfo.role || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profileInfo.email || "email@example.com"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Dynamic Border Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(191,221,249,0.2)]" />
      </div>
    </motion.div>
  );
}
