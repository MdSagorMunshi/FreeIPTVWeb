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
          <h1 className="text-4xl font-black text-primary-text">{t('playlists.title')}</h1>
          <p className="text-secondary-text mt-2">{t('playlists.subtitle')}</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-[12px] border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center justify-center text-center ${
          isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-md' 
            : 'border-border-light bg-surface hover:bg-background hover:border-primary'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-xl font-bold text-primary-text">Processing Playlist...</p>
            <p className="text-secondary-text text-sm mt-2">Saving to offline database</p>
          </div>
        ) : (
          <>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${isDragging ? 'bg-primary/20 text-primary' : 'bg-background text-secondary-text border border-border-light'}`}>
              <Upload size={36} />
            </div>
            <h3 className="text-2xl font-bold text-primary-text mb-2">{t('playlists.dragDrop')}</h3>
            <p className="text-secondary-text mb-8 max-w-sm">or click the button below to browse your files</p>
            
            <label className="relative overflow-hidden group cursor-pointer">
              <input type="file" accept=".m3u" className="hidden" onChange={handleFileInput} />
              <div className="px-8 py-4 bg-primary text-white font-bold rounded-[8px] shadow-sm transition-transform group-hover:scale-105 active:scale-95 flex items-center gap-2">
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
              className="group relative bg-surface border border-border-light rounded-[12px] p-6 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
              onClick={() => router.push(`/my-playlists/${pl.id}`)}
            >
              {/* Delete Button */}
              <button 
                onClick={(e) => handleDelete(pl.id, e)}
                className="absolute top-4 right-4 p-2.5 bg-red-500/10 text-red-400 rounded-[8px] opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>

              <div className="w-16 h-16 bg-primary/10 rounded-[8px] flex items-center justify-center mb-4 shadow-sm">
                <Folder size={32} className="text-primary" />
              </div>

              <h3 className="text-xl font-bold text-primary-text mb-2 line-clamp-1">{pl.name}</h3>
              <div className="flex items-center gap-2 text-sm text-secondary-text">
                <Play size={14} className="text-accent" />
                {pl.channelCount.toLocaleString()} {t('playlists.channels')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {uploadedPlaylists.length === 0 && !isUploading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Folder size={64} className="text-muted-text mb-6" />
          <h2 className="text-2xl font-bold text-primary-text mb-2">{t('playlists.noPlaylists')}</h2>
          <p className="text-secondary-text">{t('playlists.uploadDesc')}</p>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  );
}
