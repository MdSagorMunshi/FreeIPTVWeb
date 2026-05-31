"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Info } from "lucide-react";

export default function About() {
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
              <p className="text-purple-400 font-mono">1.0.0-web</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col items-center">
              <h3 className="font-bold text-white mb-1">Engine</h3>
              <p className="text-pink-400 font-mono">HLS.js Core</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="http://github.com/MdSagorMunshi/FreeIPTVWeb" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="mailto:ryn@disr.it" className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <Mail size={24} className="text-white" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
