"use client";

import { Header } from "@/components/Header";

export default function PageEnConstruction() {
  return (
    <div className="flex h-screen bg-[#ffffff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main 
          className="flex-1 overflow-y-auto flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
          }}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: "#213f5b" }}>
              Page en construction
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous travaillons activement à la création d&apos;un espace de gestion commerciale performant. 
              Revenez bientôt pour découvrir des fonctionnalités innovantes de suivi de rendez-vous 
              et d&apos;analyse des performances.
            </p>
            
            <div className="mt-8 animate-pulse">
              <svg 
                className="mx-auto h-24 w-24 text-[#213f5b]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                />
              </svg>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}