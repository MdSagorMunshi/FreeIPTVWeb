"use client";

import { motion } from "framer-motion";

export function LoadingIndicator({ theme = 'purple' }: { theme?: 'purple' | 'blue' }) {
  const gradient = theme === 'purple' 
    ? 'from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]'
    : 'from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]';

  return (
    <div className="flex gap-2 justify-center items-center h-16">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-2 md:w-3 bg-gradient-to-t rounded-full ${gradient}`}
          animate={{
            height: ["16px", "48px", "16px"],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
}
