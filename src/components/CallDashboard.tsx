// src/components/CallDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { PBXCall, PBXExtension, ZammadUser } from '@/app/api/pbx/route';
import CallHistoryPanel from './dashboard/CallHistoryPanel';
import ActiveCallsPanel from './dashboard/ActiveCallsPanel';
import DialerPanel from './dashboard/DialerPanel';
import AgentStatusPanel from './dashboard/AgentStatusPanel';
import CallDetailsModal from './dashboard/CallDetailsModal';
import { useInterval } from '@/hooks/useInterval';

export default function CallDashboard() {
  // State for all dashboard data
  const [calls, setCalls] = useState<PBXCall[]>([]);
  const [activeCalls, setActiveCalls] = useState<PBXCall[]>([]);
  const [extensions, setExtensions] = useState<PBXExtension[]>([]);
  const [selectedCall, setSelectedCall] = useState<PBXCall | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ZammadUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [callStats, setCallStats] = useState({
    today: { total: 0, missed: 0, completed: 0 },
    week: { total: 0, missed: 0, completed: 0 },
  });

  // Fetch call history
  const fetchCallHistory = async () => {
    try {
      setError(null);
      const response = await fetch('/api/pbx?action=callHistory&limit=100');
      const result = await response.json();
      
      if (result.success) {
        setCalls(result.data);
        
        // Filter active calls
        const active = result.data.filter((call: PBXCall) => call.status === 'active');
        setActiveCalls(active);
        
        // Calculate call statistics
        calculateCallStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch call history');
      }
    } catch (err) {
      setError('Error connecting to Zammad API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate call statistics
  const calculateCallStats = (callData: PBXCall[]) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    
    const todayCalls = callData.filter(call => new Date(call.timestamp) >= startOfDay);
    const weekCalls = callData.filter(call => new Date(call.timestamp) >= startOfWeek);
    
    setCallStats({
      today: {
        total: todayCalls.length,
        missed: todayCalls.filter(call => call.status === 'missed').length,
        completed: todayCalls.filter(call => call.status === 'completed').length,
      },
      week: {
        total: weekCalls.length,
        missed: weekCalls.filter(call => call.status === 'missed').length,
        completed: weekCalls.filter(call => call.status === 'completed').length,
      },
    });
  };

  // Fetch extensions
  const fetchExtensions = async () => {
    try {
      const response = await fetch('/api/pbx?action=extensions');
      const result = await response.json();
      
      if (result.success) {
        setExtensions(result.data);
      } else {
        console.error('Failed to fetch extensions:', result.error);
      }
    } catch (err) {
      console.error('Error fetching extensions:', err);
    }
  };

  // Get call details and customer info
  const getCallDetails = async (callId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pbx?action=callDetails&callId=${callId}`);
      const result = await response.json();
      
      if (result.success) {
        const callData = result.data;
        setSelectedCall(callData);
        
        // If there's a caller number, find customer
        if (callData.caller) {
          await findCustomerByPhone(callData.caller);
        } else {
          setSelectedCustomer(null);
        }
      } else {
        setError(result.error || 'Failed to fetch call details');
      }
    } catch (err) {
      setError('Error fetching call details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Find customer by phone number
  const findCustomerByPhone = async (phone: string) => {
    try {
      const response = await fetch(`/api/pbx?action=findCustomer&phone=${encodeURIComponent(phone)}`);
      const result = await response.json();
      
      if (result.success) {
        setSelectedCustomer(result.data);
      } else {
        setSelectedCustomer(null);
      }
    } catch (err) {
      console.error('Error finding customer:', err);
      setSelectedCustomer(null);
    }
  };

  // Make an outbound call
  const makeCall = async (from: string, to: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/pbx', {
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
        // Refresh call history to show the new call
        fetchCallHistory();
        return true;
      } else {
        setError(result.error || 'Failed to initiate call');
        return false;
      }
    } catch (err) {
      setError('Error making call');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create a ticket for a call
  const createTicket = async (
    callId: string,
    customerId: string,
    title: string,
    note: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/pbx', {
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
        // Update selected call with ticket ID
        if (selectedCall) {
          setSelectedCall({
            ...selectedCall,
            ticket_id: result.data.id.toString(),
          });
        }
        return true;
      } else {
        setError(result.error || 'Failed to create ticket');
        return false;
      }
    } catch (err) {
      setError('Error creating ticket');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    Promise.all([fetchCallHistory(), fetchExtensions()]);
  }, []);
  
  // Periodic refresh (every 30 seconds)
  useInterval(() => {
    fetchCallHistory();
  }, 30000);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Call Dashboard</h1>
            <div className="flex space-x-4">
              {error && (
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={() => Promise.all([fetchCallHistory(), fetchExtensions()])}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Calls Today
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {callStats.today.total}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Missed Calls Today
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-red-600">
                  {callStats.today.missed}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Calls
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {activeCalls.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Available Agents
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {extensions.filter(ext => ext.status === 'available').length}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Dashboard Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Dialer & Agent Status */}
          <div className="lg:col-span-1 space-y-6">
            <DialerPanel 
              extensions={extensions} 
              onMakeCall={makeCall} 
              isLoading={loading} 
            />
            <AgentStatusPanel 
              extensions={extensions} 
              onRefresh={fetchExtensions} 
            />
          </div>
          
          {/* Middle & Right Columns - Active Calls & Call History */}
          <div className="lg:col-span-2 space-y-6">
            <ActiveCallsPanel 
              activeCalls={activeCalls} 
              onViewDetails={getCallDetails} 
              isLoading={loading} 
            />
            <CallHistoryPanel 
              calls={calls} 
              onViewDetails={getCallDetails} 
              isLoading={loading} 
            />
          </div>
        </div>
      </main>
      
      {/* Call Details Modal */}
      {selectedCall && (
        <CallDetailsModal
          call={selectedCall}
          customer={selectedCustomer}
          onClose={() => {
            setSelectedCall(null);
            setSelectedCustomer(null);
          }}
          onCreateTicket={createTicket}
          isLoading={loading}
        />
      )}
    </div>
  );
}