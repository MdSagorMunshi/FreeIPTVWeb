"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Info, FileText, X, Smartphone, ShieldAlert, Download, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function About() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const { t } = useTranslation();

  const changelogs = [
    {
      version: "v1.6.0",
      date: "June 01, 2026",
      changes: [
        "Advanced Matte & Frosted Glassmorphism visual overhaul and structural improvements.",
        "Introduced low-CPU moving mesh gradients with custom sand grain tactile overlay.",
        "Implemented interactive YouTube-style sub-menus in the video player Settings panel.",
        "Added Playback Speed Controls (0.5x - 2.0x) and Adaptive Aspect Ratio adjustments (Fit, Stretch, Zoom).",
        "Added automatic landscape lock (auto-rotate fullscreen) for mobile/tablet screens.",
        "Added mouse double-click and mobile double-tap gestures to quickly toggle fullscreen.",
        "Added global keyboard 'F' / 'f' key shortcut for fullscreen toggle.",
        "Fixed mobile volume bugs (stuck auto-hide overlay timer and touch click-propagation locks).",
        "Added native Picture-in-Picture (PiP) support with a direct control bar toggle shortcut.",
        "Redesigned the stream error popup into a dark matte console recommending secure free VPN options (Proton VPN, Warp, Psiphon, Riseup) with active links and branding logos."
      ]
    },
    {
      version: "v1.5.0",
      date: "June 01, 2026",
      changes: [
        "Transformed UI to a professional 'Modern Warm Minimalism' design system.",
        "Implemented multi-column footer with extensive navigation.",
        "Added dedicated Privacy Policy, Terms of Service, and FAQ pages.",
        "Removed neon gradients in favor of clean, structured surfaces.",
        "Optimized layout consistency and introduced 'End of channels' indicators."
      ]
    },
    {
      version: "v1.4.0",
      date: "May 31, 2026",
      changes: [
        "Added global Multi-Language Support (Bengali, Spanish, Russian, Arabic, Hindi, Japanese, Chinese).",
        "Added persistent Legal Terms of Service security gate.",
        "Volume level and mute state now perfectly persist across page reloads for all engines.",
        "Refined custom offline playlists grid rendering and UI syntax.",
        "Updated logo rendering inside the settings and UI."
      ]
    },
    {
      version: "v1.3.0",
      date: "May 2026",
      changes: [
        "Major Feature: Upload custom .m3u playlists with local IndexedDB offline caching",
        "Added Settings Dashboard for advanced application control",
        "Multi-Engine Video Support: switch between HLS.js, Video.js, and ReactPlayer",
        "Redesigned the application background with an aesthetic live dot-matrix grid",
        "Added Pure OLED theme support for true-black infinite contrast"
      ]
    },
    {
      version: "v1.2.0",
      date: "May 2026",
      changes: [
        "Overhauled mini-player: draggable picture-in-picture, volume slider, and functional stream quality controls",
        "Introduced smooth infinite scrolling with 800ms natural lazy-loading",
        "Redesigned all loading spinners into custom animated TV-signal equalizers",
        "Added intelligent category counters and dynamic search totals across all pages",
        "Imported official FreeIPTV branding and custom favicons"
      ]
    },
    {
      version: "v1.1.0",
      date: "May 2026",
      changes: [
        "Added World (Global Channels) feature with 18,000+ channels",
        "Implemented smart stream loading with automatic VPN recommendation popup",
        "Completely overhauled UI for fluid responsiveness across all devices",
        "Intelligent category normalization and filtering"
      ]
    },
    {
      version: "v1.0.0",
      date: "May 2026",
      changes: [
        "Initial Web Release",
        "Built custom premium glassmorphic UI using Framer Motion",
        "Integrated high-performance HLS.js custom video player",
        "Favorites system and global state management"
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[80vh] py-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-surface rounded-[12px] p-8 md:p-12 relative overflow-hidden shadow-sm border border-border-light"
      >
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-[12px] flex items-center justify-center shadow-sm">
              <Info size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-primary-text">{t('about.title')}</h1>
              <p className="text-secondary-text">{t('about.subtitle')}</p>
            </div>
          </div>

          <section className="bg-background rounded-[12px] p-6 md:p-8 border border-border-light mb-6 relative overflow-hidden w-full shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <img src="/logo.png" alt="FreeIPTV" className="w-16 h-16 rounded-[12px] shadow-sm border border-border-light" />
                <div>
                  <h2 className="text-2xl font-bold text-primary-text">FreeIPTV Web</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-2 py-1 bg-surface text-primary-text border border-border-light rounded-md">{t('about.version')} 1.6.0</span>
                    <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md">{t('about.engine')} HLS Core</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsChangelogOpen(true)}
                className="px-4 py-2 bg-surface hover:bg-background text-primary-text rounded-[8px] border border-border-light transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm cursor-pointer z-20"
              >
                <FileText size={16} />
                {t('about.changelogs')}
              </button>
            </div> 
            <p className="text-left text-secondary-text leading-relaxed relative z-10">
              FreeIPTV Web is a modern, lag-less live TV streaming application designed from the ground up for the ultimate viewing experience. 
              Built with Next.js 16, TypeScript, and Framer Motion, it brings the robustness of our Android app straight to your browser with an unparalleled aesthetic.
            </p>
          </section>

          <div className="flex flex-wrap justify-center items-center gap-4 relative z-10">
            <a href="http://github.com/MdSagorMunshi/FreeIPTVWeb" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-surface hover:bg-background border border-border-light transition-colors text-primary-text" title="FOSS Repository">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-text"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="mailto:ryn@disr.it" className="p-3 rounded-full bg-surface hover:bg-background border border-border-light transition-colors text-primary-text" title="Email Support">
              <Mail size={24} className="text-primary-text" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Mobile App Advertisement Box */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl w-full mt-6"
      >
        <section className="relative w-full rounded-[12px] overflow-hidden border border-border-light bg-surface p-6 md:p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <Smartphone className="text-primary" size={28} />
                <h2 className="text-2xl md:text-3xl font-black text-primary-text">{t('about.tryMobile')}</h2>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                <span className="px-3 py-1 bg-background text-secondary-text border border-border-light rounded-[8px] text-xs font-bold uppercase tracking-wider">{t('about.free')}</span>
                <span className="px-3 py-1 bg-background text-secondary-text border border-border-light rounded-[8px] text-xs font-bold uppercase tracking-wider">{t('about.noAds')}</span>
                <span className="px-3 py-1 bg-background text-secondary-text border border-border-light rounded-[8px] text-xs font-bold uppercase tracking-wider">{t('about.openSource')}</span>
              </div>

              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-[12px] p-4 mb-6">
                <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-600 text-left dark:text-red-300">
                  <strong className="text-red-700 dark:text-red-400">{t('about.security')}</strong> {t('about.securityDesc')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://github.com/MdSagorMunshi/FreeIPTV/releases" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-background text-primary-text font-bold rounded-[8px] border border-border-light hover:bg-surface active:scale-95 transition-all shadow-sm"
                >
                  <Download size={18} />
                  {t('about.github')}
                </a>
                <a 
                  href="https://freeiptvapp.pages.dev/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-[8px] active:scale-95 transition-all shadow-sm"
                >
                  <Globe size={18} />
                  {t('about.website')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Changelog Modal */}
      <AnimatePresence>
        {isChangelogOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsChangelogOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface border border-border-light rounded-[12px] shadow-lg overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-light bg-background">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-[8px]">
                    <FileText size={24} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-text">Changelogs</h2>
                </div>
                <button 
                  onClick={() => setIsChangelogOpen(false)}
                  className="p-2 bg-surface hover:bg-background rounded-full text-muted-text hover:text-primary-text border border-border-light transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable List */}
              <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
                {changelogs.map((log, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-border-light">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[1.5px] top-1.5 ring-4 ring-surface" />
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="text-xl font-bold text-primary-text">{log.version}</h3>
                      <span className="text-sm font-semibold text-muted-text">{log.date}</span>
                    </div>
                    <ul className="space-y-2">
                      {log.changes.map((change, i) => (
                        <li key={i} className="text-secondary-text text-sm md:text-base flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {/* Footer Gradient */}
              <div className="p-4 bg-background border-t border-border-light text-center">
                <p className="text-secondary-text text-sm">Thank you for using FreeIPTV Web!</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
