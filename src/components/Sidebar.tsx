"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Home, Globe, Info, Heart, FolderOpen, Settings } from 'lucide-react';
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

  return (
    <>
      {/* Desktop/TV Matte Sidebar */}
      <motion.aside
        className="hidden md:flex fixed left-0 top-0 h-screen z-50 bg-surface/75 dark:bg-surface/65 backdrop-blur-3xl border-r border-border-light flex-col items-center py-8 transition-all duration-300 ease-in-out shadow-[10px_0_40px_rgba(0,0,0,0.02)]"
        animate={{ width: isHovered ? 260 : 88 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo / Brand Header */}
        <div className="flex items-center justify-center w-full mb-12 overflow-hidden px-4">
          <div className="min-w-[48px] h-12 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="FreeIPTV" className="w-9 h-9 object-contain drop-shadow-[0_2px_8px_rgba(99,102,241,0.3)]" />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="ml-4 font-black text-2xl tracking-tight whitespace-nowrap text-primary-text"
              >
                Free<span className="text-primary">IPTV</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Deck */}
        <nav className="flex-1 w-full px-4 flex flex-col gap-2 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} className="relative block">
                <div
                  className={`flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-visible ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-secondary-text hover:text-primary-text'
                  }`}
                >
                  {/* Sliding Active Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-primary/8 dark:bg-primary/12 border border-primary/15 rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.06)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <item.icon 
                    size={22} 
                    className={`shrink-0 z-10 transition-transform duration-300 ${
                      isActive ? 'scale-110 text-primary' : 'group-hover:scale-110 group-hover:text-primary-text'
                    }`} 
                  />
                  
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="ml-4 font-bold text-base whitespace-nowrap z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {/* Active Border Glow Strip */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavStrip"
                      className="absolute left-[-4px] w-1 h-6 bg-primary rounded-r-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Mobile/Tablet Floating Matte Bottom Nav Capsule */}
      <nav className="md:hidden fixed bottom-5 left-4 right-4 z-50 bg-surface/80 dark:bg-surface/70 backdrop-blur-2xl border border-border-light rounded-2xl flex justify-around items-center h-16 shadow-[0_16px_40px_rgba(0,0,0,0.1)] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className="flex-1 flex flex-col items-center justify-center relative py-1">
              {isActive && (
                <motion.div
                  layoutId="activeNavBackgroundMobile"
                  className="absolute inset-x-1.5 inset-y-1 bg-primary/8 dark:bg-primary/12 border border-primary/15 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className={`p-1.5 rounded-lg z-10 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-secondary-text hover:text-primary-text'}`}>
                <item.icon size={20} />
              </div>
              <span className={`text-[9px] font-bold tracking-wide z-10 ${isActive ? 'text-primary font-extrabold' : 'text-muted-text'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
