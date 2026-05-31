"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Player() {
  const { currentChannel, setCurrentChannel } = usePlayerStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!currentChannel || !videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log("Auto-play prevented", e));
        setIsPlaying(true);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentChannel.url;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(e => console.log("Auto-play prevented", e));
        setIsPlaying(true);
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [currentChannel]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!currentChannel) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed z-[100] bg-black overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/10 group ${
          isFullscreen 
            ? "inset-0 rounded-none border-none" 
            : "bottom-24 md:bottom-8 right-4 md:right-8 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] lg:w-[500px] 2xl:w-[600px] aspect-video rounded-2xl"
        }`}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onClick={handleMouseMove} // for mobile tap
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black cursor-pointer"
          onClick={togglePlay}
          playsInline
        />
        
        <AnimatePresence>
          {(showControls || !isPlaying) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 flex flex-col justify-between p-4 sm:p-6 pointer-events-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
                  {currentChannel.logo && (
                    <img src={currentChannel.logo} alt="" className="h-8 w-8 object-contain rounded-md" />
                  )}
                  <span className="text-white font-bold text-sm sm:text-base lg:text-lg truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px]">
                    {currentChannel.name}
                  </span>
                </div>
                {!isFullscreen && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentChannel(null);
                    }}
                    className="p-2 sm:p-3 bg-black/60 backdrop-blur-xl rounded-full text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all shadow-lg"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Center Play Button Overlay for Mobile */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                    <Play size={32} fill="currentColor" className="ml-2" />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between mt-auto pointer-events-auto">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button 
                    onClick={togglePlay}
                    className="p-3 sm:p-4 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                  <button 
                    onClick={toggleMute}
                    className="p-3 sm:p-4 text-white hover:bg-white/20 rounded-full transition-colors backdrop-blur-md bg-black/40 border border-white/5"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="hidden sm:block p-3 text-white hover:bg-white/20 rounded-full transition-colors backdrop-blur-md bg-black/40 border border-white/5"
                  >
                    <Settings size={22} />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="p-3 sm:p-4 text-white hover:bg-white/20 rounded-full transition-colors backdrop-blur-md bg-black/40 border border-white/5"
                  >
                    {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
