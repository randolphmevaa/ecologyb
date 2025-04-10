// src/components/dashboard/CallDetailsModal.tsx
import { useState } from 'react';
import { PBXCall, ZammadUser } from '@/app/api/pbx/route';

interface CallDetailsModalProps {
  call: PBXCall;
  customer: ZammadUser | null;
  onClose: () => void;
  onCreateTicket: (callId: string, customerId: string, title: string, note: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function CallDetailsModal({
  call,
  customer,
  onClose,
  onCreateTicket,
  isLoading,
}: CallDetailsModalProps) {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    title: `Call with ${call.direction === 'in' ? call.caller : call.recipient}`,
    note: '',
  });
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [ticketError, setTicketError] = useState('');

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) {
      setTicketStatus('error');
      setTicketError('Cannot create ticket without customer information');
      return;
    }
    
    try {
      setTicketStatus('submitting');
      
      const success = await onCreateTicket(
        call.id, 
        customer.id.toString(), 
        ticketForm.title, 
        ticketForm.note
      );
      
      if (success) {
        setTicketStatus('success');
        setShowTicketForm(false);
      } else {
        setTicketStatus('error');
        setTicketError('Failed to create ticket. Please try again.');
      }
    } catch  {
      setTicketStatus('error');
      setTicketError('An unexpected error occurred');
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Call Details
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Call Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Call Information
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Call ID:</span>
                  <p className="mt-1 text-sm text-gray-900">{call.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Direction:</span>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      call.direction === 'in' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {call.direction === 'in' ? 'Incoming' : 'Outgoing'}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">From:</span>
                  <p className="mt-1 text-sm text-gray-900">{call.caller}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">To:</span>
                  <p className="mt-1 text-sm text-gray-900">{call.recipient}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Time:</span>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(call.timestamp)}</p>
                </div>
                {call.duration !== undefined && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                    <p className="mt-1 text-sm text-gray-900">{formatDuration(call.duration)}</p>
                  </div>
                )}
                {call.ticket_id && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Ticket:</span>
                    <p className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        #{call.ticket_id}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Customer Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Customer Information
              </h4>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : customer ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="mt-1 text-sm text-gray-900">{customer.firstname} {customer.lastname}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="mt-1 text-sm text-gray-900">{customer.email}</p>
                  </div>
                  {customer.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <p className="mt-1 text-sm text-gray-900">{customer.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Customer ID:</span>
                    <p className="mt-1 text-sm text-gray-900">{customer.id}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">No customer information found</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Could not find a customer associated with this phone number.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Call Recording */}
          {call.recording && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Call Recording
              </h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <audio controls className="w-full" src={call.recording} />
              </div>
            </div>
          )}
          
          {/* Create Ticket Form */}
          {showTicketForm ? (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Create Support Ticket
              </h4>
              <form onSubmit={handleCreateTicket}>
                {ticketStatus === 'error' && (
                  <div className="mb-4 bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{ticketError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="note"
                      rows={4}
                      value={ticketForm.note}
                      onChange={(e) => setTicketForm({ ...ticketForm, note: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ticketStatus === 'submitting' || !customer}
                    className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
                  >
                    {ticketStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Actions
            <div className="mt-6 flex justify-end space-x-3">
              {/* Only show create ticket button if there's a customer and no ticket yet */}
              {customer && !call.ticket_id && (
                <button
                  type="button"
                  onClick={() => setShowTicketForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Create Ticket
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
