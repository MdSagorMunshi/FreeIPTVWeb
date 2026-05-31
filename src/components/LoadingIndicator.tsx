"use client";

import { motion } from "framer-motion";

export function LoadingIndicator({ theme = 'primary' }: { theme?: 'primary' | 'accent' }) {
  const bgColor = theme === 'primary' 
    ? 'bg-primary'
    : 'bg-accent';

  return (
    <div className="flex gap-2 justify-center items-center h-16">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-2 md:w-3 rounded-[999px] ${bgColor}`}
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
