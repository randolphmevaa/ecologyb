// app/dashboard/sales/layout.tsx
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import type { Metadata } from "next";
import ProtectedPage from "@/components/ProtectedPage";
import { GlobalIFrameProvider } from "./contexts/GlobalIFrameContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

// SEO/Metadata for Sales Dashboard
export const metadata: Metadata = {
  title: "Commercial | Ecology'B",
  description:
    "Gérez vos prospects, suivez vos ventes et optimisez vos relations clients avec le tableau de bord commercial Ecology'B.",
  openGraph: {
    title: "Commercial | Ecology'B",
    description:
      "Gérez vos prospects, suivez vos ventes et optimisez vos relations clients avec le tableau de bord commercial Ecology'B.",
    url: "https://www.your-domain.com/dashboard/sales",
    images: [
      {
        url: "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
        alt: "Ecology'B Sales Dashboard",
      },
    ],
    siteName: "Ecology'B",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial | Ecology'B",
    description:
      "Gérez vos prospects, suivez vos ventes et optimisez vos relations clients avec le tableau de bord commercial Ecology'B.",
    images: [
      "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
    ],
  },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Only allow users with the Sales role.
  const allowedRoles = ["Sales Representative / Account Executive"];

  return (
    <ProtectedPage allowedRoles={allowedRoles}>
      <GlobalIFrameProvider>
      <div className="flex">
        <Sidebar role="Sales Representative / Account Executive" />
        <main className="flex-1">{children}</main>
      </div>
      </GlobalIFrameProvider>
    </ProtectedPage>
  );
}
