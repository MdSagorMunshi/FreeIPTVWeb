"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { parseM3U } from "@/lib/m3uParser";
import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Search, Tv } from "lucide-react";
import { Player } from "@/components/Player";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LoadingIndicator } from "@/components/LoadingIndicator";

export default function Home() {
  const { 
    playlist, setPlaylist, currentChannel, setCurrentChannel, 
    selectedGroup, setSelectedGroup, searchQuery, setSearchQuery,
    favorites, toggleFavorite
  } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(60);
  const { t } = useTranslation();
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
        const response = await fetch('/aynaott.m3u');
        const text = await response.text();
        const parsed = parseM3U(text);
        setPlaylist(parsed);
      } catch (error) {
        console.error("Failed to load playlist", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!playlist) {
      loadPlaylist();
    } else {
      setIsLoading(false);
    }
  }, [playlist, setPlaylist]);

  const filteredChannels = useMemo(() => {
    if (!playlist) return [];
    return playlist.channels.filter(channel => {
      const matchesGroup = selectedGroup === 'All' || channel.group === selectedGroup;
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [playlist, selectedGroup, searchQuery]);

  const groupCounts = useMemo(() => {
    if (!playlist) return { 'All': 0 };
    return playlist.channels.reduce((acc, channel) => {
      acc[channel.group] = (acc[channel.group] || 0) + 1;
      acc['All'] = (acc['All'] || 0) + 1;
      return acc;
    }, { 'All': 0 } as Record<string, number>);
  }, [playlist]);

  const displayedChannels = filteredChannels.slice(0, visibleCount);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(60);
  }, [selectedGroup, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingIndicator theme="primary" />
        <p className="mt-8 text-secondary-text font-black tracking-widest uppercase text-xs md:text-sm">Initializing Core...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-10 pb-36 md:pb-16 px-4 md:px-0">
      {/* Header Area */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-2 sm:mb-4 tracking-tight text-primary-text">
            {t('home.discover')} <br className="hidden sm:block" /> 
            <span className="premium-gradient-text">{t('home.liveTv')}</span>
          </h1>
          <p className="text-secondary-text text-sm sm:text-base max-w-xl leading-relaxed font-medium">
            {t('home.subtitle')}
            <span className="block mt-2 font-bold text-primary">
              {t('home.showingChannels', filteredChannels.length)}
            </span>
          </p>
        </div>

        {/* Premium Matte Search Input */}
        <div className="relative group w-full lg:w-[400px] xl:w-[500px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-text group-focus-within:text-primary transition-colors duration-300" />
          <input
            type="text"
            className="w-full pl-14 pr-6 py-4 md:py-5 text-base md:text-lg bg-surface/60 dark:bg-surface/50 backdrop-blur-2xl border border-border-light rounded-full focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-transparent transition-all placeholder-muted-text text-primary-text shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
            placeholder={t('home.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Premium Dynamic Category Pillbox */}
      <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedGroup('All')}
          className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-xs md:text-sm flex items-center gap-2 border ${
            selectedGroup === 'All' 
              ? 'bg-primary text-white border-primary/20 shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
              : 'bg-surface/60 dark:bg-surface/50 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
          }`}
        >
          {t('home.allChannels')} 
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            selectedGroup === 'All' 
              ? 'bg-white/20 text-white' 
              : 'bg-border-light text-muted-text'
          }`}>
            {groupCounts['All'] || 0}
          </span>
        </motion.button>
        {playlist?.groups.map(group => (
          <motion.button
            key={group}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedGroup(group)}
            className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-xs md:text-sm flex items-center gap-2 border ${
              selectedGroup === group 
                ? 'bg-primary text-white border-primary/20 shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                : 'bg-surface/60 dark:bg-surface/50 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
            }`}
          >
            {group} 
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              selectedGroup === group 
                ? 'bg-white/20 text-white' 
                : 'bg-border-light text-muted-text'
            }`}>
              {groupCounts[group] || 0}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Channel Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 [media(min-width:2000px)]:grid-cols-8 gap-4 sm:gap-6 md:gap-8">
        <AnimatePresence>
          {displayedChannels.map((channel, idx) => {
            const isPlaying = currentChannel?.id === channel.id;
            const isFav = favorites.some(c => c.id === channel.id);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: Math.min((idx % 60) * 0.015, 0.15) }}
                key={channel.id}
                className={`relative group rounded-2xl overflow-hidden cursor-pointer matte-card matte-card-hover ${
                  isPlaying 
                    ? 'ring-2 ring-primary bg-primary/5 shadow-lg border-primary/30 -translate-y-1' 
                    : ''
                }`}
                onClick={() => setCurrentChannel(channel)}
              >
                {/* Logo Aspect Container */}
                <div className="aspect-video bg-background/50 dark:bg-background/30 flex items-center justify-center p-3 md:p-4 relative">
                  {channel.logo ? (
                    <img 
                      src={channel.logo} 
                      alt={channel.name}
                      className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)]"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InNpbHZlciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iNSAzIDE5IDEyIDUgMjEgNSAzIj48L3BvbHlnb24+PC9zdmc+' }}
                    />
                  ) : (
                    <Tv className="w-8 h-8 md:w-10 md:h-10 text-muted-text/70" />
                  )}
                  
                  {/* Frosted Play Overlay */}
                  <div className="absolute inset-0 bg-black/25 dark:bg-black/35 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
                      initial={{ scale: 0.7 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play fill="currentColor" className="ml-1 w-5 h-5 md:w-6 md:h-6" />
                    </motion.div>
                  </div>
                  
                  {/* Favorite Button Overlay */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(channel);
                    }}
                    className={`absolute top-3 right-3 p-2 bg-surface/85 backdrop-blur-md border border-border-light rounded-full shadow-sm transition-all duration-300 hover:bg-surface ${
                      isFav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Heart size={14} className={isFav ? "fill-accent text-accent animate-pulse" : "text-secondary-text"} />
                  </motion.button>
                </div>
                
                {/* Meta details footer */}
                <div className="p-4 bg-surface/30 dark:bg-surface/10 border-t border-border-light backdrop-blur-md">
                  <h3 className="font-bold text-sm md:text-base text-primary-text truncate group-hover:text-primary transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-secondary-text mt-1 uppercase tracking-wider font-extrabold truncate opacity-80">
                    {channel.group}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Infinite Scroll target */}
      {filteredChannels.length > visibleCount && (
        <div ref={observerTarget} className="flex justify-center pt-12 pb-8">
          <LoadingIndicator theme="primary" />
        </div>
      )}
      
      {/* End of results */}
      {filteredChannels.length > 0 && filteredChannels.length <= visibleCount && (
        <div className="flex justify-center pt-16 pb-8">
          <p className="text-muted-text font-black tracking-[0.3em] uppercase text-xs">End of all channels</p>
        </div>
      )}

      {/* No channels fallback */}
      {filteredChannels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border border-border-light rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Search className="text-muted-text" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-primary-text mb-2">{t('home.noChannels')}</h2>
          <p className="text-secondary-text text-sm max-w-sm">{t('home.tryAdjusting')}</p>
        </div>
      )}

      <Player />
    </div>
  );
}
