// src/app/dashboard/page.tsx
import PBXIntegration from '@/components/PBXIntegration';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>
      <PBXIntegration />
    </div>
  );
}
