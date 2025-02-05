import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar role="Client / Customer (Client Portal)" />
      <main className="flex-1">{children}</main>
    </div>
  );
}