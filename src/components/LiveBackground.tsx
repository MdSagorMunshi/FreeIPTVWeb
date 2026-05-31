"use client";

import { motion } from "framer-motion";

export function LiveBackground() {
  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500" 
      style={{ backgroundColor: 'var(--bg-background)' }}
    >
      {/* Premium Animated Dotted Pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12, backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ 
          opacity: { duration: 1.5 }, 
          backgroundPosition: { duration: 40, repeat: Infinity, ease: "linear" } 
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, var(--text-foreground) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Vignette fade overlay to give depth and smooth out the edges of the grid */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, var(--bg-background) 100%)'
        }}
      />
    </div>
  );
}
