"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlaylistFromDB } from "@/lib/db";
import { Playlist } from "@/types";
import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Search, ArrowLeft } from "lucide-react";
import { Player } from "@/components/Player";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import Link from "next/link";

export default function CustomPlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;
  
  const { 
    currentChannel, setCurrentChannel, 
    favorites, toggleFavorite,
    uploadedPlaylists
  } = usePlayerStore();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [visibleCount, setVisibleCount] = useState(60);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);

  const playlistMeta = useMemo(() => {
    return uploadedPlaylists.find(p => p.id === playlistId);
  }, [uploadedPlaylists, playlistId]);

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
          // Playlist deleted or not found in IndexedDB
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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(60);
  }, [selectedGroup, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingIndicator theme="purple" />
        <p className="mt-8 text-zinc-400 font-bold tracking-[0.2em] uppercase text-sm md:text-base">Loading Playlist from Database...</p>
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-10 pb-32 md:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <Link href="/my-playlists" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 text-sm font-semibold">
            <ArrowLeft size={16} /> Back to My Playlists
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-2 md:mb-4">
            {playlistMeta?.name || 'Custom Playlist'}
          </h1>
          <p className="text-zinc-400 text-base md:text-lg lg:text-xl max-w-2xl">
            Custom offline playlist loaded securely from your browser cache.
            <span className="block mt-2 font-semibold text-purple-400">
              Showing {filteredChannels.length} {filteredChannels.length === 1 ? 'channel' : 'channels'}
            </span>
          </p>
        </div>

        <div className="relative group w-full lg:w-[400px] xl:w-[500px]">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 md:h-6 md:w-6 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-6 py-4 md:py-5 text-base md:text-lg bg-zinc-900/50 border border-zinc-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all glass placeholder-zinc-500 text-white shadow-xl shadow-black/20"
            placeholder="Search channels inside playlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSelectedGroup('All')}
          className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 text-xs md:text-sm flex items-center gap-2 ${
            selectedGroup === 'All' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-900/40 scale-105' 
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white glass'
          }`}
        >
          All Channels <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs ${selectedGroup === 'All' ? 'bg-white/20 text-white' : 'bg-black/30 text-zinc-500'}`}>{groupCounts['All'] || 0}</span>
        </button>
        {playlist?.groups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 text-xs md:text-sm flex items-center gap-2 ${
              selectedGroup === group 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-900/40 scale-105' 
                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white glass'
            }`}
          >
            {group} <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs ${selectedGroup === group ? 'bg-white/20 text-white' : 'bg-black/30 text-zinc-500'}`}>{groupCounts[group] || 0}</span>
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
                className={`relative group rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-900/40 ${
                  isPlaying ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-900/50 -translate-y-2' : 'border border-white/5'
                }`}
                onClick={() => setCurrentChannel({ ...channel, group: `${playlistMeta?.name || 'Custom'} - ${channel.group}` })}
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
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.6)] transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
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
                  <h3 className="font-bold text-base md:text-lg text-white truncate group-hover:text-purple-400 transition-colors">
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
          <LoadingIndicator theme="purple" />
        </div>
      )}

      {filteredChannels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <Search size={64} className="mb-6 opacity-30" />
          <p className="text-2xl md:text-3xl font-black text-white">No channels found</p>
          <p className="text-base md:text-lg mt-3 text-zinc-400">Try adjusting your search or category filter.</p>
        </div>
      )}

      <Player />
    </div>
  );
}
