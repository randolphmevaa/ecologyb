"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Switch } from '@headlessui/react'; // Add this import
import {
  Cog6ToothIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  KeyIcon,
  DocumentTextIcon,
  PlusIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClockIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";

const rolesConfig = {
  "Administrateur": { color: "#2a75c7", icon: ShieldCheckIcon },
  "Commercial": { color: "#f59e0b", icon: UserGroupIcon },
  "Technicien/Installateur": { color: "#10b981", icon: Cog6ToothIcon },
  "Support Client": { color: "#8b5cf6", icon: LifebuoyIcon },
  "Client (Portail)": { color: "#ef4444", icon: UserCircleIcon },
};

const permissions = {
  "Administrateur": ["full_access", "user_management", "billing", "audit_logs"],
  "Commercial": ["leads", "opportunities", "contacts", "calendar"],
  "Technicien/Installateur": ["projects", "tasks", "documents", "reports"],
  "Support Client": ["tickets", "knowledge_base", "client_comms", "sla"],
  "Client (Portail)": ["project_tracking", "billing", "support", "docs"],
};

export default function AdministrationPage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Administration / Paramètres</h1>
          </div>

          {/* Access Control Header */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Utilisateurs Actifs</h3>
                  <p className="text-2xl font-bold text-blue-600">142</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <KeyIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Rôles Configurés</h3>
                  <p className="text-2xl font-bold text-purple-600">{Object.keys(rolesConfig).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <LockClosedIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">MFA Activée</h3>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Administration Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Management */}
            <motion.div 
              className="lg:col-span-2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* User List */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2">
                    <UserGroupIcon className="h-6 w-6 text-[#2a75c7]" />
                    Gestion des Utilisateurs
                  </h2>
                  <Button className="bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] hover:from-[#afcde9] hover:to-[#c2ecb2] text-[#1a365d]">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nouvel Utilisateur
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center bg-[#bfddf9]/10 p-3 rounded-xl">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Rechercher utilisateur..." 
                      className="bg-transparent w-full focus:outline-none"
                    />
                  </div>

                  {[...Array(5)].map((_, i) => {
                    const roles = Object.keys(rolesConfig) as Array<keyof typeof rolesConfig>;
                    const role = roles[i % roles.length];
                    const { color, icon: Icon } = rolesConfig[role];
                    
                    return (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer group"
                        whileHover={{ scale: 1.005 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                            <Icon className="h-6 w-6" style={{ color }} />
                          </div>
                          <div>
                            <h4 className="font-medium">user.email@entreprise.com</h4>
                            <p className="text-sm text-gray-500">{role} • Dernière connexion: 2h</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <select 
                            className="bg-transparent border border-[#bfddf9]/30 rounded-lg px-3 py-1 text-sm focus:outline-none"
                            style={{ color }}
                            value={role}
                          >
                            {(Object.keys(rolesConfig) as Array<keyof typeof rolesConfig>).map(r => (
                              <option key={r} value={r} style={{ color: rolesConfig[r].color }}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 group-hover:text-[#2a75c7]" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Audit Log */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d]">
                    Journal d&apos;Activité
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Exporter CSV <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer border border-[#bfddf9]/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                          <DocumentTextIcon className="h-6 w-6 text-[#2a75c7]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Modification de rôle utilisateur</h4>
                          <p className="text-sm text-gray-500">Admin → Commercial</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">15h30</p>
                        <span className="text-xs text-gray-500">par admin@entreprise.com</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Role Configuration */}
            <motion.div 
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Role Permissions */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <KeyIcon className="h-6 w-6 text-[#8b5cf6]" />
                  Permissions des Rôles
                </h3>
                <div className="space-y-4">
                  {Object.entries(rolesConfig).map(([role, { color, icon: Icon }]) => (
                    <div key={role} className="border border-[#bfddf9]/20 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-[#bfddf9]/10">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" style={{ color }} />
                          <span className="font-medium" style={{ color }}>{role}</span>
                        </div>
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="p-3 space-y-2">
                      {(permissions[role as keyof typeof permissions] as string[]).map((perm: string) => (
                          <div key={perm} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">{perm.replace(/_/g, ' ')}</span>
                            <Switch
                              checked={true}
                              onChange={() => {}}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                true ? 'bg-[#10b981]' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                                true ? 'translate-x-6' : 'translate-x-1'
                              } bg-white`} />
                            </Switch>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">
                  Sécurité du Système
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <LockClosedIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Authentification à 2 Facteurs</span>
                    </div>
                    <Switch
                      checked={true}
                      onChange={() => {}}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        true ? 'bg-[#10b981]' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                        true ? 'translate-x-6' : 'translate-x-1'
                      } bg-white`} />
                    </Switch>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-amber-600" />
                      <span className="text-sm">Expiration de Session</span>
                    </div>
                    <select className="bg-transparent border border-[#bfddf9]/30 rounded-lg px-3 py-1 text-sm focus:outline-none">
                      <option>24h</option>
                      <option>12h</option>
                      <option>8h</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* API Management */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <ServerIcon className="h-6 w-6 text-[#2a75c7]" />
                  Gestion API
                </h3>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <KeyIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm truncate">sk_live_...{i}2345</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          i === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {i === 0 ? 'Actif' : 'Révoqué'}
                        </span>
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
