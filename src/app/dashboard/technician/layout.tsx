import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import type { Metadata } from "next";

interface DashboardLayoutProps {
  children: ReactNode;
}

// SEO/Metadata for Technician Dashboard
export const metadata: Metadata = {
  title: "Technicien | Ecology'B",
  description:
    "Accédez à votre tableau de bord technique pour planifier les interventions, gérer les installations et optimiser le service sur site.",
  openGraph: {
    title: "Technicien | Ecology'B",
    description:
      "Accédez à votre tableau de bord technique pour planifier les interventions, gérer les installations et optimiser le service sur site.",
    url: "https://www.your-domain.com/dashboard/technician",
    images: [
      {
        url: "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
        alt: "Ecology'B Technician Dashboard",
      },
    ],
    siteName: "Ecology'B",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technicien | Ecology'B",
    description:
      "Accédez à votre tableau de bord technique pour planifier les interventions, gérer les installations et optimiser le service sur site.",
    images: [
      "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
    ],
  },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar role="Technician / Installer" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
