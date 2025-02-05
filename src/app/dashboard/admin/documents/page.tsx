"use client";

import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { BarChart } from "@/components/ui/Charts/BarChart";
import {
  FolderIcon,
  DocumentIcon,
  DocumentArrowDownIcon,
  DocumentMagnifyingGlassIcon,
  // UserCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ShareIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  FireIcon,
  SunIcon,
  BoltIcon,
  HomeModernIcon,
  ArrowUpRightIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/outline";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

type EnergySolution = {
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
  color: string;
};

const energySolutions: Record<string, EnergySolution> = {
  "Pompes a chaleur": { icon: FireIcon, color: "#2a75c7" },
  "Chauffe-eau solaire individuel": { icon: SunIcon, color: "#f59e0b" },
  "Chauffe-eau thermodynamique": { icon: BoltIcon, color: "#10b981" },
  "Système Solaire Combiné": { icon: HomeModernIcon, color: "#8b5cf6" },
};

const documentStats = {
  totalDocuments: "2 458",
  storageUsed: "148 Go",
  activeCollaborations: 24,
  recentUploads: 12,
};

const storageData = [
  { category: "Plans d'installation", size: 65, color: "#2a75c7" },
  { category: "Contrats clients", size: 28, color: "#f59e0b" },
  { category: "Manuels techniques", size: 45, color: "#10b981" },
  { category: "Certifications", size: 10, color: "#8b5cf6" },
];

export default function DocumentsPage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Documents / Bibliothèque</h1>
          </div>

          {/* Document Intelligence Header */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FolderIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Documents Totaux</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {documentStats.totalDocuments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CloudArrowUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Stockage Utilisé</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {documentStats.storageUsed}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ShareIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Collaborations</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {documentStats.activeCollaborations}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Récent</h3>
                  <p className="text-2xl font-bold text-amber-600">
                    {documentStats.recentUploads}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Document Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File Browser */}
            <motion.div 
              className="lg:col-span-2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Document Explorer */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2">
                    <DocumentMagnifyingGlassIcon className="h-6 w-6 text-[#2a75c7]" />
                    Bibliothèque des Solutions
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Nouveau Dossier <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(energySolutions).map(([solution, { icon: Icon, color }]) => (
                    <div
                      key={solution}
                      className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                          <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div>
                          <h4 className="font-medium">{solution}</h4>
                          <p className="text-sm text-gray-500">48 documents • Dernière modif: 2h</p>
                        </div>
                      </div>
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 group-hover:text-[#2a75c7]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d]">
                    Documents Récents
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Voir Tous <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => {
                    const solution = Object.keys(energySolutions)[i % 4];
                    const { color } = energySolutions[solution];
                    
                    return (
                      <div
                        key={i}
                        className="p-4 hover:bg-[#bfddf9]/10 rounded-xl border border-[#bfddf9]/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                            <DocumentIcon className="h-6 w-6" style={{ color }} />
                          </div>
                          <div>
                            <h4 className="font-medium">Doc-00{i+1}_{solution.replace(/ /g, '_')}.pdf</h4>
                            <p className="text-sm text-gray-500">2.4 Mo • Version 1.2</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Modifié par Technicien #{i+1}</span>
                          <span className="text-gray-500">15h ago</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Document Operations */}
            <motion.div 
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Storage Breakdown */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <ChartBarIcon className="h-6 w-6 text-[#8b5cf6]" />
                  Répartition du Stockage
                </h3>
                <BarChart
                  data={storageData}
                  xKey="category"
                  yKeys={['size']}
                  colors={storageData.map(d => d.color)}
                  height={200}
                  horizontal
                  unit="Go" barRadius={0} currency={""}                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">
                  Actions Rapides
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button className="h-12 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] hover:from-[#afcde9] hover:to-[#c2ecb2] text-[#1a365d] justify-start">
                    <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                    Uploader un Document
                  </Button>
                  <Button className="h-12 bg-[#d2fcb2] hover:bg-[#c2ecb2] text-[#1a4231] justify-start">
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Partager un Dossier
                  </Button>
                  <Button className="h-12 bg-white border border-[#bfddf9]/30 hover:bg-[#bfddf9]/10 text-[#1a365d] justify-start">
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Modèles Intelligents
                  </Button>
                </div>
              </div>

              {/* Version Control */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <DocumentArrowDownIcon className="h-6 w-6 text-[#10b981]" />
                  Contrôle des Versions
                </h3>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span className="text-sm">v1.{i+1} • Plan d&apos;installation</span>
                      </div>
                      <span className="text-xs text-gray-500">2{21 - i} Oct</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Document Templates */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                Modèles Énergétiques
              </h2>
              <Button variant="ghost" size="sm" className="text-[#1a365d]">
                Voir Tous <ArrowUpRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(energySolutions).map(([solution, { icon: Icon, color }]) => (
                <div
                  key={solution}
                  className="group p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer border border-[#bfddf9]/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                      <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                    <div>
                      <h4 className="font-medium">Modèle {solution}</h4>
                      <p className="text-sm text-gray-500">5 versions disponibles</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Dernière mise à jour</span>
                    <span className="text-gray-500">1j</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}