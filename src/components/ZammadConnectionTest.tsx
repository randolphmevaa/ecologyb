// src/components/ZammadConnectionTest.tsx
'use client';

import { useState, useEffect } from 'react';

// Define specific types instead of using 'any'
interface ZammadVersionInfo {
  version?: string;
  // Add any other known fields from the version response
  [key: string]: unknown; // For any additional fields we don't know about
}

interface ConfigDetails {
  baseUrl?: string;
  apiTokenSet?: boolean;
  baseUrlSet?: boolean;
  baseUrlValue?: string;
  environment?: string;
  apiTokenValid?: boolean;
  [key: string]: unknown; // For any additional fields
}

interface ConnectionState {
  isLoading: boolean;
  isSuccess?: boolean;
  isConnected?: boolean;
  zammadVersion?: ZammadVersionInfo;
  userCount?: number | string;
  error?: string;
  details?: ConfigDetails;
}

export default function ZammadConnectionTest() {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isLoading: true
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        const response = await fetch('/api/pbx?action=testConnection');
        const data = await response.json();
        
        setConnectionState({
          isLoading: false,
          isSuccess: data.success,
          isConnected: data.connectionActive,
          zammadVersion: data.zammadVersion,
          userCount: data.userCount,
          error: data.error,
          details: data.configDetails || data.details
        });
      } catch (err) {
        setConnectionState({
          isLoading: false,
          isSuccess: false,
          isConnected: false,
          error: err instanceof Error ? err.message : 'Failed to test connection'
        });
      }
    }

    testConnection();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Zammad Connection Status</h2>
      
      {connectionState.isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2">Testing connection to Zammad...</p>
        </div>
      ) : connectionState.isConnected ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-green-800 font-semibold">Successfully connected to Zammad!</h3>
          </div>
          <div className="mt-3">
            <p><strong>Zammad Version:</strong> {JSON.stringify(connectionState.zammadVersion)}</p>
            <p><strong>User Count:</strong> {connectionState.userCount}</p>
            <p><strong>API Base URL:</strong> {connectionState.details?.baseUrl}</p>
            <p><strong>API Token:</strong> Valid</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h3 className="text-red-800 font-semibold">Could not connect to Zammad</h3>
          </div>
          <div className="mt-3">
            <p><strong>Error:</strong> {connectionState.error}</p>
            
            <button 
              className="text-blue-600 underline mt-2 text-sm" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            
            {showDetails && connectionState.details && (
              <div className="mt-3 bg-gray-100 p-3 rounded overflow-auto max-h-64">
                <pre className="text-xs">{JSON.stringify(connectionState.details, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Next Steps</h3>
        {connectionState.isConnected ? (
          <ul className="list-disc pl-5 space-y-2">
            <li>You can now use the PBX integration components in your CRM</li>
            <li>Try viewing call history, making calls, or creating tickets</li>
            <li>Ensure your Zammad instance has CTI enabled in Settings</li>
          </ul>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            <li>Check that your environment variables are set correctly</li>
            <li>Verify that your Zammad API token has the necessary permissions</li>
            <li>Make sure your Zammad instance is running and accessible</li>
            <li>Check your network/firewall settings if accessing a remote instance</li>
          </ul>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry Connection Test
        </button>
      </div>
    </div>
  );
}