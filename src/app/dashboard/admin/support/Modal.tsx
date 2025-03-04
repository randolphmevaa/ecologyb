import React from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          <button onClick={onClose} className="text-white hover:text-gray-300 focus:outline-none">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
