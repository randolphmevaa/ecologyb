"use client";

import React from "react";
import { Header } from "@/components/Header";

export default function FidealisPage() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
      <Header />
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 w-full">
          <iframe 
            src="/api/proxy-fidealis"
            className="w-full h-full border-none"
            title="Fidealis Website"
            sandbox="allow-same-origin allow-scripts allow-forms"
            loading="lazy"
          />
        </div>
      </main>
    </div>
  );
}
