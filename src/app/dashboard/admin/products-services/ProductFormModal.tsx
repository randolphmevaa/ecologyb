"use client";

import { useState, useEffect, FC, FormEvent } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArchiveBoxIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/Button";
// import { cn } from "@/lib/utils";

const springTransition = { type: 'spring', stiffness: 300, damping: 30 };

interface ProductData {
  name: string;
  sku: string;
  price: string | number;
  stock: string | number;
  category: string;
  description: string;
  images: string[];
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductData;
}

export const ProductFormModal: FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  initialData
}) => {
  const [formData, setFormData] = useState<ProductData>(
    initialData || {
      name: '',
      sku: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      images: []
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          />

          <div className="fixed inset-0 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              transition={springTransition}
              className="flex min-h-full items-center justify-center p-4"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl border border-[#bfddf9]/30">
                <div className="flex justify-between items-center p-6 border-b border-[#bfddf9]/20">
                  <Dialog.Title className="text-xl font-bold text-[#1a365d]">
                    {initialData ? 'Modifier le Produit' : 'Nouveau Produit/Service'}
                  </Dialog.Title>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm" // Changed from "icon" to "sm" to match the allowed sizes
                    className="text-[#5c7c9f] hover:bg-[#bfddf9]/20"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Upload */}
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-[#1a365d] mb-2">
                        Images
                      </label>
                      <div className="flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-[#bfddf9]/50 bg-white/50 group hover:border-[#d2fcb2]/70 transition-colors">
                        <div className="text-center">
                          <PhotoIcon className="mx-auto h-8 w-8 text-[#5c7c9f] mb-2" />
                          <span className="text-sm text-[#5c7c9f] group-hover:text-[#2a8547]">
                            Glisser-déposer ou cliquer pour upload
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#1a365d] mb-2">
                        <TagIcon className="h-5 w-5 text-[#2a75c7]" />
                        Nom du Produit
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-3 rounded-xl border border-[#bfddf9]/50 focus:ring-2 focus:ring-[#d2fcb2] focus:border-[#2a8547]"
                      />
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#1a365d] mb-2">
                        <ArchiveBoxIcon className="h-5 w-5 text-[#2a75c7]" />
                        SKU
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        className="w-full p-3 rounded-xl border border-[#bfddf9]/50"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#1a365d] mb-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-[#2a75c7]" />
                        Prix
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full p-3 rounded-xl border border-[#bfddf9]/50"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#1a365d] mb-2">
                        <ChartBarIcon className="h-5 w-5 text-[#2a75c7]" />
                        Stock
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        className="w-full p-3 rounded-xl border border-[#bfddf9]/50"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#bfddf9]/20">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-[#bfddf9]/50 hover:bg-[#bfddf9]/10 text-[#1a365d]"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#d2fcb2] hover:bg-[#c2ecb2] text-[#1a4231] shadow-sm hover:shadow-md"
                    >
                      {initialData ? 'Enregistrer' : 'Créer le Produit'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
