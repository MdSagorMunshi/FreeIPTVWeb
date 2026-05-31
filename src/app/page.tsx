"use client";

import { useEffect, useState } from "react";
import { parseM3U } from "@/lib/m3uParser";
import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Search } from "lucide-react";
import { Player } from "@/components/Player";

export default function Home() {
  const { 
    playlist, setPlaylist, currentChannel, setCurrentChannel, 
    selectedGroup, setSelectedGroup, searchQuery, setSearchQuery,
    favorites, toggleFavorite
  } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);

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

  const filteredChannels = playlist?.channels.filter(channel => {
    const matchesGroup = selectedGroup === 'All' || channel.group === selectedGroup;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-zinc-400 font-medium tracking-widest uppercase">Loading Channels...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-8 pb-32">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Discover <span className="text-gradient">Live TV</span>
          </h1>
          <p className="text-zinc-400 text-lg">Watch your favorite channels in stunning quality.</p>
        </div>

        <div className="relative group w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full md:w-[300px] pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all glass placeholder-zinc-500 text-white"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-2 px-2">
        <button
          onClick={() => setSelectedGroup('All')}
          className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
            selectedGroup === 'All' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white glass'
          }`}
        >
          All Channels
        </button>
        {playlist?.groups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
              selectedGroup === group 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white glass'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <AnimatePresence>
          {filteredChannels.map((channel, idx) => {
            const isPlaying = currentChannel?.id === channel.id;
            const isFav = favorites.some(c => c.id === channel.id);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.5) }}
                key={channel.id}
                className={`relative group rounded-2xl overflow-hidden glass-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/30 ${
                  isPlaying ? 'ring-2 ring-purple-500 shadow-xl shadow-purple-900/20' : ''
                }`}
                onClick={() => setCurrentChannel(channel)}
              >
                <div className="aspect-video bg-zinc-900/50 flex items-center justify-center p-6 relative">
                  {channel.logo ? (
                    <img 
                      src={channel.logo} 
                      alt={channel.name}
                      className="w-full h-full object-contain drop-shadow-xl"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InNpbHZlciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iNSAzIDE5IDEyIDUgMjEgNSAzIj48L3BvbHlnb24+PC9zdmc+' }}
                    />
                  ) : (
                    <Play className="w-12 h-12 text-zinc-700" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                      <Play fill="currentColor" className="text-white ml-1 w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Favorite Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(channel);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
                  >
                    <Heart size={16} className={isFav ? "fill-pink-500 text-pink-500" : "text-white"} />
                  </button>
                </div>
                
                <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-medium truncate">
                    {channel.group}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {filteredChannels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Search size={48} className="mb-4 opacity-50" />
          <p className="text-xl font-medium">No channels found</p>
          <p className="text-sm mt-2">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* Floating Player */}
      <Player />
    </div>
  );
}
