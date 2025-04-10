// src/components/dashboard/ActiveCallsPanel.tsx
import { useState } from 'react';
import { PBXCall } from '@/app/api/pbx/route';

interface ActiveCallsPanelProps {
  activeCalls: PBXCall[];
  onViewDetails: (callId: string) => void;
  isLoading: boolean;
}

export default function ActiveCallsPanel({ 
  activeCalls, 
  onViewDetails, 
  isLoading 
}: ActiveCallsPanelProps) {
  const [sortField, setSortField] = useState<keyof PBXCall>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof PBXCall) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCalls = [...activeCalls].sort((a, b) => {
    if ((a[sortField] ?? '') < (b[sortField] ?? '')) return sortDirection === 'asc' ? -1 : 1;
    if ((a[sortField] ?? '') > (b[sortField] ?? '')) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const durationMs = now - start;
    
    const seconds = Math.floor(durationMs / 1000) % 60;
    const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Active Calls
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activeCalls.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {activeCalls.length} {activeCalls.length === 1 ? 'call' : 'calls'}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading && activeCalls.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-gray-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading active calls...</p>
          </div>
        ) : activeCalls.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-gray-500">No active calls at the moment</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('direction')}
                >
                  <div className="flex items-center">
                    Direction
                    {sortField === 'direction' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('caller')}
                >
                  <div className="flex items-center">
                    From
                    {sortField === 'caller' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('recipient')}
                >
                  <div className="flex items-center">
                    To
                    {sortField === 'recipient' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center">
                    Duration
                    {sortField === 'timestamp' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${call.direction === 'in' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {call.direction === 'in' ? 'Incoming' : 'Outgoing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.caller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.recipient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-600 font-medium animate-pulse">
                      {formatDuration(call.timestamp)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(call.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}