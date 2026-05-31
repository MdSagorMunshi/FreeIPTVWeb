"use client";

import { motion } from 'framer-motion';
import { Home, Globe, Info, Heart, Upload, FolderOpen, Play, Settings, Tv, FolderHeart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

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
        className="hidden md:flex fixed left-0 top-0 h-screen z-50 bg-surface border-r border-border-light flex-col items-center py-8 transition-all duration-300 ease-in-out shadow-sm"
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
              className="ml-4 font-black text-2xl text-primary-text whitespace-nowrap tracking-wide"
            >
              Free<span className="text-primary">IPTV</span>
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
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-secondary-text hover:bg-border-light hover:text-primary-text border border-transparent'
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
                      className="absolute left-0 w-1.5 h-10 bg-primary rounded-r-[999px]"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

      </motion.aside>

      {/* Mobile/Tablet Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border-light pb-safe pt-2 px-4 flex justify-around items-center h-20 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1">
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary' : 'text-secondary-text'}`}>
                <item.icon size={24} className={isActive ? 'scale-110' : ''} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-text'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
