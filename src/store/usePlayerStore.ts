import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Channel, Playlist } from '@/types';

export interface AppSettings {
  engine: 'hls' | 'react-player' | 'videojs';
  theme: 'dark' | 'light' | 'oled';
  autoPlay: boolean;
  volume: number;
  isMuted: boolean;
  language: 'en' | 'bn' | 'es' | 'ru' | 'ar' | 'hi' | 'ja' | 'zh';
}

export interface UploadedPlaylistMeta {
  id: string;
  name: string;
  channelCount: number;
  addedAt: number;
}

interface PlayerState {
  playlist: Playlist | null;
  worldPlaylist: Playlist | null;
  currentChannel: Channel | null;
  isPlaying: boolean;
  favorites: Channel[];
  searchQuery: string;
  selectedGroup: string;
  worldSearchQuery: string;
  worldSelectedGroup: string;
  setPlaylist: (playlist: Playlist) => void;
  setWorldPlaylist: (playlist: Playlist) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleFavorite: (channel: Channel) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGroup: (group: string) => void;
  setWorldSearchQuery: (query: string) => void;
  setWorldSelectedGroup: (group: string) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Custom Playlists
  uploadedPlaylists: UploadedPlaylistMeta[];
  addUploadedPlaylist: (meta: UploadedPlaylistMeta) => void;
  removeUploadedPlaylist: (id: string) => void;

  // Terms
  hasAcceptedTerms: boolean;
  setHasAcceptedTerms: (accepted: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
  playlist: null,
  worldPlaylist: null,
  currentChannel: null,
  isPlaying: false,
  favorites: [],
  searchQuery: '',
  selectedGroup: 'All',
  worldSearchQuery: '',
  worldSelectedGroup: 'All',
  uploadedPlaylists: [],
  hasAcceptedTerms: false,
  
  setHasAcceptedTerms: (accepted) => set({ hasAcceptedTerms: accepted }),

  addUploadedPlaylist: (meta) => set((state) => ({ uploadedPlaylists: [...state.uploadedPlaylists, meta] })),
  removeUploadedPlaylist: (id) => set((state) => ({ uploadedPlaylists: state.uploadedPlaylists.filter(p => p.id !== id) })),
  
  setPlaylist: (playlist) => set({ playlist }),
  
  setWorldPlaylist: (playlist) => set({ worldPlaylist: playlist }),
  
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
  
  setWorldSearchQuery: (query: string) => set({ worldSearchQuery: query }),
  
  setWorldSelectedGroup: (group: string) => set({ worldSelectedGroup: group }),
  
  settings: {
    engine: 'hls',
    theme: 'dark',
    autoPlay: true,
    volume: 1,
    isMuted: false,
    language: 'en',
  },
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
}),
{
  name: 'free-iptv-storage',
  partialize: (state) => ({ 
    favorites: state.favorites, 
    settings: state.settings, 
    uploadedPlaylists: state.uploadedPlaylists,
    hasAcceptedTerms: state.hasAcceptedTerms
  }),
}
  )
);
