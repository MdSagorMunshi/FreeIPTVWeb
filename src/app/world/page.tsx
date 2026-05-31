"use client";

import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

export default function World() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
        <Globe2 size={120} className="text-blue-400 mb-8 mx-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-center"
      >
        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Channels</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-zinc-400 text-lg max-w-lg text-center leading-relaxed"
      >
        Discover channels from all around the world. Our global directory features international content curated by country and language. 
        <br/><br/>
        <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold border border-blue-500/20">
          Coming Soon in v2.0
        </span>
      </motion.p>
    </div>
  );
}
