import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar role="Technician / Installer" />
      <main className="flex-1">{children}</main>
    </div>
  );
}