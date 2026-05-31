import { create } from 'zustand';
import { Channel, Playlist } from '@/types';

interface PlayerState {
  playlist: Playlist | null;
  currentChannel: Channel | null;
  isPlaying: boolean;
  favorites: Channel[];
  searchQuery: string;
  selectedGroup: string;
  setPlaylist: (playlist: Playlist) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleFavorite: (channel: Channel) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGroup: (group: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  playlist: null,
  currentChannel: null,
  isPlaying: false,
  favorites: [],
  searchQuery: '',
  selectedGroup: 'All',
  
  setPlaylist: (playlist) => set({ playlist }),
  
  setCurrentChannel: (channel) => set({ currentChannel: channel, isPlaying: !!channel }),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  toggleFavorite: (channel) => set((state) => {
    const isFav = state.favorites.some((c) => c.id === channel.id);
    return {
      favorites: isFav 
        ? state.favorites.filter((c) => c.id !== channel.id)
        : [...state.favorites, channel]
    };
  }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedGroup: (group) => set({ selectedGroup: group }),
}));
