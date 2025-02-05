"use client";

import { BellIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Header({ user }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm z-10">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Logo & Search */}
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
            animate={{ 
              width: isSearchFocused ? '100%' : '65%',
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={cn(
              "flex items-center rounded-xl bg-gray-50/50 border transition-all duration-300 group",
              isSearchFocused 
                ? "border-primary/50 bg-white shadow-lg ring-1 ring-primary/20"
                : "border-gray-100 hover:border-gray-200"
            )}>
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-4 shrink-0 transition-colors group-hover:text-primary" />
              <input
                type="text"
                placeholder="Rechercher dans l'ensemble de la plateforme..."
                className="w-full bg-transparent px-4 py-2.5 text-sm focus:outline-none placeholder-gray-400 truncate peer"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Animated Clear */}
              <div className="flex items-center pr-3">
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      ×
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-primary/30 origin-left"
              animate={{ scaleX: isSearchFocused ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Solid Create Button */}
          <Menu as="div" className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-primary-dark transition-all"
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
                {['Tableau', 'Rapport', 'Utilisateur', 'Projet'].map((item) => (
                  <Menu.Item key={item}>
                    {({ active }) => (
                      <button className={cn(
                        "w-full px-4 py-2.5 text-left rounded-lg text-sm flex items-center gap-3",
                        active ? "bg-primary/10 text-primary" : "text-gray-700"
                      )}>
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
          <motion.button 
            className="relative p-2 rounded-xl hover:bg-gray-50 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BellIcon className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white shadow-sm">
              3
            </div>
          </motion.button>

          {/* Profile Icon SVG */}
          <Menu as="div" className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Menu.Button className="group relative">
                <svg 
                  className="h-9 w-9 text-primary hover:text-primary-dark transition-colors"
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
              <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-2xl border border-gray-100 focus:outline-none p-2 space-y-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">Administrateur</p>
                  <p className="text-xs text-gray-500 truncate">admin@entreprise.com</p>
                </div>
                
                {['Mon Profil', 'Paramètres du compte', 'Préférences'].map((item) => (
                  <Menu.Item key={item}>
                    {({ active }) => (
                      <button className={cn(
                        "w-full px-4 py-2.5 text-left rounded-lg text-sm flex items-center gap-3",
                        active ? "bg-primary/10 text-primary" : "text-gray-700"
                      )}>
                        <div className="h-6 w-6 bg-primary/10 rounded-lg flex items-center justify-center">
                          <PlusIcon className="h-4 w-4" />
                        </div>
                        {item}
                      </button>
                    )}
                  </Menu.Item>
                ))}
                
                <div className="border-t border-gray-100 my-2" />
                
                <Menu.Item>
                  {({ active }) => (
                    <button className={cn(
                      "w-full px-4 py-2.5 text-left rounded-lg text-sm",
                      active ? "bg-red-100 text-red-600" : "text-gray-700"
                    )}>
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
  )
}