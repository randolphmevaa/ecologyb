// src/components/dashboard/DialerPanel.tsx
import { useState } from 'react';
import { PBXExtension } from '@/app/api/pbx/route';

interface DialerPanelProps {
  extensions: PBXExtension[];
  onMakeCall: (from: string, to: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function DialerPanel({ 
  extensions, 
  onMakeCall, 
  isLoading 
}: DialerPanelProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dialStatus, setDialStatus] = useState<'idle' | 'dialing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!from || !to) {
      setDialStatus('error');
      setStatusMessage('Please select an extension and enter a number to call');
      return;
    }
    
    try {
      setDialStatus('dialing');
      setStatusMessage('Initiating call...');
      
      const success = await onMakeCall(from, to);
      
      if (success) {
        setDialStatus('success');
        setStatusMessage('Call initiated successfully!');
        // Reset the form after 3 seconds
        setTimeout(() => {
          setTo('');
          setDialStatus('idle');
          setStatusMessage('');
        }, 3000);
      } else {
        setDialStatus('error');
        setStatusMessage('Failed to initiate call. Please try again.');
      }
    } catch  {
      setDialStatus('error');
      setStatusMessage('An error occurred while making the call');
    }
  };

  const handleKeypad = (digit: string) => {
    setTo(prev => prev + digit);
  };

  const clearNumber = () => {
    setTo('');
  };

  const backspace = () => {
    setTo(prev => prev.slice(0, -1));
  };

  const availableExtensions = extensions.filter(ext => ext.status !== 'offline');

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Dialer
        </h3>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
              From Extension
            </label>
            <select
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={dialStatus === 'dialing' || isLoading}
              required
            >
              <option value="">Select an extension</option>
              {availableExtensions.map((ext) => (
                <option key={ext.id} value={ext.number}>
                  {ext.name} ({ext.number})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              To Number
            </label>
            <input
              type="tel"
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              disabled={dialStatus === 'dialing'}
              required
            />
          </div>
          
          {/* Keypad */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypad(digit)}
                className="py-2 px-4 border border-gray-300 rounded-md text-center hover:bg-gray-100 focus:outline-none"
                disabled={dialStatus === 'dialing'}
              >
                {digit}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={clearNumber}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
              disabled={dialStatus === 'dialing' || !to}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={backspace}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
              disabled={dialStatus === 'dialing' || !to}
            >
              ← Backspace
            </button>
          </div>
          
          {/* Status Messages */}
          {statusMessage && (
            <div className={`mb-4 p-2 rounded-md text-sm ${
              dialStatus === 'success' 
                ? 'bg-green-100 text-green-800' 
                : dialStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {statusMessage}
            </div>
          )}
          
          <button
            type="submit"
            disabled={dialStatus === 'dialing' || isLoading || !from || !to}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              dialStatus === 'dialing' || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            {dialStatus === 'dialing' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Dialing...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}