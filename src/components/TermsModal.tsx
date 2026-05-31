"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function TermsModal() {
  const { hasAcceptedTerms, setHasAcceptedTerms } = usePlayerStore();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

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
            className="w-full max-w-xl bg-surface border border-border-light rounded-[12px] overflow-hidden shadow-lg flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-background border-b border-border-light p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-[12px] flex items-center justify-center mb-4">
                <ShieldAlert size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-primary-text mb-2">{t('terms.title')}</h2>
              <p className="text-secondary-text text-sm md:text-base font-semibold">{t('terms.subtitle')}</p>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide text-secondary-text text-sm md:text-base space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-background p-4 rounded-[8px] border border-border-light text-primary-text">
                  <span className="text-primary mt-0.5">•</span>
                  <p><strong>{t('terms.desc1')}</strong></p>
                </div>
                
                <div className="flex items-start gap-3 bg-background p-4 rounded-[8px] border border-border-light text-primary-text">
                  <span className="text-primary mt-0.5">•</span>
                  <p><strong>{t('terms.desc2')}</strong></p>
                </div>
                
                <div className="flex items-start gap-3 bg-background p-4 rounded-[8px] border border-border-light text-primary-text">
                  <span className="text-primary mt-0.5">•</span>
                  <p><strong>{t('terms.desc3')}</strong></p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-border-light bg-surface flex flex-col gap-3">
              <button 
                onClick={() => setHasAcceptedTerms(true)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white font-bold text-lg rounded-[8px] transition-all shadow-md active:scale-95"
              >
                <CheckCircle2 size={24} />
                {t('terms.accept')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
