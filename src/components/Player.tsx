"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X, Settings, ShieldAlert, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingIndicator } from "@/components/LoadingIndicator";

export function Player() {
  const { currentChannel, setCurrentChannel } = usePlayerStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showVpnPopup, setShowVpnPopup] = useState(false);
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const hlsRef = useRef<Hls | null>(null);
  const [qualities, setQualities] = useState<any[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  
  const hideControlsTimeout = useRef<NodeJS.Timeout>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!currentChannel || !videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    // Reset states for new channel
    setIsBuffering(true);
    setShowVpnPopup(false);
    setIsPlaying(false);
    setShowSettings(false);
    setQualities([]);
    setCurrentQuality(-1);
    
    // Clear any existing timeouts
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    
    // Set 60 second timeout for loading
    loadingTimeoutRef.current = setTimeout(() => {
      if (isBuffering || !isPlaying) {
        setShowVpnPopup(true);
      }
    }, 60000);

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
    const handleError = () => {
      setShowVpnPopup(true);
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;
      
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const uniqueQualities = data.levels.filter((l, i, self) => 
          i === self.findIndex((t) => t.height === l.height)
        );
        setQualities(uniqueQualities);
        setCurrentQuality(hls!.currentLevel);
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log("Auto-play prevented or interrupted", e);
          });
        }
      });
      
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setShowVpnPopup(true);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentChannel.url;
      video.addEventListener("loadedmetadata", () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log("Auto-play prevented or interrupted", e);
          });
        }
      });
    }

    return () => {
      if (hls) hls.destroy();
      hlsRef.current = null;
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [currentChannel]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(e => {
            console.log("Play interrupted", e);
            setIsPlaying(false);
          });
        }
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      const newMuteState = !isMuted;
      videoRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
      if (!newMuteState && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
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
      if (isPlaying && !showVpnPopup && !showSettings && !showVolumeSlider) setShowControls(false);
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
        drag={!isFullscreen}
        dragMomentum={false}
        whileDrag={{ scale: 1.02, cursor: "grabbing", boxShadow: "0 0 40px rgba(168,85,247,0.6)" }}
        className={`fixed z-[100] bg-black overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/10 group ${
          isFullscreen 
            ? "inset-0 rounded-none border-none" 
            : "bottom-24 md:bottom-8 right-4 md:right-8 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] lg:w-[500px] 2xl:w-[600px] aspect-video rounded-2xl cursor-grab"
        }`}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (isPlaying && !showVpnPopup && !showSettings && !showVolumeSlider) setShowControls(false);
        }}
        onClick={handleMouseMove}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black cursor-pointer"
          onClick={() => {
            if (showSettings) setShowSettings(false);
            else togglePlay();
          }}
          playsInline
        />

        {/* Buffering Indicator */}
        {isBuffering && !showVpnPopup && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm z-10">
            <div className="scale-75 md:scale-100">
              <LoadingIndicator theme="purple" />
            </div>
          </div>
        )}

        {/* VPN / Error Popup */}
        <AnimatePresence>
          {showVpnPopup && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 sm:p-6"
            >
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 sm:p-6 w-full max-w-sm text-center shadow-2xl shadow-red-900/20">
                <ShieldAlert size={40} className="text-red-500 mx-auto mb-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Stream Blocked?</h3>
                <p className="text-zinc-400 text-xs sm:text-sm mb-4 leading-relaxed">
                  This channel took too long to load. Your ISP might be blocking it, or the TV server may not support your country. We recommend using a free encrypted VPN to bypass this:
                </p>
                <div className="flex flex-col gap-2 mb-5">
                  <a href="https://1.1.1.1/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 sm:p-3 rounded-xl text-blue-400 font-semibold text-xs sm:text-sm transition-colors border border-white/5 hover:border-blue-500/30">
                    <img src="/logos/warp.png" className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-white/10" alt="WARP" />
                    Cloudflare WARP
                  </a>
                  <a href="https://protonvpn.com/free-vpn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 sm:p-3 rounded-xl text-purple-400 font-semibold text-xs sm:text-sm transition-colors border border-white/5 hover:border-purple-500/30">
                    <img src="/logos/proton.png" className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-white/10" alt="Proton" />
                    Proton VPN
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <a href="https://riseup.net/vpn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-xl text-green-400 font-semibold text-xs sm:text-sm transition-colors border border-white/5 hover:border-green-500/30">
                      <img src="/logos/riseup.png" className="w-5 h-5 rounded bg-white/10" alt="Riseup" />
                      RiseupVPN
                    </a>
                    <a href="https://psiphon.ca/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-xl text-pink-400 font-semibold text-xs sm:text-sm transition-colors border border-white/5 hover:border-pink-500/30">
                      <img src="/logos/psiphon.png" className="w-5 h-5 rounded bg-white/10" alt="Psiphon" />
                      Psiphon
                    </a>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVpnPopup(false);
                    setIsBuffering(false);
                  }} 
                  className="w-full py-2.5 sm:py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {(showControls || !isPlaying) && !showVpnPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 flex flex-col justify-between p-3 sm:p-4 pointer-events-none z-20"
            >
              {/* Header */}
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                  {currentChannel.logo && (
                    <img src={currentChannel.logo} alt="" className="h-6 w-6 object-contain rounded-md" />
                  )}
                  <span className="text-white font-bold text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px]">
                    {currentChannel.name}
                  </span>
                </div>
                {!isFullscreen && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentChannel(null);
                    }}
                    className="p-1.5 sm:p-2 bg-black/60 backdrop-blur-xl rounded-full text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all shadow-lg"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Center Play Button Overlay for Mobile */}
              {!isPlaying && !isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-purple-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between mt-auto pointer-events-auto">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={togglePlay}
                    className="p-2 sm:p-2.5 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                    disabled={isBuffering}
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </button>
                  
                  {/* Volume Control */}
                  <div 
                    className="flex items-center relative group"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button 
                      onClick={toggleMute}
                      className="p-2 sm:p-2.5 text-white hover:bg-white/20 rounded-full transition-colors backdrop-blur-md bg-black/40 border border-white/5"
                    >
                      {volume === 0 || isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div 
                          initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                          animate={{ width: 80, opacity: 1, marginLeft: 8 }}
                          exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                          className="overflow-hidden flex items-center bg-black/40 backdrop-blur-md rounded-full px-2 h-9 border border-white/5"
                        >
                          <input 
                            type="range" 
                            min="0" max="1" step="0.05" 
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setVolume(val);
                              if(videoRef.current) videoRef.current.volume = val;
                              if(val > 0 && isMuted) setIsMuted(false);
                              if(val === 0) setIsMuted(true);
                            }}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  {/* Settings Button & Menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      }}
                      className={`p-2 sm:p-2.5 rounded-full transition-colors backdrop-blur-md border border-white/5 ${showSettings ? 'bg-white/30 text-white' : 'bg-black/40 text-white hover:bg-white/20'}`}
                    >
                      <Settings size={18} className={showSettings ? 'rotate-90 transition-transform' : 'transition-transform'} />
                    </button>
                    
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full right-0 mb-3 w-40 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden"
                        >
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2">Quality</div>
                          
                          <button
                            onClick={() => {
                              if(hlsRef.current) hlsRef.current.currentLevel = -1;
                              setCurrentQuality(-1);
                              setShowSettings(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors text-white"
                          >
                            <span>Auto</span>
                            {currentQuality === -1 && <Check size={14} className="text-purple-400" />}
                          </button>
                          
                          {qualities.length === 0 && (
                            <div className="px-3 py-2 text-xs text-zinc-500 italic">No alternative streams</div>
                          )}
                          
                          {qualities.map((level, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if(hlsRef.current) hlsRef.current.currentLevel = i;
                                setCurrentQuality(i);
                                setShowSettings(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors text-white"
                            >
                              <span>{level.height}p</span>
                              {currentQuality === i && <Check size={14} className="text-purple-400" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 sm:p-2.5 text-white hover:bg-white/20 rounded-full transition-colors backdrop-blur-md bg-black/40 border border-white/5"
                  >
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
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
