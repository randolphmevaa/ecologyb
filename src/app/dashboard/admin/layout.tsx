import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import type { Metadata } from "next";
import { GlobalIFrameProvider } from "@/contexts/GlobalIFrameContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

// SEO/Metadata for Admin Dashboard
export const metadata: Metadata = {
  title: "Administration | Ecology'B",
  description:
    "Accédez à la console d’administration pour configurer et gérer l’ensemble de la plateforme Ecology’B.",
  openGraph: {
    title: "Administration | Ecology'B",
    description:
      "Accédez à la console d’administration pour configurer et gérer l’ensemble de la plateforme Ecology’B.",
    url: "https://www.your-domain.com/dashboard/admin", // Update to your actual admin dashboard URL
    images: [
      {
        url: "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
        alt: "Ecology'B Admin Dashboard",
      },
    ],
    siteName: "Ecology'B",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Administration | Ecology'B",
    description:
      "Accédez à la console d’administration pour configurer et gérer l’ensemble de la plateforme Ecology’B.",
    images: [
      "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
    ],
  },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Define the allowed roles for accessing the admin layout
  const allowedRolesForAdmin = ["Admin", "Super Admin"];

  return (
    <ProtectedPage allowedRoles={allowedRolesForAdmin}>
      <GlobalIFrameProvider>
        <div className="flex">
          {/* The Admin role is passed to the Sidebar */}
          <Sidebar role="admin" />
          <main className="flex-1">{children}</main>
        </div>
      </GlobalIFrameProvider>
    </ProtectedPage>
  );
}
