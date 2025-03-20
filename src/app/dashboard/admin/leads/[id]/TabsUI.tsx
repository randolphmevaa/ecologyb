import { FC } from "react";
import { motion, LayoutGroup } from "framer-motion";
import {
  InformationCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChatBubbleLeftEllipsisIcon,
  LifebuoyIcon,
  CurrencyEuroIcon, // using CurrencyEuroIcon instead of GavelIcon
} from "@heroicons/react/24/outline";

// Define a union type for the available tabs
type TabType = "info" | "documents" | "photo" | "chat" | "sav" | "reglement";

// Define the props interface for PremiumTabs
interface PremiumTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  chatMessageCount: number;
}

// Define the tabs with labels and associated Heroicons.
const tabs = [
  { id: "info", label: "Informations client", icon: InformationCircleIcon },
  { id: "documents", label: "Documents", icon: DocumentTextIcon },
  { id: "photo", label: "Photo d'installation", icon: PhotoIcon },
  { id: "chat", label: "Chat", icon: ChatBubbleLeftEllipsisIcon },
  { id: "sav", label: "S.A.V.", icon: LifebuoyIcon },
  { id: "reglement", label: "Règlement", icon: CurrencyEuroIcon }, // new tab using CurrencyEuroIcon
];

const PremiumTabs: FC<PremiumTabsProps> = ({ activeTab, setActiveTab, chatMessageCount }) => {
  return (
    <LayoutGroup>
      <div className="relative border-t border-l border-r rounded-t-3xl p-4 mb-8">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center space-y-1 px-6 py-3 font-bold transition-colors duration-300 focus:outline-none ${
                  activeTab === tab.id ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{tab.label}</span>
                {tab.id === "chat" && chatMessageCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
                    {chatMessageCount}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
};

export default PremiumTabs;
