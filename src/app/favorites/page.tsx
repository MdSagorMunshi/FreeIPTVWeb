"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Search } from "lucide-react";
import { Player } from "@/components/Player";
import { useState } from "react";

export default function Favorites() {
  const { 
    favorites, currentChannel, setCurrentChannel, toggleFavorite
  } = usePlayerStore();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = favorites.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Your <span className="text-pink-500">Favorites</span>
          </h1>
          <p className="text-zinc-400 text-lg">Your curated collection of top channels.</p>
        </div>

        <div className="relative group w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-pink-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full md:w-[300px] pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all glass placeholder-zinc-500 text-white"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <Heart size={64} className="mb-6 opacity-20" />
          <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
          <p className="text-lg">Click the heart icon on any channel to add it here.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredChannels.map((channel, idx) => {
              const isPlaying = currentChannel?.id === channel.id;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.5) }}
                  key={channel.id}
                  className={`relative group rounded-2xl overflow-hidden glass-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-900/30 ${
                    isPlaying ? 'ring-2 ring-pink-500 shadow-xl shadow-pink-900/20' : ''
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
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                        <Play fill="currentColor" className="text-white ml-1 w-5 h-5" />
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(channel);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full opacity-100 transition-opacity duration-300 hover:bg-black/60"
                    >
                      <Heart size={16} className="fill-pink-500 text-pink-500" />
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-semibold text-white truncate group-hover:text-pink-400 transition-colors">
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
      )}
      <Player />
    </div>
  );
}
