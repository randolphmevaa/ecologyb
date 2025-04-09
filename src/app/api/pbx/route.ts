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

// Define interface for Zammad CTI Log entries
interface ZammadCtiLog {
  id: number;
  from?: string;
  to?: string;
  created_at: string;
  duration?: number;
  state: string;
  direction: 'in' | 'out';
  customer_id?: number;
  ticket_id?: number;
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
  
  // For testing purposes
  getConfig(): ZammadConfig {
    return { ...this.config };
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
    
    // In Zammad, we need to get this from the call history in Cti::Log
    const response = await this.makeRequest(
      `/cti_logs?expand=true&limit=${limit}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch call history: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Zammad cti_logs to our PBXCall format
    return data.map((ctiLog: ZammadCtiLog) => ({
      id: ctiLog.id.toString(),
      caller: ctiLog.from || '',
      recipient: ctiLog.to || '',
      timestamp: ctiLog.created_at,
      duration: ctiLog.duration,
      status: this.mapZammadCallStatus(ctiLog.state),
      direction: ctiLog.direction,
      customer_id: ctiLog.customer_id?.toString(),
      ticket_id: ctiLog.ticket_id?.toString(),
    }));
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
    
    const ctiLog = await response.json() as ZammadCtiLog;
    
    return {
      id: ctiLog.id.toString(),
      caller: ctiLog.from || '',
      recipient: ctiLog.to || '',
      timestamp: ctiLog.created_at,
      duration: ctiLog.duration,
      status: this.mapZammadCallStatus(ctiLog.state),
      direction: ctiLog.direction,
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
    
    const result = await response.json() as { id: number; created_at?: string };
    
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

// Zammad version response type
interface ZammadVersionInfo {
  version: string;
  [key: string]: unknown;
}

// Connection test response type
interface ConnectionTestResponse {
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
  };
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

// Test the Zammad connection
async function testZammadConnection(service: ZammadService): Promise<ConnectionTestResponse> {
  try {
    // First check if we're in mock mode
    const config = service.getConfig();
    if (config.useMock) {
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
    const response = await fetch(`${config.baseUrl}/version`, {
      headers: {
        'Authorization': `Token token=${config.apiToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    const versionData = await response.json() as ZammadVersionInfo;
    
    // Now try to get some basic user data to verify permissions
    const usersResponse = await fetch(`${config.baseUrl}/users`, {
      headers: {
        'Authorization': `Token token=${config.apiToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    const usersData = await usersResponse.json();
    
    return {
      success: true,
      connectionActive: true,
      zammadVersion: versionData,
      userCount: Array.isArray(usersData) ? usersData.length : 'Unknown',
      configDetails: {
        baseUrl: config.baseUrl.replace(/\/[^\/]+$/, '/***'), // Mask the endpoint part
        apiTokenValid: true
      }
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return {
      success: false,
      connectionActive: false,
      error: errorMessage,
      details: errorStack,
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
}

interface ApiErrorResponse {
  success: false;
  error: string;
  detail?: string;
}

// type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

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
        const calls = await service.getCallHistory(limit, page);
        return NextResponse.json({ success: true, data: calls } as ApiSuccessResponse<PBXCall[]>);
        
      case 'callDetails':
        const callId = searchParams.get('callId');
        if (!callId) {
          return NextResponse.json(
            { success: false, error: 'Call ID is required' } as ApiErrorResponse,
            { status: 400 }
          );
        }
        const call = await service.getCallDetails(callId);
        return NextResponse.json({ success: true, data: call } as ApiSuccessResponse<PBXCall>);
        
      case 'extensions':
        const extensions = await service.getExtensions();
        return NextResponse.json({ success: true, data: extensions } as ApiSuccessResponse<PBXExtension[]>);
        
      case 'findCustomer':
        const phone = searchParams.get('phone');
        if (!phone) {
          return NextResponse.json(
            { success: false, error: 'Phone number is required' } as ApiErrorResponse,
            { status: 400 }
          );
        }
        const customer = await service.findCustomerByPhone(phone);
        return NextResponse.json({ success: true, data: customer } as ApiSuccessResponse<ZammadUser | null>);
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' } as ApiErrorResponse,
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error('Zammad API error:', error);
    
    // Provide a more helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        detail: error instanceof Error ? error.toString() : undefined
      } as ApiErrorResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const service = getZammadService();
  
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'makeCall':
        const { from, to } = body;
        if (!from || !to) {
          return NextResponse.json(
            { success: false, error: 'From and To numbers are required' } as ApiErrorResponse,
            { status: 400 }
          );
        }
        const call = await service.makeCall(from, to);
        return NextResponse.json({ success: true, data: call } as ApiSuccessResponse<PBXCall>);
        
      case 'createTicket':
        const { callId, customerId, title, note } = body;
        if (!callId || !customerId || !title) {
          return NextResponse.json(
            { success: false, error: 'Call ID, Customer ID, and Title are required' } as ApiErrorResponse,
            { status: 400 }
          );
        }
        const ticket = await service.createTicketForCall(callId, customerId, title, note || '');
        return NextResponse.json({ success: true, data: ticket } as ApiSuccessResponse<ZammadTicket>);
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' } as ApiErrorResponse,
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error('Zammad API error:', error);
    
    // Provide a more helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        detail: error instanceof Error ? error.toString() : undefined
      } as ApiErrorResponse,
      { status: 500 }
    );
  }
}