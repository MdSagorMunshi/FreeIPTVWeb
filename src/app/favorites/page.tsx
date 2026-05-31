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
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-900/50">
            <Heart size={32} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">{t('fav.title')}</h1>
            <p className="text-zinc-400">{t('fav.subtitle')}</p>
          </div>
        </div>

        <div className="relative group w-full lg:w-[400px] xl:w-[500px]">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 md:h-6 md:w-6 text-zinc-500 group-focus-within:text-pink-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-6 py-4 md:py-5 text-base md:text-lg bg-zinc-900/50 border border-zinc-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all glass placeholder-zinc-500 text-white shadow-xl shadow-black/20"
            placeholder={t('home.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 md:py-48 text-zinc-500">
          <HeartCrack size={80} className="mb-8 opacity-20 text-pink-500" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{t('fav.noFavs')}</h2>
          <p className="text-lg md:text-xl text-zinc-400">{t('fav.clickHeart')}</p>
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
                  className={`relative group rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-pink-900/40 ${
                    isPlaying ? 'ring-4 ring-pink-500 shadow-2xl shadow-pink-900/50 -translate-y-2' : 'border border-white/5'
                  }`}
                  onClick={() => setCurrentChannel(channel)}
                >
                  <div className="aspect-video bg-black/40 flex items-center justify-center p-3 md:p-4 relative">
                    {channel.logo ? (
                      <img 
                        src={channel.logo} 
                        alt={channel.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InNpbHZlciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iNSAzIDE5IDEyIDUgMjEgNSAzIj48L3BvbHlnb24+PC9zdmc+' }}
                      />
                    ) : (
                      <Play className="w-12 h-12 md:w-16 md:h-16 text-zinc-700" />
                    )}
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.6)] transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                        <Play fill="currentColor" className="text-white ml-1 w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(channel);
                      }}
                      className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-xl rounded-full opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110"
                    >
                      <Heart size={20} className="fill-pink-500 text-pink-500" />
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <h3 className="font-bold text-base md:text-lg text-white truncate group-hover:text-pink-400 transition-colors">
                      {channel.name}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1 uppercase tracking-widest font-semibold truncate">
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
