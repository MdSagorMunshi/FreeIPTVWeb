"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { TermsModal } from "./TermsModal";
import { Sidebar } from "./Sidebar";
import { LiveBackground } from "./LiveBackground";
import { Footer } from "./Footer";
import { ReactNode, useEffect, useState } from "react";

export function AppGate({ children }: { children: ReactNode }) {
  const { hasAcceptedTerms } = usePlayerStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  // HARD BLOCK: If not accepted, do not mount the application into the DOM at all.
  // Deleting the modal in DevTools will just result in a blank page.
  if (!hasAcceptedTerms) {
    return (
      <main className="flex-1 h-full w-full relative">
        <LiveBackground />
        <TermsModal />
      </main>
    );
  }

  // ALLOW ACCESS
  return (
    <div className="flex h-screen w-full relative">
      <Sidebar />
      <main className="flex-1 md:ml-[88px] h-full overflow-y-auto overflow-x-hidden relative pb-20 md:pb-0 scroll-smooth">
        <LiveBackground />
        <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-24 w-full min-h-full max-w-[2400px] mx-auto flex flex-col justify-between">
          <div className="flex-1 w-full">
            {children}
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
