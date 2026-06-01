"use client";

import { motion } from "framer-motion";

export function LiveBackground() {
  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700" 
      style={{ backgroundColor: 'var(--bg-background)' }}
    >
      {/* Premium Ambient Moving Mesh Gradients */}
      <div 
        className="absolute inset-0 opacity-80 blur-[130px] mix-blend-normal transition-all duration-700"
      >
        <motion.div 
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full transition-colors duration-700"
          style={{ background: 'var(--mesh-color-1)' }}
        />
        <motion.div 
          animate={{
            x: [0, -30, 50, 0],
            y: [0, 60, -40, 0],
            scale: [1.1, 0.9, 1.2, 1.1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full transition-colors duration-700"
          style={{ background: 'var(--mesh-color-2)' }}
        />
        <motion.div 
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 40, 50, 0],
            scale: [0.9, 1.1, 1, 0.9]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 w-[45%] h-[45%] rounded-full transition-colors duration-700"
          style={{ background: 'var(--mesh-color-3)' }}
        />
      </div>

      {/* Premium Animated Dotted Pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08, backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ 
          opacity: { duration: 1.5 }, 
          backgroundPosition: { duration: 50, repeat: Infinity, ease: "linear" } 
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, var(--text-foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Matte Grain Texture Layer */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 'var(--noise-opacity)',
        }}
      />

      {/* Vignette fade overlay to give depth and smooth out the edges of the grid */}
      <div 
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, var(--bg-background) 100%)'
        }}
      />
    </div>
  );
}
