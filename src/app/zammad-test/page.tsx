// src/app/zammad-test/page.tsx
import ZammadConnectionTest from '@/components/ZammadConnectionTest';

export const metadata = {
  title: 'Zammad Connection Test',
  description: 'Test your connection to Zammad PBX',
};

export default function ZammadTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Zammad PBX Connection Test
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl">
            Verify that your CRM can connect to your Zammad instance
          </p>
        </div>
        
        <ZammadConnectionTest />
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Need help? Refer to the Zammad PBX Integration Setup Guide
          </p>
        </div>
      </div>
    </div>
  );
}
