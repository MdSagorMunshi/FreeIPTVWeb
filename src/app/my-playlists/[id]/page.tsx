"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlaylistFromDB } from "@/lib/db";
import { Playlist } from "@/types";
import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Search, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Player } from "@/components/Player";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import Link from "next/link";

export default function CustomPlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;
  
  const { currentChannel, setCurrentChannel, toggleFavorite, favorites, settings } = usePlayerStore();
  
  const { t } = useTranslation();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
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
      setIsLoading(true);
      try {
        const data = await getPlaylistFromDB(playlistId);
        if (data) {
          setPlaylist(data);
        } else {
          alert("Playlist not found in local storage.");
          router.push('/my-playlists');
        }
      } catch (error) {
        console.error("Failed to load playlist from IndexedDB", error);
        router.push('/my-playlists');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (playlistId) {
      loadPlaylist();
    }
  }, [playlistId, router]);

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

  useEffect(() => {
    setVisibleCount(60);
  }, [selectedGroup, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingIndicator theme="primary" />
        <p className="mt-8 text-secondary-text font-bold tracking-[0.2em] uppercase text-sm md:text-base">Loading Playlist from Database...</p>
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-10 pb-32 md:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <Link href="/my-playlists" className="inline-flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors mb-4 text-sm font-semibold">
            <ArrowLeft size={16} /> Back to My Playlists
          </Link>
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-text leading-tight mb-2 tracking-tight line-clamp-1">
              {playlist.name}
            </h1>
            <p className="text-secondary-text text-sm sm:text-base max-w-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('home.showingChannels', filteredChannels.length)}
            </p>
          </div>
        </div>

        <div className="relative group w-full lg:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={t('home.search')}
            className="w-full pl-14 pr-6 py-4 md:py-5 text-base md:text-lg bg-surface border border-border-light rounded-[999px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-muted-text text-primary-text shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <button 
          onClick={() => setSelectedGroup('All')}
          className={`px-5 py-2.5 rounded-[999px] font-bold whitespace-nowrap transition-all shadow-sm text-xs md:text-sm flex items-center gap-2 border ${
            selectedGroup === 'All' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-surface text-secondary-text hover:bg-background border-border-light'
          }`}
        >
          {t('home.allChannels')} <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs ${selectedGroup === 'All' ? 'bg-white/20' : 'bg-border-light text-muted-text'}`}>{groupCounts['All'] || 0}</span>
        </button>
        {playlist?.groups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-4 py-2 md:px-5 md:py-2.5 rounded-[999px] font-bold whitespace-nowrap transition-all duration-300 text-xs md:text-sm flex items-center gap-2 border ${
              selectedGroup === group 
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'bg-surface text-secondary-text hover:bg-background hover:text-primary-text border-border-light'
            }`}
          >
            {group} <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs ${selectedGroup === group ? 'bg-white/20 text-white' : 'bg-border-light text-muted-text'}`}>{groupCounts[group] || 0}</span>
          </button>
        ))}
      </div>

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
                className={`relative group rounded-[12px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  isPlaying ? 'ring-2 ring-primary shadow-md -translate-y-1 bg-surface' : 'border border-border-light bg-surface'
                }`}
                onClick={() => setCurrentChannel({ ...channel, group: `${playlist.name} - ${channel.group}` })}
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
                    className={`absolute top-4 right-4 p-2 bg-surface border border-border-light rounded-full transition-all duration-300 hover:bg-border-light hover:scale-110 ${isFav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <Heart size={16} className={isFav ? "fill-accent text-accent" : "text-muted-text"} />
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

      {filteredChannels.length > visibleCount && (
        <div ref={observerTarget} className="flex justify-center pt-12 pb-8">
          <LoadingIndicator theme="primary" />
        </div>
      )}

      {filteredChannels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-background border border-border-light rounded-full flex items-center justify-center mb-6">
            <Search className="text-muted-text" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-primary-text mb-2">{t('home.noChannels')}</h2>
          <p className="text-secondary-text">{t('home.tryAdjusting')}</p>
        </div>
      )}

      <Player />
    </div>
  );
}
