"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Search, HeartCrack } from "lucide-react";
import { Player } from "@/components/Player";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useState } from "react";

export default function Favorites() {
  const { 
    favorites, currentChannel, setCurrentChannel, toggleFavorite
  } = usePlayerStore();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = favorites.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-10 pb-32 md:pb-12">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-[12px] flex items-center justify-center shadow-sm">
            <Heart size={32} className="text-primary fill-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-primary-text">{t('fav.title')}</h1>
            <p className="text-secondary-text">{t('fav.subtitle')}</p>
          </div>
        </div>

        <div className="relative group w-full lg:w-[400px] xl:w-[500px]">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 md:h-6 md:w-6 text-muted-text group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-6 py-4 md:py-5 text-base md:text-lg bg-surface border border-border-light rounded-[999px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-muted-text text-primary-text shadow-sm"
            placeholder={t('home.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 md:py-48 text-secondary-text">
          <HeartCrack size={80} className="mb-8 opacity-20 text-accent" />
          <h2 className="text-3xl md:text-4xl font-black text-primary-text mb-3">{t('fav.noFavs')}</h2>
          <p className="text-lg md:text-xl text-secondary-text">{t('fav.clickHeart')}</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 [media(min-width:2000px)]:grid-cols-8 gap-4 sm:gap-6 md:gap-8">
          <AnimatePresence>
            {filteredChannels.map((channel, idx) => {
              const isPlaying = currentChannel?.id === channel.id;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.2) }}
                  key={channel.id}
                  className={`relative group rounded-[12px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    isPlaying ? 'ring-2 ring-primary shadow-md -translate-y-1 bg-surface' : 'border border-border-light bg-surface'
                  }`}
                  onClick={() => setCurrentChannel(channel)}
                >
                  <div className="aspect-video bg-background flex items-center justify-center p-3 md:p-4 relative">
                    {channel.logo ? (
                      <img 
                        src={channel.logo} 
                        alt={channel.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InNpbHZlciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iNSAzIDE5IDEyIDUgMjEgNSAzIj48L3BvbHlnb24+PC9zdmc+' }}
                      />
                    ) : (
                      <Play className="w-12 h-12 md:w-16 md:h-16 text-muted-text" />
                    )}
                    
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                        <Play fill="currentColor" className="text-white ml-1 w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(channel);
                      }}
                      className="absolute top-4 right-4 p-2 bg-surface border border-border-light rounded-full opacity-100 transition-all duration-300 hover:bg-border-light hover:scale-110"
                    >
                      <Heart size={16} className="fill-accent text-accent" />
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-6 bg-surface border-t border-border-light">
                    <h3 className="font-bold text-base md:text-lg text-primary-text truncate group-hover:text-primary transition-colors">
                      {channel.name}
                    </h3>
                    <p className="text-xs md:text-sm text-secondary-text mt-1 uppercase tracking-widest font-semibold truncate">
                      {channel.group}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
      <Player />
    </div>
  );
}
