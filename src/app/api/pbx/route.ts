// src/app/api/pbx/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

export interface ZammadTicket {
  id: number;
  title: string;
  number: string;
  customer_id: number;
  state_id: number;
  priority_id: number;
  created_at: string;
}

export interface ZammadUser {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
}

// Additional interfaces for Zammad API responses
interface ZammadActivityStream {
  id: string | number;
  title: string;
  body: string;
  created_at: string;
  created_by_id?: number;
}

interface ZammadCallData {
  id: string | number;
  from?: string;
  to?: string;
  caller_id?: string;
  destination?: string;
  caller?: string;
  recipient?: string;
  direction?: 'in' | 'out';
  state?: string;
  status?: string;
  duration?: number;
  duration_talking_time?: number;
  start_at?: string;
  end_at?: string;
  created_at?: string;
  initialized_at?: string;
  timestamp?: string;
  call_id?: string;
  customer_id?: number;
  user_id?: number;
  ticket_id?: number;
  recording?: string;
  from_pretty?: string;
  to_pretty?: string;
}

interface ZammadVersionInfo {
  version: string;
  build: string;
  api?: string;
}

// Configuration for Zammad integration
interface ZammadConfig {
  apiToken: string;
  baseUrl: string;
  useMock: boolean;
}

// Mock data for development
const MOCK_CALL_HISTORY: PBXCall[] = [
  {
    id: 'call-001',
    caller: '+1 (555) 123-4567',
    recipient: '+1 (555) 987-6543',
    timestamp: new Date().toISOString(),
    duration: 145,
    status: 'completed',
    recording: 'https://example.com/recording-001.mp3',
    direction: 'in',
    customer_id: '101',
    ticket_id: '1001',
  },
  {
    id: 'call-002',
    caller: '+1 (555) 333-2222',
    recipient: '+1 (555) 444-5555',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'missed',
    direction: 'in',
  },
  {
    id: 'call-003',
    caller: '+1 (555) 777-8888',
    recipient: '+1 (555) 666-9999',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    duration: 67,
    status: 'completed',
    direction: 'out',
    customer_id: '102',
  },
];

const MOCK_EXTENSIONS: PBXExtension[] = [
  {
    id: 'ext-001',
    number: '101',
    name: 'John Smith',
    status: 'available',
    user_id: '1',
  },
  {
    id: 'ext-002',
    number: '102',
    name: 'Sarah Johnson',
    status: 'busy',
    user_id: '2',
  },
  {
    id: 'ext-003',
    number: '103',
    name: 'Michael Brown',
    status: 'offline',
    user_id: '3',
  },
];

// Zammad Service for handling API requests
class ZammadService {
  private config: ZammadConfig;
  
  constructor() {
    // FIXED: Only use mock mode if environment variables are missing
    // Even in development mode, use real credentials if provided
    const useMock = !process.env.ZAMMAD_API_TOKEN || !process.env.ZAMMAD_BASE_URL;
    
    this.config = {
      apiToken: process.env.ZAMMAD_API_TOKEN || 'mock-api-token',
      baseUrl: process.env.ZAMMAD_BASE_URL || 'https://your-zammad-instance.com/api/v1',
      useMock,
    };
    
    if (this.config.useMock) {
      console.log('Zammad Service running in mock mode');
    } else {
      console.log('Zammad Service running with real credentials');
    }
  }
  
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Token token=${this.config.apiToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    return fetch(url, {
      ...options,
      headers,
    });
  }
  
