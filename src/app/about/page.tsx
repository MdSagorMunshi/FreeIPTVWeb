"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Info, FileText, X, Smartphone, ShieldAlert, Download } from "lucide-react";

export default function About() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  const changelogs = [
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
        className="max-w-2xl w-full glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-purple-900/50">
            <Info size={40} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-black mb-4">
            About <span className="text-gradient">FreeIPTV Web</span>
          </h1>
          
          <p className="text-lg text-zinc-300 leading-relaxed mb-8">
            FreeIPTV Web is a modern, lag-less live TV streaming application designed from the ground up for the ultimate viewing experience. 
            Built with Next.js 16, TypeScript, and Framer Motion, it brings the robustness of our Android app straight to your browser with an unparalleled aesthetic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col items-center">
              <h3 className="font-bold text-white mb-1">Version</h3>
              <p className="text-purple-400 font-mono">1.3.0-web</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col items-center">
              <h3 className="font-bold text-white mb-1">Engine</h3>
              <p className="text-pink-400 font-mono">HLS.js Core</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <button 
              onClick={() => setIsChangelogOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-bold border border-purple-500/30 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <FileText size={20} />
              Changelogs
            </button>
            <a href="http://github.com/MdSagorMunshi/FreeIPTVWeb" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors" title="FOSS Repository">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="mailto:ryn@disr.it" className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors" title="Email Support">
              <Mail size={24} className="text-white" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Mobile App Advertisement Box */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl w-full mt-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-blue-900/20"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-16 h-16 shrink-0 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <Smartphone size={32} className="text-blue-400" />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-black text-white mb-2">Try Our Mobile App!</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/20">Free Forever</span>
              <span className="px-2.5 py-1 bg-pink-500/20 text-pink-400 text-xs font-bold rounded-lg border border-pink-500/20">No Ads</span>
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/20">Open Source</span>
            </div>
            
            <p className="text-zinc-400 text-sm mb-4">
              Take your live TV anywhere with the official FreeIPTV Android App.
            </p>

            <div className="flex items-start gap-2 mb-5 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300 text-left">
                <strong className="text-red-400">Security Notice:</strong> Please only download the app from our official GitHub Releases to avoid malicious or unofficial APKs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="https://github.com/MdSagorMunshi/FreeIPTV/releases" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub Releases
              </a>
              <a 
                href="https://freeiptvapp.pages.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
              >
                <Download size={18} /> Official Website
              </a>
            </div>
          </div>
        </div>
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
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <FileText size={24} className="text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Changelogs</h2>
                </div>
                <button 
                  onClick={() => setIsChangelogOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable List */}
              <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
                {changelogs.map((log, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-zinc-800">
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[1.5px] top-1.5 ring-4 ring-zinc-900" />
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{log.version}</h3>
                      <span className="text-sm font-semibold text-zinc-500">{log.date}</span>
                    </div>
                    <ul className="space-y-2">
                      {log.changes.map((change, i) => (
                        <li key={i} className="text-zinc-300 text-sm md:text-base flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {/* Footer Gradient */}
              <div className="p-4 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent border-t border-white/5 text-center">
                <p className="text-zinc-500 text-sm">Thank you for using FreeIPTV Web!</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
