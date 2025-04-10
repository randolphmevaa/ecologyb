// src/hooks/useZammadPBX.ts
import { useState, useEffect, useCallback } from 'react';
import { zammadPbxService, PBXCall } from '@/services/zammadPbxService';
import { 
  ZammadDataMapper, 
  IContact, 
  ICallHistory, 
  IActiveCall, 
  IVoicemail 
} from '@/utils/zammadDataMapper';

export function useZammadPBX() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [calls, setCalls] = useState<PBXCall[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [callHistory, setCallHistory] = useState<ICallHistory[]>([]);
  const [voicemails, setVoicemails] = useState<IVoicemail[]>([]);
  
  // Test connection
  const testConnection = useCallback(async () => {
    try {
      const connected = await zammadPbxService.testConnection();
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.error('Error testing connection:', error);
      setIsConnected(false);
      return false;
    }
  }, []);
  
  // Fetch call history
  const fetchCallHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedCalls = await zammadPbxService.getCallHistory();
      setCalls(fetchedCalls);
      
      const mappedHistory = ZammadDataMapper.mapToCallHistory(fetchedCalls);
      setCallHistory(mappedHistory);
      
      // Extract voicemails
      const extractedVoicemails = ZammadDataMapper.extractVoicemails(fetchedCalls);
      setVoicemails(extractedVoicemails);
      
      return mappedHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching call history';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch contacts from extensions and call history
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get extensions from Zammad
      const extensions = await zammadPbxService.getExtensions();
      const extensionContacts = ZammadDataMapper.mapExtensionsToContacts(extensions);
      
      // Create contact list from call history callers/recipients
      const uniquePhoneNumbers = new Set<string>();
      calls.forEach(call => {
        uniquePhoneNumbers.add(call.caller);
        uniquePhoneNumbers.add(call.recipient);
      });
      
      // Only process a reasonable number of lookups to avoid rate limits
      const phoneNumbersToProcess = Array.from(uniquePhoneNumbers).slice(0, 10);
      const customerContacts: IContact[] = [];
      
      for (const phone of phoneNumbersToProcess) {
        const customer = await zammadPbxService.findCustomerByPhone(phone);
        if (customer) {
          customerContacts.push({
            id: customer.id.toString(),
            name: `${customer.firstname} ${customer.lastname}`,
            phoneNumber: phone,
            email: customer.email,
            avatar: customer.avatar,
            favorite: false, // We need to manage this client-side
            lastCallDate: calls.find(c => c.caller === phone || c.recipient === phone)?.timestamp
          });
        }
      }
      
      // Combine extension and customer contacts (without duplicates)
      const allContacts = [...extensionContacts];
      
      // Add customer contacts that aren't already in the list
      customerContacts.forEach(contact => {
        if (!allContacts.some(c => c.phoneNumber === contact.phoneNumber)) {
          allContacts.push(contact);
        }
      });
      
      setContacts(allContacts);
      return allContacts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching contacts';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [calls]);
  
  // Make a call
  const makeCall = useCallback(async (from: string, to: string): Promise<IActiveCall | null> => {
    try {
      const result = await zammadPbxService.makeCall(from, to);
      if (!result) return null;
      
      // Map to UI active call
      return ZammadDataMapper.mapToActiveCall(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error making call';
      setError(errorMessage);
      return null;
    }
  }, []);
  
  // Fetch data on initial load
  useEffect(() => {
    const fetchData = async () => {
      const connected = await testConnection();
      if (connected) {
        await fetchCallHistory();
        await fetchContacts();
      }
    };
    
    fetchData();
  }, [testConnection, fetchCallHistory, fetchContacts]);
  
  return {
    isConnected,
    isLoading,
    error,
    contacts,
    callHistory,
    voicemails,
    testConnection,
    fetchCallHistory,
    fetchContacts,
    makeCall,
  };
}
