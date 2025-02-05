"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
// Removed: import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// Define interfaces for clarity
interface Column {
  header: string;
  accessor: string;
}

interface RowAction {
  label: string;
  action: () => void;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  searchFields?: string[];
  sortableColumns?: string[];
  rowActions?: (row: Record<string, unknown>) => RowAction[];
  accentColor?: string; // Still available if you want to use it later
  itemsPerPage?: number;
}

export function DataTable({
  columns,
  data,
  searchFields = [],
  sortableColumns = [],
  rowActions,
  // accentColor = '#bfddf9',
  itemsPerPage = 10
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering
  const filteredData = data.filter(item =>
    searchFields.some(field =>
      item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sorting
  // Sorting
const sortedData = [...filteredData].sort((a, b) => {
  if (!sortConfig) return 0;
  const aValue = a[sortConfig.key];
  const bValue = b[sortConfig.key];

  // Handle cases where aValue or bValue might be null or undefined
  if (aValue == null && bValue == null) return 0;
  if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
  if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

  if (aValue < bValue) {
    return sortConfig.direction === 'asc' ? -1 : 1;
  }
  if (aValue > bValue) {
    return sortConfig.direction === 'asc' ? 1 : -1;
  }
  return 0;
});


  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#bfddf9]/20">
      {/* Table Controls */}
      <div className="p-4 border-b border-[#bfddf9]/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5c7c9f]" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#bfddf9]/50 focus:ring-2 focus:ring-[#d2fcb2] focus:border-[#2a8547]"
          />
        </div>
        
        <Button
          variant="outline"
          className="border-[#bfddf9]/50 hover:bg-[#bfddf9]/10 text-[#1a365d]"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#bfddf9]/20">
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="px-4 py-3 text-left text-sm font-semibold text-[#1a365d]"
                >
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {sortableColumns.includes(column.accessor) && (
                      <button
                        onClick={() => handleSort(column.accessor)}
                        className="text-[#5c7c9f] hover:text-[#2a75c7]"
                      >
                        <ChevronUpDownIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-b border-[#bfddf9]/10 hover:bg-[#bfddf9]/05 group"
                >
                  {columns.map((column) => (
                    <td key={column.accessor} className="px-4 py-3 text-sm text-[#5c7c9f]">
                      {row[column.accessor] as string}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#5c7c9f] hover:bg-[#bfddf9]/20"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[#bfddf9]/20 flex items-center justify-between">
        <span className="text-sm text-[#5c7c9f]">
          {paginatedData.length} sur {filteredData.length} résultats
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-[#bfddf9]/50 hover:bg-[#bfddf9]/10 text-[#1a365d]"
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-[#bfddf9]/50 hover:bg-[#bfddf9]/10 text-[#1a365d]"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
