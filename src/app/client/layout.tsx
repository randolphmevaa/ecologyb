import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import type { Metadata } from "next";

interface DashboardLayoutProps {
  children: ReactNode;
}

// SEO/Metadata for Client Portal
export const metadata: Metadata = {
  title: "Espace Client | Ecology'B",
  description:
    "Accédez à votre espace client pour consulter vos factures, suivre vos projets et communiquer avec l’équipe Ecology'B.",
  openGraph: {
    title: "Espace Client | Ecology'B",
    description:
      "Accédez à votre espace client pour consulter vos factures, suivre vos projets et communiquer avec l’équipe Ecology'B.",
    url: "https://www.your-domain.com/client/dashboard",
    images: [
      {
        url: "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
        alt: "Ecology'B Client Portal",
      },
    ],
    siteName: "Ecology'B",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Espace Client | Ecology'B",
    description:
      "Accédez à votre espace client pour consulter vos factures, suivre vos projets et communiquer avec l’équipe Ecology'B.",
    images: [
      "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
    ],
  },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar role="Client / Customer (Client Portal)" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
