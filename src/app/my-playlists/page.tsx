"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Upload, Trash2, Play, FileAudio } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { parseM3U } from "@/lib/m3uParser";
import { savePlaylistToDB, deletePlaylistFromDB } from "@/lib/db";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Link from "next/link";

export default function MyPlaylistsPage() {
  const { uploadedPlaylists, addUploadedPlaylist, removeUploadedPlaylist } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".m3u") && !file.name.endsWith(".m3u8")) {
      alert("Please upload a valid .m3u or .m3u8 playlist file.");
      return;
    }
    
    setIsUploading(true);
    try {
      const text = await file.text();
      const parsedPlaylist = parseM3U(text);
      
      const id = Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9);
      const name = file.name.replace(/\.m3u8?$/i, "");
      
      await savePlaylistToDB(id, parsedPlaylist);
      
      addUploadedPlaylist({
        id,
        name,
        channelCount: parsedPlaylist.channels.length,
        addedAt: Date.now()
      });
      
    } catch (e) {
      console.error("Failed to parse playlist:", e);
      alert("Failed to parse the playlist file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
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
          <h1 className="text-4xl font-black text-white">{t('playlists.title')}</h1>
          <p className="text-zinc-400 mt-2">{t('playlists.subtitle')}</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center justify-center text-center ${
          isDragging 
            ? 'border-purple-500 bg-purple-500/10 scale-[1.02] shadow-[0_0_40px_rgba(168,85,247,0.3)]' 
            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-xl font-bold text-white">Processing Playlist...</p>
            <p className="text-zinc-400 text-sm mt-2">Saving to offline database</p>
          </div>
        ) : (
          <>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${isDragging ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-zinc-400'}`}>
              <Upload size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('playlists.dragDrop')}</h3>
            <p className="text-zinc-400 mb-8 max-w-sm">or click the button below to browse your files</p>
            
            <label className="relative overflow-hidden group cursor-pointer">
              <input type="file" accept=".m3u" className="hidden" onChange={handleFileInput} />
              <div className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform group-hover:scale-105 active:scale-95 flex items-center gap-2">
                <FileAudio size={20} />
                {t('playlists.select')}
              </div>
            </label>
          </>
        )}
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {uploadedPlaylists.map((pl) => (
            <motion.div
              key={pl.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all cursor-pointer shadow-lg hover:shadow-purple-900/20"
              onClick={() => router.push(`/my-playlists/${pl.id}`)}
            >
              {/* Delete Button */}
              <button 
                onClick={(e) => handleDelete(pl.id, e)}
                className="absolute top-4 right-4 p-2.5 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>

              <div className="w-16 h-16 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/20">
                <Folder size={32} className="text-purple-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{pl.name}</h3>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Play size={14} className="text-pink-400" />
                {pl.channelCount.toLocaleString()} {t('playlists.channels')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {uploadedPlaylists.length === 0 && !isUploading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Folder size={64} className="text-zinc-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('playlists.noPlaylists')}</h2>
          <p className="text-zinc-400">{t('playlists.uploadDesc')}</p>
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
