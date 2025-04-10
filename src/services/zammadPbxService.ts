// src/services/zammadPbxService.ts

// Types for Zammad PBX interactions
export interface PBXCall {
    id: string;
    caller: string;
    recipient: string;
    timestamp: string;
    duration?: number;
    status: 'active' | 'completed' | 'missed' | 'queued';
    recording?: string;
    direction: 'in' | 'out';
    note?: string;
    customer_id?: string;
    ticket_id?: string;
    caller_pretty?: string;
    recipient_pretty?: string;
  }
    
  export interface PBXExtension {
    id: string;
    number: string;
    name: string;
    status: 'available' | 'busy' | 'offline';
    user_id: string;
  }
    
  export interface ZammadUser {
    id: number;
    login: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    avatar?: string;
  }
  
  // Define interface for Zammad ticket
  export interface ZammadTicket {
    id: number;
    title: string;
    number: string;
    customer_id: number;
    state_id: number;
    priority_id: number;
    created_at: string;
  }
  
  // Interface for raw CTI logs
  export interface CTILog {
    id?: string | number;
    created_at?: string;
    timestamp?: string;
    from?: string;
    to?: string;
    caller_id?: string;
    destination?: string;
    direction?: 'in' | 'out' | string;
    state?: string;
    status?: string;
    duration?: number;
    customer_id?: number | string;
    user_id?: number | string;
    ticket_id?: number | string;
    [key: string]: unknown; // Allow for additional properties that might be present
  }
    
  // Service to interact with Zammad PBX API
  class ZammadPbxService {
    private baseUrl = '/api/pbx';
      
    // Get call history
    async getCallHistory(limit = 100): Promise<PBXCall[]> {
      try {
        const response = await fetch(`${this.baseUrl}?action=callHistory&limit=${limit}`);
        const result = await response.json();
          
        if (result.success) {
          return result.data || [];
        } else {
          console.error('Failed to fetch call history:', result.error);
          return [];
        }
      } catch (error) {
        console.error('Error fetching call history:', error);
        return [];
      }
    }
      
    // Make an outbound call
    async makeCall(from: string, to: string): Promise<PBXCall | null> {
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'makeCall',
            from,
            to,
          }),
        });
          
        const result = await response.json();
          
        if (result.success) {
          return result.data;
        } else {
          console.error('Failed to make call:', result.error);
          return null;
        }
      } catch (error) {
        console.error('Error making call:', error);
        return null;
      }
    }
      
    // Get extensions (agents)
    async getExtensions(): Promise<PBXExtension[]> {
      try {
        const response = await fetch(`${this.baseUrl}?action=extensions`);
        const result = await response.json();
          
        if (result.success) {
          return result.data || [];
        } else {
          console.error('Failed to fetch extensions:', result.error);
          return [];
        }
      } catch (error) {
        console.error('Error fetching extensions:', error);
        return [];
      }
    }
      
    // Find customer by phone number
    async findCustomerByPhone(phone: string): Promise<ZammadUser | null> {
      try {
        const response = await fetch(`${this.baseUrl}?action=findCustomer&phone=${encodeURIComponent(phone)}`);
        const result = await response.json();
          
        if (result.success && result.data) {
          return result.data;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error finding customer:', error);
        return null;
      }
    }
      
    // Create a ticket for a call
    async createTicket(callId: string, customerId: string, title: string, note: string): Promise<ZammadTicket | null> {
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'createTicket',
            callId,
            customerId,
            title,
            note,
          }),
        });
          
        const result = await response.json();
          
        if (result.success) {
          return result.data;
        } else {
          console.error('Failed to create ticket:', result.error);
          return null;
        }
      } catch (error) {
        console.error('Error creating ticket:', error);
        return null;
      }
    }
      
    // Check connection to Zammad
    async testConnection(): Promise<boolean> {
      try {
        const response = await fetch(`${this.baseUrl}?action=testConnection`);
        const result = await response.json();
          
        return result.success && result.connectionActive;
      } catch (error) {
        console.error('Error testing connection:', error);
        return false;
      }
    }
      
    // Get raw CTI logs
    async getRawCTILogs(): Promise<CTILog[]> {
      try {
        const response = await fetch(`${this.baseUrl}?action=recentLogs`);
        const result = await response.json();
          
        if (result.success) {
          return result.data || [];
        } else {
          console.error('Failed to fetch raw CTI logs:', result.error);
          return [];
        }
      } catch (error) {
        console.error('Error fetching raw CTI logs:', error);
        return [];
      }
    }
  }
    
  // Export a singleton instance
  export const zammadPbxService = new ZammadPbxService();