// src/components/ZammadConnectionStatus.tsx
'use client';

import { useState, useEffect } from 'react';
import { zammadPbxService } from '@/services/zammadPbxService';
import { Cog6ToothIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface ZammadConnectionStatusProps {
  isDarkMode: boolean;
}

export default function ZammadConnectionStatus({ isDarkMode }: ZammadConnectionStatusProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await zammadPbxService.testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Error checking Zammad connection:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    
    // Check connection every 60 seconds
    const interval = setInterval(checkConnection, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative flex items-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'
        }`}
      >
        <div className="relative">
          <PhoneIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
          <span 
            className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
              connectionStatus === 'connected' 
                ? 'bg-green-500' 
                : connectionStatus === 'disconnected' 
                  ? 'bg-red-500' 
                  : 'bg-yellow-500 animate-pulse'
            }`}
          ></span>
        </div>
        <span className={`text-xs ${isDarkMode ? 'text-[#D1D5DB]' : 'text-[#4B5563]'}`}>
          Zammad {
            connectionStatus === 'connected' 
              ? 'Connecté' 
              : connectionStatus === 'disconnected' 
                ? 'Déconnecté' 
                : 'Vérification...'
          }
        </span>
        <Cog6ToothIcon className={`h-3 w-3 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
      </div>
      
      {isHovered && (
        <div 
          className={`absolute top-full mt-1 right-0 z-50 p-3 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-[#1F2937] border border-[#374151]' : 'bg-white border border-[#E5E7EB]'
          }`}
          style={{ minWidth: '220px' }}
        >
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
            État de la connexion
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span 
              className={`inline-flex h-3 w-3 rounded-full ${
                connectionStatus === 'connected' 
                  ? 'bg-green-500' 
                  : connectionStatus === 'disconnected' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500 animate-pulse'
              }`}
            ></span>
            <span className={`text-xs ${isDarkMode ? 'text-[#D1D5DB]' : 'text-[#4B5563]'}`}>
              {connectionStatus === 'connected' 
                ? 'Connecté à Zammad' 
                : connectionStatus === 'disconnected' 
                  ? 'Non connecté à Zammad' 
                  : 'Vérification de la connexion...'}
            </span>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            {connectionStatus === 'connected' 
              ? 'Votre système est correctement connecté à l\'API Zammad.' 
              : connectionStatus === 'disconnected' 
                ? 'Impossible de se connecter à l\'API Zammad. Les données affichées peuvent être des simulations.' 
                : 'Vérification de la connexion à l\'API Zammad...'}
          </p>
          {connectionStatus === 'disconnected' && (
            <button 
              onClick={async () => {
                setConnectionStatus('checking');
                const isConnected = await zammadPbxService.testConnection();
                setConnectionStatus(isConnected ? 'connected' : 'disconnected');
              }}
              className={`mt-2 text-xs px-2 py-1 rounded ${
                isDarkMode 
                  ? 'bg-[#374151] text-[#F9FAFB] hover:bg-[#4B5563]' 
                  : 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]'
              }`}
            >
              Réessayer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
