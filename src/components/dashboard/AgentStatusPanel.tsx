// src/components/dashboard/AgentStatusPanel.tsx
import { useState } from 'react';
import { PBXExtension } from '@/app/api/pbx/route';

interface AgentStatusPanelProps {
  extensions: PBXExtension[];
  onRefresh: () => Promise<void>;
}

export default function AgentStatusPanel({ 
  extensions, 
  onRefresh 
}: AgentStatusPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const filteredExtensions = extensions.filter(ext => 
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.number.includes(searchQuery)
  );

  // Count agents by status
  const statusCounts = extensions.reduce((acc, ext) => {
    acc[ext.status] = (acc[ext.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-red-100 text-red-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Agent Status
          </h3>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isRefreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-1 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Status Summary */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <div className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Available: {statusCounts.available || 0}
          </div>
          <div className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Busy: {statusCounts.busy || 0}
          </div>
          <div className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Offline: {statusCounts.offline || 0}
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search agents..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      
      {/* Agents List */}
      <div className="overflow-y-auto max-h-64">
        {filteredExtensions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredExtensions.map((ext) => (
              <li key={ext.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {ext.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{ext.name}</p>
                      <p className="text-xs text-gray-500">Ext: {ext.number}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ext.status)}`}>
                      {ext.status.charAt(0).toUpperCase() + ext.status.slice(1)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No agents found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}