import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import type { Metadata } from "next";

interface DashboardLayoutProps {
  children: ReactNode;
}

// SEO/Metadata for Project / Installation Manager Dashboard
export const metadata: Metadata = {
  title: "Chef de Projet | Ecology'B",
  description:
    "Gérez vos projets et installations sur la plateforme Ecology’B. Suivez le planning, assignez les techniciens et optimisez le workflow.",
  openGraph: {
    title: "Chef de Projet | Ecology'B",
    description:
      "Gérez vos projets et installations sur la plateforme Ecology’B. Suivez le planning, assignez les techniciens et optimisez le workflow.",
    url: "https://www.your-domain.com/dashboard/pm",
    images: [
      {
        url: "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
        alt: "Ecology'B Project Manager Dashboard",
      },
    ],
    siteName: "Ecology'B",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chef de Projet | Ecology'B",
    description:
      "Gérez vos projets et installations sur la plateforme Ecology’B. Suivez le planning, assignez les techniciens et optimisez le workflow.",
    images: [
      "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
    ],
  },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar role="Project / Installation Manager" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
