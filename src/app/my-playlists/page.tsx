"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Upload, Trash2, Play, FileAudio } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { savePlaylistToDB, deletePlaylistFromDB } from "@/lib/db";
import { parseM3U } from "@/lib/m3uParser";
import Link from "next/link";

export default function MyPlaylistsPage() {
  const { uploadedPlaylists, addUploadedPlaylist, removeUploadedPlaylist } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".m3u") && !file.name.endsWith(".m3u8")) {
      alert("Please upload a valid .m3u or .m3u8 playlist file.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsedPlaylist = parseM3U(text);
      
      const id = Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9);
      const name = file.name.replace(/\.m3u8?$/i, "");
      
      // Save huge playlist strictly to IndexedDB to avoid freezing LocalStorage
      await savePlaylistToDB(id, parsedPlaylist);
      
      // Save metadata to Zustand for the UI
      addUploadedPlaylist({
        id,
        name,
        channelCount: parsedPlaylist.channels.length,
        addedAt: Date.now()
      });
      
    } catch (e) {
      console.error("Failed to parse playlist:", e);
      alert("Failed to parse the playlist file. It might be corrupted or in an unsupported format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this playlist?")) {
      removeUploadedPlaylist(id);
      await deletePlaylistFromDB(id);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight">
            My Playlists
          </h1>
          <p className="text-zinc-400 mt-2 text-sm md:text-base max-w-xl">
            Upload and manage your own custom M3U playlists. Playlists are stored locally in your browser's offline cache.
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={onDrop}
        className={`w-full relative overflow-hidden transition-all duration-300 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-12 text-center group ${
          isDragging 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="bg-purple-500/20 p-4 rounded-full mb-4 text-purple-400 group-hover:scale-110 transition-transform">
          {isProcessing ? <LoadingSpinner /> : <Upload size={32} />}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {isProcessing ? 'Processing Playlist...' : 'Drag & Drop your .m3u file here'}
        </h3>
        <p className="text-zinc-400 mb-6 text-sm">
          or click the button below to browse your files
        </p>
        
        <input 
          type="file" 
          id="file-upload" 
          accept=".m3u,.m3u8" 
          className="hidden" 
          disabled={isProcessing}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }} 
        />
        <label 
          htmlFor="file-upload"
          className="px-6 py-3 bg-white text-black font-bold rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors shadow-xl shadow-white/10 active:scale-95 disabled:opacity-50"
        >
          Select Playlist
        </label>
      </div>

      {/* Folders Grid */}
      {uploadedPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {uploadedPlaylists.map((playlist) => (
              <motion.div 
                key={playlist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/my-playlists/${playlist.id}`} className="block h-full">
                  <div className="glass-card rounded-3xl p-5 hover:bg-white/5 transition-colors group cursor-pointer relative h-full flex flex-col">
                    
                    <button 
                      onClick={(e) => handleDelete(e, playlist.id)}
                      className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-400/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-blue-400 shadow-inner border border-white/5 group-hover:scale-105 transition-transform">
                      <Folder size={32} fill="currentColor" className="opacity-50" />
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                      {playlist.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mt-auto">
                      <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg">
                        <Play size={12} /> {playlist.channelCount} Channels
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg">
                        <FileAudio size={12} /> {new Date(playlist.addedAt).toLocaleDateString()}
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Folder size={64} className="text-zinc-600 mb-4" />
          <h4 className="text-xl font-bold text-zinc-400 mb-2">No custom playlists yet</h4>
          <p className="text-zinc-500 max-w-sm">Upload an M3U file above and it will securely appear here as a folder.</p>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
  );
}
