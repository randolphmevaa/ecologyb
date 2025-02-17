// app/dashboard/support/layout.tsx
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import type { Metadata } from "next";
import ProtectedPage from "@/components/ProtectedPage";

interface DashboardLayoutProps {
  children: ReactNode;
}

// SEO/Metadata for Support Dashboard
export const metadata: Metadata = {
  title: "Service Client | Ecology'B",
  description:
    "Offrez une assistance client de qualité grâce au tableau de bord dédié, gérez les tickets et suivez la satisfaction client.",
  openGraph: {
    title: "Service Client | Ecology'B",
    description:
      "Offrez une assistance client de qualité grâce au tableau de bord dédié, gérez les tickets et suivez la satisfaction client.",
    url: "https://www.your-domain.com/dashboard/support",
    images: [
      {
        url: "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
        alt: "Ecology'B Support Dashboard",
      },
    ],
    siteName: "Ecology'B",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Service Client | Ecology'B",
    description:
      "Offrez une assistance client de qualité grâce au tableau de bord dédié, gérez les tickets et suivez la satisfaction client.",
    images: [
      "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
    ],
  },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Only allow users with the Customer Support role.
  const allowedRoles = ["Customer Support / Service Representative"];

  return (
    <ProtectedPage allowedRoles={allowedRoles}>
      <div className="flex">
        <Sidebar role="Customer Support / Service Representative" />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedPage>
  );
}