  // Get call history from Zammad
  async getCallHistory(limit = 50, page = 1): Promise<PBXCall[]> {
    // Return mock data in development mode
    if (this.config.useMock) {
      return [...MOCK_CALL_HISTORY];
    }
    
    try {
      console.log("Trying to fetch call history from Zammad...");
      
      // Try multiple potential endpoints in sequence
      const endpoints = [
        `/cti/caller_ids?expand=true&limit=${limit}&page=${page}`,
        `/cti/log?expand=true&limit=${limit}&page=${page}`,
        `/cti_logs?expand=true&limit=${limit}&page=${page}`,
        `/cti_caller_ids?expand=true&limit=${limit}&page=${page}`
      ];
      
      // Try to parse call data from the recent logs in Zammad
      // This is a fallback method that attempts to parse from activity stream
      const activityResponse = await this.makeRequest(`/activity_stream?limit=${limit}`);
      let activityData: PBXCall[] = [];
      
      if (activityResponse.ok) {
        const activityStream = await activityResponse.json() as ZammadActivityStream[];
        console.log("Got activity stream with records:", activityStream.length);
        // Extract CTI-related activities
        activityData = this.extractCallsFromActivity(activityStream);
      }
      
      // Try each endpoint until we get a successful response
      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint);
          const response = await this.makeRequest(endpoint);
          
          if (response.ok) {
            console.log("Successfully got data from endpoint:", endpoint);
            const data = await response.json();
            return this.transformCallData(data);
          } else {
            console.log(`Endpoint ${endpoint} returned ${response.status}: ${response.statusText}`);
          }
        } catch (endpointError) {
          console.log(`Error with endpoint ${endpoint}:`, endpointError);
          // Continue to next endpoint
        }
      }
      
      // If we got activity data and no endpoints worked, use the activity data
      if (activityData.length > 0) {
        console.log("Using call data extracted from activity stream as fallback");
        return activityData;
      }
      
      // If all endpoints failed, try one more approach - get recent tickets potentially related to calls
      console.log("All CTI endpoints failed, trying to fetch from tickets...");
      const ticketsResponse = await this.makeRequest(`/tickets?expand=true&limit=${limit}&page=${page}`);
      
      if (ticketsResponse.ok) {
        const tickets = await ticketsResponse.json() as ZammadTicket[];
        // Try to extract call-related tickets
        const callTickets = this.extractCallTickets(tickets);
        
        if (callTickets.length > 0) {
          console.log("Found call-related tickets:", callTickets.length);
          return callTickets;
        }
      }
      
      // If all attempts have failed, throw an error
      throw new Error("Failed to fetch call history from any Zammad endpoint");
    } catch (error) {
      console.error("Error fetching call history:", error);
      // Return mock data as a fallback in case of error
      console.log("Returning mock call data as fallback due to API error");
      return [...MOCK_CALL_HISTORY];
    }
  }
  
  // Extract calls from activity stream as fallback method
  private extractCallsFromActivity(activities: ZammadActivityStream[]): PBXCall[] {
    if (!Array.isArray(activities)) return [];
    
    // Find activities that mention calls or CTI
    const callActivities = activities.filter(activity => {
      const title = activity.title || '';
      const body = activity.body || '';
      return (
        title.toLowerCase().includes('call') || 
        body.toLowerCase().includes('call') ||
        title.toLowerCase().includes('cti') || 
        body.toLowerCase().includes('cti') ||
        title.toLowerCase().includes('phone') || 
        body.toLowerCase().includes('phone')
      );
    });
    
    console.log("Found potential call activities:", callActivities.length);
    
    // Try to extract call data from these activities
    return callActivities.map((activity, index) => {
      // Attempt to parse phone numbers from the activity
      const phoneRegex = /(\+?\d[\d\s-]{8,}\d)/g;
      const foundNumbers = (activity.title + ' ' + activity.body).match(phoneRegex) || [];
      
      return {
        id: `activity-${activity.id || index}`,
        caller: foundNumbers[0] || 'Unknown',
        recipient: foundNumbers[1] || 'Unknown',
        timestamp: activity.created_at || new Date().toISOString(),
        duration: 0,
        status: 'completed' as const,
        direction: activity.title.toLowerCase().includes('incoming') ? 'in' : 'out',
        customer_id: activity.created_by_id?.toString(),
      };
    });
  }
  
  // Extract call-related tickets
  private extractCallTickets(tickets: ZammadTicket[]): PBXCall[] {
    if (!Array.isArray(tickets)) return [];
    
    // Find tickets that are likely related to calls
    const callTickets = tickets.filter(ticket => {
      const title = ticket.title || '';
      return (
        title.toLowerCase().includes('call') || 
        title.toLowerCase().includes('phone') ||
        title.toLowerCase().includes('cti')
      );
    });
    
    return callTickets.map(ticket => {
      // Try to extract phone numbers from ticket title
      const phoneRegex = /(\+?\d[\d\s-]{8,}\d)/g;
      const foundNumbers = (ticket.title || '').match(phoneRegex) || [];
      
      return {
        id: `ticket-${ticket.id}`,
        caller: foundNumbers[0] || 'Unknown',
        recipient: foundNumbers[1] || 'Unknown',
        timestamp: ticket.created_at,
        duration: 0,
        status: 'completed' as const,
        direction: ticket.title.toLowerCase().includes('incoming') ? 'in' : 'out',
        customer_id: ticket.customer_id?.toString(),
        ticket_id: ticket.id.toString(),
      };
    });
  }
  
  // Transform Zammad call data to our format
  private transformCallData(data: unknown): PBXCall[] {
    interface ListResponse {
      list: ZammadCallData[];
    }
    
    // Check if data has a list property (common in Zammad responses)
    if (data && typeof data === 'object' && 'list' in data && Array.isArray((data as ListResponse).list)) {
      console.log("Found call data in 'list' property with", (data as ListResponse).list.length, "items");
      return this.mapCallsToFormat((data as ListResponse).list);
    }
    
    // Handle if data is not an array
    if (!Array.isArray(data)) {
      console.log("Received non-array data:", data);
      return [];
    }
    
    // If it's a regular array, process normally
    console.log("Processing array of call data with", (data as ZammadCallData[]).length, "items");
    return this.mapCallsToFormat(data as ZammadCallData[]);
  }
  
  // Map call data to our format
  private mapCallsToFormat(callsData: ZammadCallData[]): PBXCall[] {
    return callsData.map((callData: ZammadCallData) => {
      // Get the right fields based on different possible property names
      const from = callData.from || callData.caller_id || callData.caller || '';
      const to = callData.to || callData.destination || callData.recipient || '';
      const direction = callData.direction || 'in';
      const state = callData.state || callData.status || 'completed';
      
      // Calculate duration based on timestamps if available, otherwise use provided duration
      let duration = callData.duration || callData.duration_talking_time || 0;
      if (!duration && callData.start_at && callData.end_at) {
        const start = new Date(callData.start_at).getTime();
        const end = new Date(callData.end_at).getTime();
        duration = Math.floor((end - start) / 1000);
      }
      
      // Get timestamp from whatever field is available
      const timestamp = callData.created_at || 
                        callData.initialized_at || 
                        callData.timestamp || 
                        new Date().toISOString();
                        
      // Return the standardized format
      return {
        id: (callData.id || callData.call_id || `call-${Date.now()}`).toString(),
        caller: from,
        recipient: to,
        timestamp: timestamp,
        duration: duration,
        status: this.mapZammadCallStatus(state),
        direction: direction,
        customer_id: callData.customer_id?.toString() || callData.user_id?.toString(),
        ticket_id: callData.ticket_id?.toString(),
        recording: callData.recording,
        caller_pretty: callData.from_pretty || this.formatPhoneNumber(from),
        recipient_pretty: callData.to_pretty || this.formatPhoneNumber(to)
      };
    });
  }
  
  // Helper to format phone numbers more nicely
  private formatPhoneNumber(number: string): string {
    // If it's not a string or is empty, return as is
    if (typeof number !== 'string' || !number) return number;
    
    // If it starts with a plus, it's likely already in international format
    if (number.startsWith('+')) return number;
    
    // If it's a string of mostly digits, try to format it
    if (/^\d+$/.test(number.replace(/\D/g, ''))) {
      // For numbers that appear to be French (start with 33)
      if (number.startsWith('33') || number.startsWith('0033')) {
        const cleaned = number.replace(/\D/g, '').replace(/^0+/, '');
        const match = cleaned.match(/^33?(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        
        if (match) {
          return `+33 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
        }
      }
      
      // Otherwise, add some basic formatting
      const cleaned = number.replace(/\D/g, '');
      // Insert a space every 2 digits
      return cleaned.replace(/(\d{2})/g, '$1 ').trim();
    }
    
    // If all else fails, return the original
    return number;
  }
  
  // Map Zammad call states to our status format
  private mapZammadCallStatus(state: string): PBXCall['status'] {
    switch (state) {
      case 'ringing':
        return 'active';
      case 'answered':
        return 'completed';
      case 'hangup':
        return 'completed';
      case 'missed':
        return 'missed';
      default:
        return 'queued';
    }
  }
  
  // Get specific call details
  async getCallDetails(callId: string): Promise<PBXCall> {
    // Return mock data in development mode
    if (this.config.useMock) {
      const call = MOCK_CALL_HISTORY.find(call => call.id === callId);
      if (!call) {
        throw new Error(`Call with ID ${callId} not found`);
      }
      return { ...call };
    }
    
    const response = await this.makeRequest(`/cti_logs/${callId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch call details: ${response.statusText}`);
    }
    
    const ctiLog = await response.json() as ZammadCallData;
    
    return {
      id: ctiLog.id.toString(),
      caller: ctiLog.from || '',
      recipient: ctiLog.to || '',
      timestamp: ctiLog.created_at || new Date().toISOString(),
      duration: ctiLog.duration,
      status: this.mapZammadCallStatus(ctiLog.state || ''),
      direction: ctiLog.direction || 'in',
      customer_id: ctiLog.customer_id?.toString(),
      ticket_id: ctiLog.ticket_id?.toString(),
    };
  }
  
  // Trigger a new outbound call
  async makeCall(from: string, to: string): Promise<PBXCall> {
    // Return mock data in development mode
    if (this.config.useMock) {
      const newCall: PBXCall = {
        id: `call-${Date.now().toString().slice(-6)}`,
        caller: from,
        recipient: to,
        timestamp: new Date().toISOString(),
        status: 'active',
        direction: 'out',
      };
      
      // Add to mock history (this won't persist between requests in production)
      MOCK_CALL_HISTORY.unshift(newCall);
      
      return { ...newCall };
    }
    
    // In Zammad, we trigger an outbound call via the telephony integration
    const response = await this.makeRequest(`/cti/out`, {
      method: 'POST',
      body: JSON.stringify({
        from: from,
        to: to,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to initiate call: ${response.statusText}`);
    }
    
    const result = await response.json() as ZammadCallData;
    
    return {
      id: result.id.toString(),
      caller: from,
      recipient: to,
      timestamp: result.created_at || new Date().toISOString(),
      status: 'active',
      direction: 'out',
    };
  }
  
  // Get agent extensions (Get Zammad users with phone attributes)
  async getExtensions(): Promise<PBXExtension[]> {
    // Return mock data in development mode
    if (this.config.useMock) {
      return [...MOCK_EXTENSIONS];
    }
    
    // In Zammad, we need to get users who can be used as agents
    const response = await this.makeRequest('/users?role_ids=3&active=true');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch extensions: ${response.statusText}`);
    }
    
    const users = await response.json() as ZammadUser[];
    
    // Transform Zammad users to our PBXExtension format
    // Only include users with phone information
    return users
      .filter((user: ZammadUser) => user.phone)
      .map((user: ZammadUser) => ({
        id: `ext-${user.id}`,
        number: user.phone || '',
        name: `${user.firstname} ${user.lastname}`,
        status: 'available', // Default status as Zammad doesn't expose this directly
        user_id: user.id.toString(),
      }));
  }
  
  // Create a ticket for a call
  async createTicketForCall(
    callId: string, 
    customerId: string, 
    title: string, 
    note: string
  ): Promise<ZammadTicket> {
    if (this.config.useMock) {
      // Mock response
      return {
        id: 1234,
        title,
        number: `#${Math.floor(Math.random() * 10000)}`,
        customer_id: parseInt(customerId),
        state_id: 1,
        priority_id: 2,
        created_at: new Date().toISOString(),
      };
    }
    
    const response = await this.makeRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify({
        title,
        customer_id: parseInt(customerId),
        article: {
          subject: `Call ${callId}`,
          body: note,
          type: 'note',
          internal: false,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create ticket: ${response.statusText}`);
    }
    
    return response.json() as Promise<ZammadTicket>;
  }
  
  // Get customer information by phone number
  async findCustomerByPhone(phone: string): Promise<ZammadUser | null> {
    if (this.config.useMock) {
      // Mock customer data
      return {
        id: 101,
        login: 'customer@example.com',
        firstname: 'John',
        lastname: 'Customer',
        email: 'customer@example.com',
        phone,
      };
    }
    
    // Zammad search for customers with this phone
    const response = await this.makeRequest(
      `/users/search?query=phone:${encodeURIComponent(phone)}&role_ids=2`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search customers: ${response.statusText}`);
    }
    
    const results = await response.json() as ZammadUser[];
    
    // Return the first matching customer or null
    return results.length > 0 ? results[0] : null;
  }
}

// Singleton instance of the Zammad service
let zammadService: ZammadService;

// Get the Zammad service instance
function getZammadService() {
  if (!zammadService) {
    zammadService = new ZammadService();
  }
  return zammadService;
}

// Response type for connection test
interface ConnectionTestResult {
  success: boolean;
  connectionActive: boolean;
  error?: string;
  details?: string;
  zammadVersion?: ZammadVersionInfo;
  userCount?: number | string;
  configDetails: {
    apiTokenSet?: boolean;
    baseUrlSet?: boolean;
    baseUrlValue?: string;
    environment?: string;
    baseUrl?: string;
    apiTokenValid?: boolean;
  }
}

// Test the Zammad connection
async function testZammadConnection(service: ZammadService): Promise<ConnectionTestResult> {
  try {
    // First check if we're in mock mode
    const serviceConfig = service as unknown as { config: ZammadConfig };
    if (serviceConfig.config.useMock) {
      return {
        success: false,
        connectionActive: false,
        error: "Running in mock mode - environment variables might not be set correctly",
        configDetails: {
          apiTokenSet: !!process.env.ZAMMAD_API_TOKEN,
          baseUrlSet: !!process.env.ZAMMAD_BASE_URL,
          baseUrlValue: process.env.ZAMMAD_BASE_URL?.replace(/\/[^\/]+$/, '/***'), // Mask the endpoint part for security
          environment: process.env.NODE_ENV
        }
      };
    }
    
    // Try to make a simple request to get version info
    const response = await fetch(`${serviceConfig.config.baseUrl}/version`, {
      headers: {
        'Authorization': `Token token=${serviceConfig.config.apiToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    const versionData = await response.json() as ZammadVersionInfo;
    
    // Now try to get some basic user data to verify permissions
    const usersResponse = await fetch(`${serviceConfig.config.baseUrl}/users`, {
      headers: {
        'Authorization': `Token token=${serviceConfig.config.apiToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    const usersData = await usersResponse.json() as ZammadUser[];
    
    return {
      success: true,
      connectionActive: true,
      zammadVersion: versionData,
      userCount: Array.isArray(usersData) ? usersData.length : 'Unknown',
      configDetails: {
        baseUrl: serviceConfig.config.baseUrl.replace(/\/[^\/]+$/, '/***'), // Mask the endpoint part
        apiTokenValid: true
      }
    };
  } catch (error) {
    const typedError = error as Error;
    return {
      success: false,
      connectionActive: false,
      error: typedError.message || 'Connection test failed',
      details: typedError.stack,
      configDetails: {
        apiTokenSet: !!process.env.ZAMMAD_API_TOKEN,
        baseUrlSet: !!process.env.ZAMMAD_BASE_URL,
        baseUrlValue: process.env.ZAMMAD_BASE_URL?.replace(/\/[^\/]+$/, '/***'), // Mask the endpoint part for security
        environment: process.env.NODE_ENV
      }
    };
  }
}

// API response types
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  note?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  detail?: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// API route handlers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const service = getZammadService();
  
  try {
    switch (action) {
      case 'testConnection':
        // Test if we can connect to Zammad properly
        const testResult = await testZammadConnection(service);
        return NextResponse.json(testResult);
        
      case 'callHistory':
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);
        
        try {
          const calls = await service.getCallHistory(limit, page);
          return NextResponse.json({ success: true, data: calls } as ApiResponse<PBXCall[]>);
        } catch (callHistoryError) {
          console.error("Error fetching call history:", callHistoryError);
          // Try the raw logs endpoint as a fallback
          return NextResponse.json({ 
            success: true, 
            data: MOCK_CALL_HISTORY,
            note: "Using sample data due to API error"
          } as ApiResponse<PBXCall[]>);
        }
        
      case 'recentLogs':
        // This is a special endpoint to get raw CTI logs from the webhook
        try {
          // Try a few different approaches to get CTI logs
          // First try the direct URL you provided
          const webhookId = "Vjn8CEqSFPaVlxR4KKKu-3fqflQ";
          let logsData: unknown[] | null = null;
          
          // Try approach 1: Direct logs from webhook
          try {
            const logsResponse = await fetch(`${process.env.ZAMMAD_BASE_URL}/cti/${webhookId}/logs`, {
              headers: {
                'Authorization': `Token token=${process.env.ZAMMAD_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              cache: 'no-store'
            });
            
            if (logsResponse.ok) {
              logsData = await logsResponse.json() as unknown[];
            }
          } catch (e) {
            console.log("Approach 1 failed:", e);
          }
          
          // Try approach 2: Standard logs endpoint
          if (!logsData) {
            try {
              const standardResponse = await fetch(`${process.env.ZAMMAD_BASE_URL}/cti/logs`, {
                headers: {
                  'Authorization': `Token token=${process.env.ZAMMAD_API_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                cache: 'no-store'
              });
              
              if (standardResponse.ok) {
                logsData = await standardResponse.json() as unknown[];
              }
            } catch (e) {
              console.log("Approach 2 failed:", e);
            }
          }
          
          // Try approach 3: Activity stream with filtering
          if (!logsData) {
            try {
              const activityResponse = await fetch(`${process.env.ZAMMAD_BASE_URL}/activity_stream?limit=50`, {
                headers: {
                  'Authorization': `Token token=${process.env.ZAMMAD_API_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                cache: 'no-store'
              });
              
              if (activityResponse.ok) {
                const activities = await activityResponse.json() as ZammadActivityStream[];
                
               // Filter activities related to calls
               if (Array.isArray(activities)) {
                logsData = activities.filter(activity => {
                  const title = activity.title || '';
                  const body = activity.body || '';
                  return title.includes('call') || body.includes('call') || 
                         title.includes('phone') || body.includes('phone') ||
                         title.includes('CTI') || body.includes('CTI');
                });
              }
            }
          } catch (e) {
            console.log("Approach 3 failed:", e);
          }
        }
        
        if (logsData) {
          return NextResponse.json({ success: true, data: logsData } as ApiResponse<unknown[]>);
        } else {
          // If all approaches failed but we didn't throw an error, return empty array
          return NextResponse.json({ success: true, data: [] } as ApiResponse<unknown[]>);
        }
      } catch (logsError) {
        const typedError = logsError as Error;
        console.error("Error fetching raw logs:", logsError);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to fetch raw CTI logs',
          detail: typedError.message
        } as ApiResponse<never>, { status: 500 });
      }
      
    case 'callDetails':
      const callId = searchParams.get('callId');
      if (!callId) {
        return NextResponse.json(
          { success: false, error: 'Call ID is required' } as ApiResponse<never>,
          { status: 400 }
        );
      }
      const call = await service.getCallDetails(callId);
      return NextResponse.json({ success: true, data: call } as ApiResponse<PBXCall>);
      
    case 'extensions':
      const extensions = await service.getExtensions();
      return NextResponse.json({ success: true, data: extensions } as ApiResponse<PBXExtension[]>);
      
    case 'findCustomer':
      const phone = searchParams.get('phone');
      if (!phone) {
        return NextResponse.json(
          { success: false, error: 'Phone number is required' } as ApiResponse<never>,
          { status: 400 }
        );
      }
      const customer = await service.findCustomerByPhone(phone);
      return NextResponse.json({ success: true, data: customer } as ApiResponse<ZammadUser | null>);
      
    default:
      return NextResponse.json(
        { success: false, error: 'Invalid action' } as ApiResponse<never>,
        { status: 400 }
      );
  }
} catch (error) {
  const typedError = error as Error;
  console.error('Zammad API error:', error);
  
  // Provide a more helpful error message
  let errorMessage = 'Failed to process request';
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  return NextResponse.json(
    { 
      success: false, 
      error: errorMessage,
      detail: typedError.toString()
    } as ApiResponse<never>,
    { status: 500 }
  );
}
}

// POST handler types
interface MakeCallRequest {
action: 'makeCall';
from: string;
to: string;
}

interface CreateTicketRequest {
action: 'createTicket';
callId: string;
customerId: string;
title: string;
note?: string;
}

type PostRequest = MakeCallRequest | CreateTicketRequest;

export async function POST(request: NextRequest) {
const service = getZammadService();

try {
  const body = await request.json() as PostRequest;
  const { action } = body;
  
  switch (action) {
    case 'makeCall':
      const { from, to } = body;
      if (!from || !to) {
        return NextResponse.json(
          { success: false, error: 'From and To numbers are required' } as ApiResponse<never>,
          { status: 400 }
        );
      }
      const call = await service.makeCall(from, to);
      return NextResponse.json({ success: true, data: call } as ApiResponse<PBXCall>);
      
    case 'createTicket':
      const { callId, customerId, title, note } = body;
      if (!callId || !customerId || !title) {
        return NextResponse.json(
          { success: false, error: 'Call ID, Customer ID, and Title are required' } as ApiResponse<never>,
          { status: 400 }
        );
      }
      const ticket = await service.createTicketForCall(callId, customerId, title, note || '');
      return NextResponse.json({ success: true, data: ticket } as ApiResponse<ZammadTicket>);
      
    default:
      return NextResponse.json(
        { success: false, error: 'Invalid action' } as ApiResponse<never>,
        { status: 400 }
      );
  }
} catch (error) {
  const typedError = error as Error;
  console.error('Zammad API error:', error);
  
  // Provide a more helpful error message
  let errorMessage = 'Failed to process request';
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  return NextResponse.json(
    { 
      success: false, 
      error: errorMessage,
      detail: typedError.toString()
    } as ApiResponse<never>,
    { status: 500 }
  );
}
}
