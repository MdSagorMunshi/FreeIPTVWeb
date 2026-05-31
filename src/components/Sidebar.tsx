"use client";

import { motion } from 'framer-motion';
import { Home, Globe, Info, Settings, Heart, Upload, Play } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Globe, label: 'World', href: '/world' },
  { icon: Heart, label: 'Favorites', href: '/favorites' },
  { icon: Info, label: 'About', href: '/about' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const handleUpload = () => {
    alert("Upload feature will be added in a future update!");
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen z-50 glass border-r border-[rgba(255,255,255,0.1)] flex flex-col items-center py-8 transition-all duration-300 ease-in-out"
      animate={{ width: isHovered ? 240 : 80 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center w-full mb-12 overflow-hidden px-4">
        <div className="min-w-[40px] h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shrink-0">
          <Play fill="white" size={20} className="ml-1" />
        </div>
        {isHovered && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-3 font-bold text-xl text-white whitespace-nowrap tracking-wide"
          >
            Free<span className="text-purple-400">IPTV</span>
          </motion.span>
        )}
      </div>

      <nav className="flex-1 w-full px-3 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href}>
              <div
                className={`flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                  isActive 
                    ? 'bg-purple-600/20 text-purple-400' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={24} className="shrink-0" />
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-4 font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="w-full px-3 pb-4">
        <div
          onClick={handleUpload}
          className="flex items-center px-3 py-3 rounded-xl cursor-pointer text-zinc-400 hover:bg-white/5 hover:text-white transition-all group"
        >
          <Upload size={24} className="shrink-0 group-hover:text-pink-400 transition-colors" />
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-4 font-medium whitespace-nowrap group-hover:text-pink-400 transition-colors"
            >
              Upload Playlist
            </motion.span>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
