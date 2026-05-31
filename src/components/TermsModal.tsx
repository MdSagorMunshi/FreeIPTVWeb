"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export function TermsModal() {
  const { hasAcceptedTerms, setHasAcceptedTerms } = usePlayerStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by ensuring it only renders after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!hasAcceptedTerms && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-purple-600/10 border-b border-purple-500/20 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/30">
                <ShieldAlert size={32} className="text-purple-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Legal Disclaimer</h2>
              <p className="text-purple-300 text-sm md:text-base font-semibold">Please read carefully before using FreeIPTV Web</p>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide text-zinc-300 text-sm md:text-base space-y-4">
              <p>
                By accessing and using FreeIPTV Web, you agree to the following terms and conditions:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <p><strong>No Content Hosting:</strong> FreeIPTV Web is strictly a media player interface. We do not host, broadcast, or distribute any video streams, movies, or copyrighted content on our servers.</p>
                </div>
                
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <p><strong>User Responsibility:</strong> Any M3U playlists or stream links loaded into this application are the sole responsibility of the user. We are not responsible for the contents of user-uploaded playlists.</p>
                </div>
                
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <p><strong>Local Data:</strong> We do not collect or transmit your personal data or playlist contents to remote servers. All data is stored locally in your browser's offline cache.</p>
                </div>
              </div>

              <p className="text-zinc-500 text-xs italic mt-4 text-center">
                You must accept these terms to continue using the application.
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col gap-3">
              <button 
                onClick={() => setHasAcceptedTerms(true)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
              >
                <CheckCircle2 size={24} />
                I Understand & Accept
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
