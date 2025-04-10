// src/app/call-dashboard/page.tsx
import CallDashboard from '@/components/CallDashboard';

export const metadata = {
  title: 'Call Dashboard | CRM',
  description: 'Manage and monitor your calls in real-time',
};

export default function CallDashboardPage() {
  return <CallDashboard />;
}