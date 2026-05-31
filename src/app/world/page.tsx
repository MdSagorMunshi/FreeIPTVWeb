"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { parseM3U } from "@/lib/m3uParser";
import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Search, Globe, ChevronDown } from "lucide-react";
import { Player } from "@/components/Player";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LoadingIndicator } from "@/components/LoadingIndicator";

export default function World() {
  const { 
    worldPlaylist, setWorldPlaylist, currentChannel, setCurrentChannel, 
    worldSelectedGroup, setWorldSelectedGroup, worldSearchQuery, setWorldSearchQuery,
    favorites, toggleFavorite
  } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(60);
  const observer = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);

  const observerTarget = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    if (node) {
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !fetchingRef.current) {
          fetchingRef.current = true;
          setTimeout(() => {
            setVisibleCount(prev => prev + 60);
            fetchingRef.current = false;
          }, 800);
        }
      }, { threshold: 0.1 });
      observer.current.observe(node);
    }
  }, []);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const response = await fetch('/world-wide.m3u');
        const text = await response.text();
        const parsed = parseM3U(text);
        setWorldPlaylist(parsed);
      } catch (error) {
        console.error("Failed to load world playlist", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!worldPlaylist) {
      loadPlaylist();
    } else {
      setIsLoading(false);
    }
  }, [worldPlaylist, setWorldPlaylist]);

  const filteredChannels = useMemo(() => {
    if (!worldPlaylist) return [];
    return worldPlaylist.channels.filter(channel => {
      const matchesGroup = worldSelectedGroup === 'All' || channel.group === worldSelectedGroup;
      const matchesSearch = channel.name.toLowerCase().includes(worldSearchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [worldPlaylist, worldSelectedGroup, worldSearchQuery]);

  const groupCounts = useMemo(() => {
    if (!worldPlaylist) return { 'All': 0 };
    return worldPlaylist.channels.reduce((acc, channel) => {
      acc[channel.group] = (acc[channel.group] || 0) + 1;
      acc['All'] = (acc['All'] || 0) + 1;
      return acc;
    }, { 'All': 0 } as Record<string, number>);
  }, [worldPlaylist]);

  const displayedChannels = filteredChannels.slice(0, visibleCount);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(60);
  }, [worldSelectedGroup, worldSearchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingIndicator theme="blue" />
        <p className="mt-8 text-zinc-400 font-bold tracking-[0.2em] uppercase text-sm md:text-base">Loading Global Database...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-10 pb-32 md:pb-12">
      {/* Header Area */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-2 sm:mb-4 tracking-tight flex items-center gap-4">
            <Globe className="text-blue-500 hidden sm:block" size={48} />
            {t('world.title')}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
            {t('world.subtitle')}
          </p>
        </div>

        <div className="relative group w-full lg:w-[400px] xl:w-[500px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-400 transition-colors" size={20} />
          <input
            type="text"
            className="w-full pl-12 pr-6 py-4 md:py-5 text-base md:text-lg bg-zinc-900/50 border border-zinc-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all glass placeholder-zinc-500 text-white shadow-xl shadow-black/20"
            placeholder={t('home.search')}
            value={worldSearchQuery}
            onChange={(e) => setWorldSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setWorldSelectedGroup('All')}
          className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all shadow-lg ${
            worldSelectedGroup === 'All' 
              ? 'bg-white text-black scale-105' 
              : 'bg-white/5 text-zinc-400 hover:bg-white/10'
          }`}
        >
          {t('home.allChannels')} <span className="ml-2 opacity-50">{groupCounts['All'] || 0}</span>
        </button>
        {worldPlaylist?.groups.map(group => (
          <button
            key={group}
            onClick={() => setWorldSelectedGroup(group)}
            className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all shadow-lg ${
              worldSelectedGroup === group 
                ? 'bg-white text-black scale-105' 
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            {group} <span className="ml-2 opacity-50">{groupCounts[group] || 0}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 [media(min-width:2000px)]:grid-cols-8 gap-4 sm:gap-6 md:gap-8">
        <AnimatePresence>
          {displayedChannels.map((channel, idx) => {
            const isPlaying = currentChannel?.id === channel.id;
            const isFav = favorites.some(c => c.id === channel.id);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: Math.min((idx % 60) * 0.02, 0.2) }}
                key={channel.id}
                className={`relative group rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-900/40 ${
                  isPlaying ? 'ring-4 ring-blue-500 shadow-2xl shadow-blue-900/50 -translate-y-2' : 'border border-white/5'
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
                    <Globe className="w-12 h-12 md:w-16 md:h-16 text-zinc-700" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                      <Play fill="currentColor" className="text-white ml-1 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                  
                  {/* Favorite Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(channel);
                    }}
                    className={`absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-xl rounded-full transition-all duration-300 hover:bg-black/80 hover:scale-110 ${isFav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <Heart size={20} className={isFav ? "fill-pink-500 text-pink-500" : "text-white"} />
                  </button>
                </div>
                
                <div className="p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <h3 className="font-bold text-base md:text-lg text-white truncate group-hover:text-blue-400 transition-colors">
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
      
      {filteredChannels.length > visibleCount && (
        <div ref={observerTarget} className="flex justify-center pt-12 pb-8">
          <LoadingIndicator theme="blue" />
        </div>
      )}

      {filteredChannels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Search className="text-zinc-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('home.noChannels')}</h2>
          <p className="text-zinc-400">{t('home.tryAdjusting')}</p>
        </div>
      )}

      <Player />
    </div>
  );
}
