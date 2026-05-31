"use client";

import { motion } from 'framer-motion';
import { Home, Globe, Info, Heart, Upload, FolderOpen, Play, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Globe, label: 'World', href: '/world' },
  { icon: Heart, label: 'Favorites', href: '/favorites' },
  { icon: FolderOpen, label: 'My Playlists', href: '/my-playlists' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: Info, label: 'About', href: '/about' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const handleUpload = () => {
    alert("Upload feature will be added in a future update!");
  };

  return (
    <>
      {/* Desktop/TV Sidebar */}
      <motion.aside
        className="hidden md:flex fixed left-0 top-0 h-screen z-50 glass border-r border-[rgba(255,255,255,0.1)] flex-col items-center py-8 transition-all duration-300 ease-in-out"
        animate={{ width: isHovered ? 260 : 88 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-center w-full mb-12 overflow-hidden px-4">
          <div className="min-w-[48px] h-12 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="FreeIPTV" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          {isHovered && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-4 font-black text-2xl text-white whitespace-nowrap tracking-wide"
            >
              Free<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">IPTV</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 w-full px-4 flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={`flex items-center px-4 py-4 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <item.icon size={26} className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-5 font-semibold text-lg whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1.5 h-10 bg-gradient-to-b from-purple-400 to-pink-500 rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

      </motion.aside>

      {/* Mobile/Tablet Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[rgba(255,255,255,0.1)] pb-safe pt-2 px-4 flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1">
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-purple-600/20 text-purple-400' : 'text-zinc-400'}`}>
                <item.icon size={24} className={isActive ? 'scale-110' : ''} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-purple-400' : 'text-zinc-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
