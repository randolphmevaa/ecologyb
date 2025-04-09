// src/components/ZammadPBXIntegration.tsx
'use client';

import { useState, useEffect } from 'react';
import { PBXCall, PBXExtension, ZammadUser } from '@/app/api/pbx/route';

export default function ZammadPBXIntegration() {
  const [calls, setCalls] = useState<PBXCall[]>([]);
  const [extensions, setExtensions] = useState<PBXExtension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<PBXCall | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ZammadUser | null>(null);
  const [callForm, setCallForm] = useState({ from: '', to: '' });
  const [ticketForm, setTicketForm] = useState({ title: '', note: '' });
  const [showTicketForm, setShowTicketForm] = useState(false);

  // Fetch call history
  const fetchCallHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/pbx?action=callHistory');
      const result = await response.json();
      
      if (result.success) {
        setCalls(result.data);
      } else {
        setError(result.error || 'Failed to fetch call history');
        console.error('API Error Details:', result.detail);
      }
    } catch (err) {
      setError('Error connecting to Zammad API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch extensions
  const fetchExtensions = async () => {
    try {
      setError(null);
      const response = await fetch('/api/pbx?action=extensions');
      const result = await response.json();
      
      if (result.success) {
        setExtensions(result.data);
      } else {
        setError(result.error || 'Failed to fetch extensions');
        console.error('API Error Details:', result.detail);
      }
    } catch (err) {
      setError('Error connecting to Zammad API');
      console.error(err);
    }
  };

  // Get call details
  const getCallDetails = async (callId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/pbx?action=callDetails&callId=${callId}`);
      const result = await response.json();
      
      if (result.success) {
        const callData = result.data;
        setSelectedCall(callData);
        
        // If there's a customer ID, get customer details
        if (callData.customer_id) {
          await findCustomerByPhone(callData.caller);
        } else {
          setSelectedCustomer(null);
        }
      } else {
        setError(result.error || 'Failed to fetch call details');
        console.error('API Error Details:', result.detail);
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

  // Make a new call
  const makeCall = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          from: callForm.from,
          to: callForm.to,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCallForm({ from: '', to: '' });
        // Refresh call history
        fetchCallHistory();
      } else {
        setError(result.error || 'Failed to initiate call');
        console.error('API Error Details:', result.detail);
      }
    } catch (err) {
      setError('Error making call');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create ticket for call
  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCall || !selectedCustomer) {
      setError('Call and customer information required to create a ticket');
      return;
    }
    
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
          callId: selectedCall.id,
          customerId: selectedCustomer.id.toString(),
          title: ticketForm.title,
          note: ticketForm.note,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update selected call with ticket ID
        setSelectedCall({
          ...selectedCall,
          ticket_id: result.data.id.toString(),
        });
        
        setTicketForm({ title: '', note: '' });
        setShowTicketForm(false);
      } else {
        setError(result.error || 'Failed to create ticket');
        console.error('API Error Details:', result.detail);
      }
    } catch (err) {
      setError('Error creating ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCallHistory();
    fetchExtensions();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Zammad PBX Integration</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Make a Call */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Make a Call</h2>
          <form onSubmit={makeCall}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">From Extension</label>
              <select
                className="w-full p-2 border rounded"
                value={callForm.from}
                onChange={(e) => setCallForm({ ...callForm, from: e.target.value })}
                required
              >
                <option value="">Select an extension</option>
                {extensions.map((ext) => (
                  <option key={ext.id} value={ext.number}>
                    {ext.name} ({ext.number})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">To Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter phone number"
                value={callForm.to}
                onChange={(e) => setCallForm({ ...callForm, to: e.target.value })}
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Calling...' : 'Make Call'}
            </button>
          </form>
        </div>
        
        {/* Call History */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Calls</h2>
          
          {loading && !calls.length ? (
            <p>Loading call history...</p>
          ) : calls.length === 0 ? (
            <p>No calls found</p>
          ) : (
            <div className="overflow-auto max-h-96">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Direction</th>
                    <th className="p-2 text-left">Caller</th>
                    <th className="p-2 text-left">Recipient</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call) => (
                    <tr key={call.id} className="border-t">
                      <td className="p-2">
                        <span className={call.direction === 'in' ? 'text-green-600' : 'text-blue-600'}>
                          {call.direction === 'in' ? 'Incoming' : 'Outgoing'}
                        </span>
                      </td>
                      <td className="p-2">{call.caller}</td>
                      <td className="p-2">{call.recipient}</td>
                      <td className="p-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            call.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : call.status === 'missed'
                              ? 'bg-red-100 text-red-800'
                              : call.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {call.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => getCallDetails(call.id)}
                          className="text-blue-500 hover:underline"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4">
            <button
              onClick={fetchCallHistory}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Call Details Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">Call Details</h3>
            
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Call Information</h4>
                <p><strong>ID:</strong> {selectedCall.id}</p>
                <p><strong>Direction:</strong> {selectedCall.direction === 'in' ? 'Incoming' : 'Outgoing'}</p>
                <p><strong>From:</strong> {selectedCall.caller}</p>
                <p><strong>To:</strong> {selectedCall.recipient}</p>
                <p><strong>Status:</strong> {selectedCall.status}</p>
                <p><strong>Time:</strong> {new Date(selectedCall.timestamp).toLocaleString()}</p>
                {selectedCall.duration !== undefined && (
                  <p><strong>Duration:</strong> {selectedCall.duration} seconds</p>
                )}
                {selectedCall.ticket_id && (
                  <p><strong>Ticket ID:</strong> {selectedCall.ticket_id}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                {selectedCustomer ? (
                  <>
                    <p><strong>Name:</strong> {selectedCustomer.firstname} {selectedCustomer.lastname}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                    <p><strong>ID:</strong> {selectedCustomer.id}</p>
                  </>
                ) : (
                  <p>No customer information found</p>
                )}
              </div>
            </div>
            
            {selectedCall.recording && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Recording</h4>
                <audio controls src={selectedCall.recording} className="w-full" />
              </div>
            )}
            
            <div className="flex justify-between">
              <div>
                {selectedCustomer && !selectedCall.ticket_id && !showTicketForm && (
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                  >
                    Create Ticket
                  </button>
                )}
              </div>
              
              <button
                onClick={() => {
                  setSelectedCall(null);
                  setSelectedCustomer(null);
                  setShowTicketForm(false);
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
            
            {/* Ticket Creation Form */}
            {showTicketForm && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-semibold mb-2">Create Support Ticket</h4>
                <form onSubmit={createTicket}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="Enter ticket title"
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      placeholder="Enter call notes"
                      rows={4}
                      value={ticketForm.note}
                      onChange={(e) => setTicketForm({ ...ticketForm, note: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTicketForm(false)}
                      className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      Create Ticket
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}